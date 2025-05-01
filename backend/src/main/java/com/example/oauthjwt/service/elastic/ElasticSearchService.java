//package com.example.oauthjwt.service.elastic;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Objects;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//import com.example.oauthjwt.dto.BoardDocument;
//import com.example.oauthjwt.dto.ProductDocument;
//import com.example.oauthjwt.dto.response.PageResult;
//import com.example.oauthjwt.dto.response.ProductResponse;
//import com.example.oauthjwt.entity.Product;
//import com.example.oauthjwt.repository.ProductRepository;
//
//import co.elastic.clients.elasticsearch.ElasticsearchClient;
//import co.elastic.clients.elasticsearch._types.SortOrder;
//import co.elastic.clients.elasticsearch.core.SearchResponse;
//import co.elastic.clients.elasticsearch.core.search.Hit;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import lombok.extern.slf4j.Slf4j;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//@Log4j2
//public class ElasticSearchService {
//
//    private final ElasticsearchClient client;
//    private final ProductRepository productRepository; // JPA 리포지토리
//
//    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) { // 엘라스틱서치는 점수와 하이라이팅만 실 데이터는 db에서
//        try {
//            SearchResponse<ProductDocument> response = client.search(
//                    s -> s.index("product_index")
//                            .query(q -> q.multiMatch(m -> m.query(keyword)
//                                    .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
//                                            "ownerName^0.2")
//                                    .fuzziness("1").prefixLength(1).minimumShouldMatch("75%"))),
//                    ProductDocument.class);
//
//            // ES에서 뽑아온 hit 리스트
//            List<Hit<ProductDocument>> hits = response.hits().hits();
//            if (hits.isEmpty()) {
//                return null;
//            }
//
//            // 2) ES 결과에서 ID만 꺼내기
//            List<Long> ids = hits.stream().map(hit -> hit.source().getId()).collect(Collectors.toList());
//
//            // 3) JPA 한 번에 조회 (IN 절, N+1 방지)
//            Page<Product> productList = productRepository.findByIdIn(ids, pageable);
//
//            return productList.map(ProductResponse::toDto);
//
//        } catch (IOException e) {
//            log.error("Product search error: {}", e.getMessage(), e);
//            throw new RuntimeException("Product 검색 중 오류가 발생했습니다.", e);
//        }
//    }
//
//    // public PageResult<ProductDocument> searchProducts(String keyword, int page,
//    // int size) {
//    // try {
//    // // int from = (page - 1) * size;
//    // int from = Math.max(0, page * size); // 음수 안 나오게 방어
//    // SearchResponse<ProductDocument> response = client.search(s ->
//    // s.index("product_index")
//    // .from(from)
//    // .size(size)
//    // .query(q ->
//    // q.multiMatch(m ->
//    // m.query(keyword)
//    // .fields("title^1.5",
//    // "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
//    // "ownerName^0.2")
//    // .fuzziness("1") // 편집 거리 1
//    // .prefixLength(1) // 첫 글자 고정
//    // .minimumShouldMatch("75%") // 최소 매칭
//    // 비율
//    // )
//    // ),
//    // ProductDocument.class);
//    //
//    // log.info(response.toString());
//    //
//    ////            List<ServiceProductDocument> results = response.hits().hits().stream()
//  ////                    .map(hit -> hit.source())
//  ////                    .collect(Collectors.toList());
//  ////            log.info("Search products for keyword '{}': {} results", keyword,
//    // results.size());
//    ////            return results;
//    // List<ProductDocument> results = response.hits().hits().stream()
//    // .map(Hit::source)
//    // .filter(Objects::nonNull)
//    // .collect(Collectors.toList());
//    //
//    // long total = response.hits().total() != null ?
//    // response.hits().total().value() : 0;
//    // int totalPages = (int) Math.ceil((double) total / size);
//    //
//    // return new PageResult<>(results, page, size, total, totalPages);
//    // } catch (IOException e) {
//    // log.error("Product search error: {}", e.getMessage());
//    // throw new RuntimeException("Product 검색 중 오류", e);
//    // }
//    // }
//
//    public PageResult<BoardDocument> searchBoards(String keyword, int page, int size) {
//        try {
//            // int from = (page - 1) * size;
//            int from = Math.max(0, page * size); // 음수 안 나오게 방어
//            SearchResponse<BoardDocument> response = client.search(s -> s.index("board_index").from(from).size(size)
//                    .query(q -> q.multiMatch(m -> m.query(keyword)
//                            .fields("title^1.5", "title.ngram^0.5", "description^1.0", "description.ngram^0.3",
//                                    "authorName^0.2")
//                            .fuzziness("1").prefixLength(1).minimumShouldMatch("75%")))
//                    .sort(sort -> sort.field(f -> f.field("createdAt").order(SortOrder.Desc))), BoardDocument.class);
//
//            // List<BoardDocument> results = response.hits().hits().stream()
//            // .map(hit -> hit.source())
//            // .collect(Collectors.toList());
//            // log.info("Search boards for keyword '{}': {} results", keyword,
//            // results.size());
//            // return results;
//            List<BoardDocument> hits = response.hits().hits().stream().map(Hit::source).filter(Objects::nonNull)
//                    .toList();
//            long total = response.hits().total() != null ? response.hits().total().value() : 0;
//            int totalPages = (int) Math.ceil((double) total / size);
//            return new PageResult<>(hits, page, size, total, totalPages);
//        } catch (IOException e) {
//            log.error("Board search error: {}", e.getMessage());
//            throw new RuntimeException("Board 검색 중 오류", e);
//        }
//    }
//
//    public List<String> autocomplete(String prefix, String index) {
//        try {
//            SearchResponse<Void> response = client.search(s -> s.index(index).suggest(
//                    sug -> sug.suggesters("completion_suggest", sugField -> sugField.prefix(prefix.toLowerCase())
//                            .completion(c -> c.field("suggest").size(10).fuzzy(f -> f.fuzziness("2")) // 편집 거리 2
//                            ))), Void.class);
//
//            List<String> results = response.suggest().get("completion_suggest").stream()
//                    .flatMap(s -> s.completion().options().stream()).map(option -> option.text()).distinct().limit(10)
//                    .collect(Collectors.toList());
//            log.info("Autocomplete for prefix '{}', index '{}': {} results", prefix, index, results.size());
//            return results;
//        } catch (IOException e) {
//            log.error("Autocomplete error: {}", e.getMessage());
//            throw new RuntimeException("자동완성 실패", e);
//        }
//    }
//}
