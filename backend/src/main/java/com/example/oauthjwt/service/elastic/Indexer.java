package com.example.oauthjwt.service.elastic;

import com.example.oauthjwt.entity.Board;
import com.example.oauthjwt.entity.ServiceProduct;
import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ServiceProductDocument;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.suggest.Completion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class Indexer {

    private final ServiceProductRepository serviceProductRepository;
    private final BoardRepository boardRepository;
    private final ElasticsearchClient elasticsearchClient;

    @Transactional(readOnly = true)
    public void indexAll() {
        indexServiceProducts();
        indexBoards();
    }

    private void indexServiceProducts() {
        List<ServiceProduct> products = serviceProductRepository.findAll();
        products.forEach(product -> {
            Completion suggest = new Completion();
            suggest.setInput(
                    Stream.of(product.getTitle(), product.getDescription(), product.getOwner().getName())
                            .filter(s -> s != null)
                            .map(String::toLowerCase)
                            .distinct()
                            .toList()
                            .toArray(new String[0])
            );

            ServiceProductDocument doc = ServiceProductDocument.builder()
                    .id(product.getId())
                    .title(product.getTitle())
                    .description(product.getDescription())
                    .ownerName(product.getOwner().getName())
                    .suggest(suggest)
                    .build();

            try {
                elasticsearchClient.index(i ->
                        i.index("service_product_index")
                                .id(String.valueOf(doc.getId()))
                                .document(doc));
            } catch (IOException e) {
                throw new RuntimeException("ServiceProduct 인덱싱 중 오류", e);
            }
        });
    }

    private void indexBoards() {
        List<Board> boards = boardRepository.findAll();
        boards.forEach(board -> {
            Completion suggest = new Completion();
            suggest.setInput(
                    Stream.of(board.getTitle(), board.getDescription(), board.getAuthor().getName())
                            .filter(s -> s != null)
                            .map(String::toLowerCase)
                            .distinct()
                            .toList()
                            .toArray(new String[0])
            );

            BoardDocument doc = BoardDocument.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .description(board.getDescription())
                    .authorName(board.getAuthor().getName())
                    .createdAt(board.getCreatedAt())
                    .suggest(suggest)
                    .build();

            try {
                elasticsearchClient.index(i ->
                        i.index("board_index")
                                .id(String.valueOf(doc.getId()))
                                .document(doc));
            } catch (IOException e) {
                throw new RuntimeException("Board 인덱싱 중 오류", e);
            }
        });
    }
}