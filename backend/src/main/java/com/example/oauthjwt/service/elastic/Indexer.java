package com.example.oauthjwt.service.elastic;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ProductDocument;
import com.example.oauthjwt.entity.Board;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.ProductRepository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class Indexer {
    private final ProductRepository productRepository;
    private final BoardRepository boardRepository;
    private final ElasticsearchClient elasticsearchClient;

    @Transactional(readOnly = true)
    public void indexAll() {
        indexProducts();
        indexBoards();
    }

    private void indexProducts() {
        List<Product> products = productRepository.findAll();
        log.info("Found {} Products to index", products.size());
        if (products.isEmpty()) {
            log.warn("No Products found in database");
            return;
        }
        products.forEach(product -> {
            List<String> keywords = Stream.of(product.getTitle(), product.getDescription())
                    .filter(Objects::nonNull)
                    .flatMap(s -> {
                        if (s.matches(".*[가-힣].*")) {
                            return KoreanNounExtractor.extractNouns(s).stream();
                        } else {
                            return Arrays.stream(s.split("[\\s\\p{Punct}]"))
                                    .filter(w -> w.matches(".*[a-zA-Z].*")); // English nouns only
                        }
                    })
                    .map(String::toLowerCase)
                    .distinct()
                    .toList();

            // Handle username separately
            List<String> finalKeywords = new ArrayList<>(keywords);
            String ownerName = product.getOwner() != null ? product.getOwner().getName() : "Unknown";
            if (ownerName.contains(" ")) {
                // Split usernames with spaces
                finalKeywords.addAll(Arrays.stream(ownerName.split("[\\s\\p{Punct}]"))
                        .filter(w -> !w.isEmpty())
                        .map(String::toLowerCase)
                        .distinct()
                        .toList());
            } else {
                // Add full username as a single term
                finalKeywords.add(ownerName.toLowerCase());
            }

            ProductDocument doc = ProductDocument.builder()
                    .id(product.getId())
                    .title(product.getTitle())
                    .description(product.getDescription())
                    .ownerName(ownerName)
                    .suggest(finalKeywords)
                    .build();

            try {
                elasticsearchClient.index(i -> i.index("product_index").id(String.valueOf(doc.getId())).document(doc));
                log.info("Indexed Product: id={}, title={}, description={}, ownerName={}, suggest={}", doc.getId(),
                        doc.getTitle(), doc.getDescription(), doc.getOwnerName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("Product indexing error for id={}: {}", product.getId(), e.getMessage());
                throw new RuntimeException("Product 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing Products");
    }

    private void indexBoards() {
        List<Board> boards = boardRepository.findAll();
        log.info("Found {} Boards to index", boards.size());
        if (boards.isEmpty()) {
            log.warn("No Boards found in database");
            return;
        }
        boards.forEach(board -> {
            List<String> keywords = Stream.of(board.getTitle(), board.getDescription())
                    .filter(Objects::nonNull)
                    .flatMap(s -> {
                        if (s.matches(".*[가-힣].*")) {
                            return KoreanNounExtractor.extractNouns(s).stream();
                        } else {
                            return Arrays.stream(s.split("[\\s\\p{Punct}]"))
                                    .filter(w -> w.matches(".*[a-zA-Z].*")); // English nouns only
                        }
                    })
                    .map(String::toLowerCase)
                    .distinct()
                    .toList();

            // Handle username separately
            List<String> finalKeywords = new ArrayList<>(keywords);
            String authorName = board.getAuthor() != null ? board.getAuthor().getName() : "Unknown";
            if (authorName.contains(" ")) {
                // Split usernames with spaces
                finalKeywords.addAll(Arrays.stream(authorName.split("[\\s\\p{Punct}]"))
                        .filter(w -> !w.isEmpty())
                        .map(String::toLowerCase)
                        .distinct()
                        .toList());
            } else {
                // Add full username as a single term
                finalKeywords.add(authorName.toLowerCase());
            }

            BoardDocument doc = BoardDocument.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .description(board.getDescription())
                    .authorName(authorName)
                    .createdAt(board.getCreatedAt())
                    .suggest(finalKeywords)
                    .build();

            try {
                elasticsearchClient.index(i -> i.index("board_index").id(String.valueOf(doc.getId())).document(doc));
                log.info("Indexed Board: id={}, title={}, description={}, authorName={}, suggest={}", doc.getId(),
                        doc.getTitle(), doc.getDescription(), doc.getAuthorName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("Board indexing error for id={}: {}", board.getId(), e.getMessage());
                throw new RuntimeException("Board 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing Boards");
    }
}