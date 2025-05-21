package com.example.oauthjwt.service.elastic;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.DonationDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ProductDocument;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.repository.ProductRepository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Log4j2
public class ElasticSearchService {
    private static final String CACHE_PREFIX = "donation:search:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final ElasticsearchClient client;
    private final ProductRepository productRepository;
    private final RedisTemplate<String, PageResult<DonationDocument>> redisTemplate;

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        try {
            SearchResponse<ProductDocument> response = client.search(
                    s -> s.index("product_index")
                            .query(q -> q.multiMatch(m -> m.query(keyword)
                                    .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
                                            "ownerName^0.2")
                                    .fuzziness("1").prefixLength(1).minimumShouldMatch("75%"))),
                    ProductDocument.class);

            List<Hit<ProductDocument>> hits = response.hits().hits();
            if (hits.isEmpty()) {
                return null;
            }

            List<Long> ids = hits.stream().map(hit -> hit.source().getId()).collect(Collectors.toList());
            Page<Product> productList = productRepository.findByIdIn(ids, pageable);
            return productList.map(ProductResponse::toDto);

        } catch (IOException e) {
            log.error("Product search error: {}", e.getMessage(), e);
            throw new RuntimeException("Product 검색 중 오류가 발생했습니다.", e);
        }
    }

    public PageResult<BoardDocument> searchBoards(String keyword, int page, int size) {
        try {
            int from = Math.max(0, page * size);
            SearchResponse<BoardDocument> response = client.search(s -> s.index("board_index").from(from).size(size)
                    .query(q -> q.multiMatch(m -> m.query(keyword)
                            .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
                                    "authorName^0.2")
                            .fuzziness("1").prefixLength(1).minimumShouldMatch("75%")))
                    .sort(sort -> sort.field(f -> f.field("createdAt").order(SortOrder.Desc))), BoardDocument.class);

            List<BoardDocument> hits = response.hits().hits().stream().map(Hit::source).filter(Objects::nonNull)
                    .toList();
            long total = response.hits().total() != null ? response.hits().total().value() : 0;
            int totalPages = (int) Math.ceil((double) total / size);
            return new PageResult<>(hits, page, size, total, totalPages);
        } catch (IOException e) {
            log.error("Board search error: {}", e.getMessage());
            throw new RuntimeException("Board 검색 중 오류", e);
        }
    }

    public PageResult<DonationDocument> searchDonations(String keyword, int page, int size) {

        // 1) 캐시 키 생성
        String cacheKey = CACHE_PREFIX + keyword + ":" + page + ":" + size;
        BoundValueOperations<String, PageResult<DonationDocument>> ops = redisTemplate.boundValueOps(cacheKey);

        // 2) 캐시 조회
        try {
            PageResult<DonationDocument> cached = ops.get();
            if (cached != null) {
                log.info("CACHE HIT — key={}", cacheKey);
                return cached;
            }
        } catch (Exception e) {
            log.warn("Redis read 실패 — key={}, error={}", cacheKey, e.getMessage());
        }

        // 3) 엘라스틱 서치 조회
        int from = Math.max(0, page * size);
        SearchResponse<DonationDocument> response;
        try {
            response = client.search(s -> s.index("donation_index").from(from).size(size)
                    .query(q -> q.multiMatch(m -> m.query(keyword)
                            .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
                                    "authorName^0.2")
                            .fuzziness("1").prefixLength(1).minimumShouldMatch("75%")))
                    .sort(sort -> sort.field(f -> f.field("createdAt").order(SortOrder.Desc))), DonationDocument.class);
        } catch (IOException e) {
            log.error("Donation search error: {}", e.getMessage());
            throw new RuntimeException("Donation 검색 중 오류", e);
        }

        // 4) 결과 가공
        List<DonationDocument> hits = response.hits().hits().stream()
                .map(Hit::source)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        long total = Optional.ofNullable(response.hits().total())
                .map(t -> t.value())
                .orElse(0L);
        int totalPages = (int) Math.ceil((double) total / size);
        PageResult<DonationDocument> result =
                new PageResult<>(hits, page, size, total, totalPages);

        // 5) 캐시에 저장
        try {
            ops.set(result, CACHE_TTL);
            log.info("CACHE PUT — key={}", cacheKey);
        } catch (Exception e) {
            log.warn("Redis write 실패 — key={}, error={}", cacheKey, e.getMessage());
        }

        return result;
    }

    public List<String> autocomplete(String prefix, String index) {
        try {
            // Detect if the prefix is Korean (contains Hangul)
            boolean isKorean = prefix.matches(".*[가-힣].*");
            List<String> nounSuggestions = new ArrayList<>();
            List<String> phraseSuggestions = new ArrayList<>();

            // Step 1: Get noun suggestions using completion suggester
            SearchResponse<Void> response = client.search(s -> s.index(index).suggest(
                            sug -> sug.suggesters("completion_suggest", sugField -> sugField.prefix(prefix.toLowerCase())
                                    .completion(c -> c.field("suggest").size(10).fuzzy(f -> f.fuzziness("AUTO"))))),
                    Void.class);

            List<String> completionSuggestions = response.suggest().get("completion_suggest").stream()
                    .flatMap(s -> s.completion().options().stream())
                    .map(option -> option.text())
                    .distinct()
                    .limit(10)
                    .collect(Collectors.toList());

            if (isKorean) {
                // Filter completion suggestions to include only nouns with length > 1
                nounSuggestions.addAll(completionSuggestions.stream()
                        .filter(s -> !KoreanNounExtractor.extractNouns(s).isEmpty())
                        .filter(s -> s.length() > 1)
                        .collect(Collectors.toList()));
                // Add nouns from prefix itself, excluding single syllables
                nounSuggestions.addAll(KoreanNounExtractor.extractNouns(prefix).stream()
                        .filter(s -> s.length() > 1)
                        .collect(Collectors.toList()));
            } else {
                // For English, use completion suggestions directly
                nounSuggestions.addAll(completionSuggestions);
            }

            // Step 2: Generate phrase suggestions (at least two) using title only
            if (!nounSuggestions.isEmpty()) {
                if (index.equals("board_index")) {
                    SearchResponse<BoardDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0))
                                    .fields("title^1.5")))
                            .size(3), BoardDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList());
                } else if (index.equals("product_index")) {
                    SearchResponse<ProductDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0))
                                    .fields("title^1.5")))
                            .size(3), ProductDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList());
                } else if (index.equals("donation_index")) {
                    SearchResponse<DonationDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0))
                                    .fields("title^1.5")))
                            .size(3), DonationDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList());
                }
            }

            // Step 3: Fallback if insufficient suggestions
            if (nounSuggestions.isEmpty() && phraseSuggestions.isEmpty()) {
                if (index.equals("board_index")) {
                    // Search title field directly for boards
                    SearchResponse<BoardDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix)
                                    .fields("title^1.5")
                                    .fuzziness("AUTO")))
                            .size(5), BoardDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));
                } else if (index.equals("product_index")) {
                    // Search title field directly for products
                    SearchResponse<ProductDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix)
                                    .fields("title^1.5")
                                    .fuzziness("AUTO")))
                            .size(5), ProductDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));
                } else if (index.equals("donation_index")) {
                    // Search title field directly for products
                    SearchResponse<DonationDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix)
                                    .fields("title^1.5")
                                    .fuzziness("AUTO")))
                            .size(5), DonationDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream()
                            .map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s)
                            .distinct()
                            .limit(3)
                            .collect(Collectors.toList()));
                }
            }

            // Combine results: nouns first, then phrases
            List<String> results = new ArrayList<>();
            results.addAll(nounSuggestions.stream().distinct().limit(5).collect(Collectors.toList()));
            results.addAll(phraseSuggestions.stream().distinct().limit(5).collect(Collectors.toList()));

            log.info("Autocomplete for prefix '{}', index '{}': {} results", prefix, index, results.size());
            return results;
        } catch (IOException e) {
            log.error("Autocomplete error: {}", e.getMessage());
            throw new RuntimeException("자동완성 실패", e);
        }
    }
}