package com.example.oauthjwt.service.elastic;

import com.example.oauthjwt.entity.Board;
import com.example.oauthjwt.entity.ServiceProduct;
import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ServiceProductDocument;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Slf4j
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
        log.info("Found {} ServiceProducts to index", products.size());
        if (products.isEmpty()) {
            log.warn("No ServiceProducts found in database");
            return;
        }
        products.forEach(product -> {
            ServiceProductDocument doc = ServiceProductDocument.builder()
                    .id(product.getId())
                    .title(product.getTitle())
                    .description(product.getDescription())
                    .ownerName(product.getOwner() != null ? product.getOwner().getName() : "Unknown")
                    .suggest(Stream.of(product.getTitle(), product.getDescription(), product.getOwner() != null ? product.getOwner().getName() : null)
                            .filter(Objects::nonNull)
                            .map(String::toLowerCase)
                            .distinct()
                            .toList())
                    .build();

            try {
                elasticsearchClient.index(i ->
                        i.index("service_product_index")
                                .id(String.valueOf(doc.getId()))
                                .document(doc));
                log.info("Indexed ServiceProduct: id={}, title={}, description={}, ownerName={}, suggest={}",
                        doc.getId(), doc.getTitle(), doc.getDescription(), doc.getOwnerName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("ServiceProduct indexing error for id={}: {}", product.getId(), e.getMessage());
                throw new RuntimeException("ServiceProduct 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing ServiceProducts");
    }

    private void indexBoards() {
        List<Board> boards = boardRepository.findAll();
        log.info("Found {} Boards to index", boards.size());
        if (boards.isEmpty()) {
            log.warn("No Boards found in database");
            return;
        }
        boards.forEach(board -> {
            BoardDocument doc = BoardDocument.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .description(board.getDescription())
                    .authorName(board.getAuthor() != null ? board.getAuthor().getName() : "Unknown")
                    .createdAt(board.getCreatedAt())
                    .suggest(Stream.of(board.getTitle(), board.getDescription(), board.getAuthor() != null ? board.getAuthor().getName() : null)
                            .filter(Objects::nonNull)
                            .map(String::toLowerCase)
                            .distinct()
                            .toList())
                    .build();

            try {
                elasticsearchClient.index(i ->
                        i.index("board_index")
                                .id(String.valueOf(doc.getId()))
                                .document(doc));
                log.info("Indexed Board: id={}, title={}, description={}, authorName={}, suggest={}",
                        doc.getId(), doc.getTitle(), doc.getDescription(), doc.getAuthorName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("Board indexing error for id={}: {}", board.getId(), e.getMessage());
                throw new RuntimeException("Board 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing Boards");
    }
}