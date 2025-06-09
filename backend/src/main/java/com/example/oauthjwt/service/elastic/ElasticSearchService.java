package com.example.oauthjwt.service.elastic;

import static org.springframework.data.elasticsearch.annotations.IndexOptions.docs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.dto.document.BoardDocument;
import com.example.oauthjwt.dto.document.DonationDocument;
import com.example.oauthjwt.dto.document.ProductDocument;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.ProductResponse;

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
@CacheConfig(cacheNames = {"donationSearch", "boardSearch", "searchProducts"})
@Transactional(readOnly = true)
public class ElasticSearchService {

    private static final String DONATION_INDEX = "donation_index";
    private static final String PRODUCT_INDEX = "product_index";
    private static final String BOARD_INDEX = "board_index";

    private final ElasticsearchClient client;

    @Cacheable(cacheNames = "searchProducts", key = "#keyword + ':' + #page + ':' + #size")
    public PageResult<ProductResponse> searchProducts(String keyword, int page, int size) {
        try {
            int from = Math.max(0, page * size);
            SearchResponse<ProductDocument> response = client.search(s -> s.index(PRODUCT_INDEX).from(from).size(size)
                    .query(q -> q.multiMatch(m -> m.query(keyword)
                            .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
                                    "ownerName^0.2")
                            .fuzziness("1").prefixLength(1).minimumShouldMatch("75%")))
                    .sort(o -> o.field(f -> f.field("createdAt").order(SortOrder.Desc))), ProductDocument.class);
            log.info("search end");
            List<ProductDocument> docs = response.hits().hits().stream().map(Hit::source).filter(Objects::nonNull)
                    .collect(Collectors.toList());

            long total = Optional.ofNullable(response.hits().total()).map(t -> t.value()).orElse(0L);

            int totalPages = (int) Math.ceil((double) total / size);

            // Document → Response DTO 매핑
            List<ProductResponse> content = docs.stream().map(ProductResponse::toDto).collect(Collectors.toList());

            return new PageResult<>(content, page, size, total, totalPages);

        } catch (IOException e) {
            log.error("Product search error: {}", e.getMessage(), e);
            throw new RuntimeException("Product 검색 중 오류", e);
        }
    }

    public PageResult<BoardDocument> searchBoards(String keyword, int page, int size) {
        try {
            int from = Math.max(0, page * size);
            SearchResponse<BoardDocument> response = client.search(s -> s.index(BOARD_INDEX).from(from).size(size)
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

    @Cacheable(cacheNames = "searchDonations", key = "#keyword + ':' + #page + ':' + #size")
    public PageResult<DonationResponse> searchDonations(String keyword, int page, int size) {
        try {
            int from = Math.max(0, page * size);
            SearchResponse<DonationDocument> response = client.search(s -> s.index(DONATION_INDEX).from(from).size(size)
                    .query(q -> q.multiMatch(m -> m.query(keyword)
                            .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
                                    "authorName^0.2")
                            .fuzziness("1").prefixLength(1).minimumShouldMatch("75%")))
                    .sort(o -> o.field(f -> f.field("createdAt").order(SortOrder.Desc))), DonationDocument.class);

            List<DonationDocument> docs = response.hits().hits().stream().map(Hit::source).filter(Objects::nonNull)
                    .collect(Collectors.toList());

            long total = Optional.ofNullable(response.hits().total()).map(t -> t.value()).orElse(0L);

            int totalPages = (int) Math.ceil((double) total / size);

            // Document → Response DTO 매핑
            List<DonationResponse> content = docs.stream().map(DonationResponse::toDto).collect(Collectors.toList());

            return new PageResult<>(content, page, size, total, totalPages);

        } catch (IOException e) {
            log.error("Donation search error: {}", e.getMessage(), e);
            throw new RuntimeException("Donation 검색 중 오류", e);
        }
    }

    public List<String> autocomplete(String prefix, String index) {
        try {
            // Detect if the prefix is Korean (contains Hangul)
            boolean isKorean = prefix.matches(".*[가-힣].*");
            List<String> nounSuggestions = new ArrayList<>();
            List<String> phraseSuggestions = new ArrayList<>();

            // Step 1: Get noun suggestions using completion suggester
            SearchResponse<Void> response = client.search(
                    s -> s.index(index)
                            .suggest(sug -> sug.suggesters("completion_suggest",
                                    sugField -> sugField.prefix(prefix.toLowerCase()).completion(
                                            c -> c.field("suggest").size(10).fuzzy(f -> f.fuzziness("AUTO"))))),
                    Void.class);

            List<String> completionSuggestions = response.suggest().get("completion_suggest").stream()
                    .flatMap(s -> s.completion().options().stream()).map(option -> option.text()).distinct().limit(10)
                    .collect(Collectors.toList());

            if (isKorean) {
                // Filter completion suggestions to include only nouns with length > 1
                nounSuggestions.addAll(
                        completionSuggestions.stream().filter(s -> !KoreanNounExtractor.extractNouns(s).isEmpty())
                                .filter(s -> s.length() > 1).collect(Collectors.toList()));
                // Add nouns from prefix itself, excluding single syllables
                nounSuggestions.addAll(KoreanNounExtractor.extractNouns(prefix).stream().filter(s -> s.length() > 1)
                        .collect(Collectors.toList()));
            } else {
                // For English, use completion suggestions directly
                nounSuggestions.addAll(completionSuggestions);
            }

            // Step 2: Generate phrase suggestions (at least two) using title only
            if (!nounSuggestions.isEmpty()) {
                if (index.equals(BOARD_INDEX)) {
                    SearchResponse<BoardDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0)).fields("title^1.5"))).size(3),
                            BoardDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
                            .collect(Collectors.toList());
                } else if (index.equals(PRODUCT_INDEX)) {
                    SearchResponse<ProductDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0)).fields("title^1.5"))).size(3),
                            ProductDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
                            .collect(Collectors.toList());
                } else if (index.equals(DONATION_INDEX)) {
                    SearchResponse<DonationDocument> phraseResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(nounSuggestions.get(0)).fields("title^1.5"))).size(3),
                            DonationDocument.class);

                    phraseSuggestions = phraseResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
                            .collect(Collectors.toList());
                }
            }

            // Step 3: Fallback if insufficient suggestions
            if (nounSuggestions.isEmpty() && phraseSuggestions.isEmpty()) {
                if (index.equals(BOARD_INDEX)) {
                    // Search title field directly for boards
                    SearchResponse<BoardDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix).fields("title^1.5").fuzziness("AUTO")))
                            .size(5), BoardDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct().limit(3).collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
                            .collect(Collectors.toList()));
                } else if (index.equals(PRODUCT_INDEX)) {
                    // Search title field directly for products
                    SearchResponse<ProductDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix).fields("title^1.5").fuzziness("AUTO")))
                            .size(5), ProductDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct().limit(3).collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
                            .collect(Collectors.toList()));
                } else if (index.equals(DONATION_INDEX)) {
                    // Search title field directly for products
                    SearchResponse<DonationDocument> fallbackResponse = client.search(s -> s.index(index)
                            .query(q -> q.multiMatch(m -> m.query(prefix).fields("title^1.5").fuzziness("AUTO")))
                            .size(5), DonationDocument.class);

                    nounSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .flatMap(s -> isKorean ? KoreanNounExtractor.extractNouns(s).stream() : List.of(s).stream())
                            .filter(s -> !isKorean || s.length() > 1) // Exclude single syllables for Korean
                            .distinct().limit(3).collect(Collectors.toList()));

                    phraseSuggestions.addAll(fallbackResponse.hits().hits().stream().map(hit -> hit.source().getTitle())
                            .map(s -> s.length() > 30 ? s.substring(0, 30) + "..." : s).distinct().limit(3)
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
