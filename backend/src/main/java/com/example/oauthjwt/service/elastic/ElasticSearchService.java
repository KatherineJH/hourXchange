package com.example.oauthjwt.service.elastic;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ServiceProductDocument;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ElasticSearchService {

    private final ElasticsearchClient client;

    public List<ServiceProductDocument> searchServiceProducts(String keyword) {
        try {
            SearchResponse<ServiceProductDocument> response = client.search(s ->
                            s.index("service_product_index")
                                    .query(q ->
                                            q.multiMatch(m ->
                                                    m.query(keyword)
                                                            .fields("title^1.2", "description", "ownerName")
                                                            .fuzziness("AUTO")
                                            )
                                    ),
                    ServiceProductDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("ServiceProduct 검색 중 오류", e);
        }
    }

    public List<BoardDocument> searchBoards(String keyword) {
        try {
            SearchResponse<BoardDocument> response = client.search(s ->
                            s.index("board_index")
                                    .query(q ->
                                            q.multiMatch(m ->
                                                    m.query(keyword)
                                                            .fields("title^1.2", "description", "authorName")
                                                            .fuzziness("AUTO")
                                            )
                                    )
                                    .sort(sort -> sort.field(f -> f.field("createdAt").order(co.elastic.clients.elasticsearch._types.SortOrder.Desc))),
                    BoardDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Board 검색 중 오류", e);
        }
    }

    public List<String> autocomplete(String prefix, String index) {
        try {
            SearchResponse<?> response = client.search(s ->
                            s.index(index)
                                    .size(50)
                                    .query(q ->
                                            q.multiMatch(m ->
                                                    m.query(prefix.toLowerCase())
                                                            .fields("title", "description", index.equals("service_product_index") ? "ownerName" : "authorName")
                                            )
                                    ),
                    index.equals("service_product_index") ? ServiceProductDocument.class : BoardDocument.class);

            return response.hits().hits().stream()
                    .flatMap(hit -> {
                        if (index.equals("service_product_index")) {
                            ServiceProductDocument doc = (ServiceProductDocument) hit.source();
                            return Stream.of(doc.getTitle(), doc.getDescription(), doc.getOwnerName());
                        } else {
                            BoardDocument doc = (BoardDocument) hit.source();
                            return Stream.of(doc.getTitle(), doc.getDescription(), doc.getAuthorName());
                        }
                    })
                    .filter(text -> text != null && text.toLowerCase().contains(prefix.toLowerCase()))
                    .map(String::toLowerCase)
                    .distinct()
                    .limit(10)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("자동완성 실패", e);
        }
    }
}