package com.example.oauthjwt.service.elastic;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.example.oauthjwt.dto.document.DonationDocument;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationImage;
import com.example.oauthjwt.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.oauthjwt.dto.document.BoardDocument;
import com.example.oauthjwt.dto.document.ProductDocument;
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
    private final DonationRepository donationRepository;
    private final ElasticsearchClient elasticsearchClient;

    @Transactional(readOnly = true)
    public void indexAll() {
        indexProducts();
        indexBoards();
        indexDonations();
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

            ProductDocument doc = ProductDocument.toDocument(product, ownerName, finalKeywords);

            try {
                elasticsearchClient.index(i -> i.index("product_index").id(String.valueOf(doc.getId())).document(doc));
//                log.info("Indexed Product: id={}, title={}, description={}, ownerName={}, suggest={}", doc.getId(),
//                        doc.getTitle(), doc.getDescription(), doc.getOwnerName(), doc.getSuggest());
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

            BoardDocument doc = BoardDocument.toDocument(board, authorName, finalKeywords);

            try {
                elasticsearchClient.index(i -> i.index("board_index").id(String.valueOf(doc.getId())).document(doc));
//                log.info("Indexed Board: id={}, title={}, description={}, authorName={}, suggest={}", doc.getId(),
//                        doc.getTitle(), doc.getDescription(), doc.getAuthorName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("Board indexing error for id={}: {}", board.getId(), e.getMessage());
                throw new RuntimeException("Board 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing Boards");
    }

    @Transactional
    public void indexDonations() {
        List<Donation> Donations = donationRepository.findAll();
        log.info("Found {} Donations to index", Donations.size());
        if (Donations.isEmpty()) {
            log.warn("No Donations found in database");
            return;
        }
        Donations.forEach(donation -> {
            List<String> keywords = Stream.of(donation.getTitle(), donation.getDescription())
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
            String authorName = donation.getAuthor() != null ? donation.getAuthor().getName() : "Unknown";
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

            DonationDocument doc = DonationDocument.toDocument(donation, authorName, finalKeywords);

            try {
                elasticsearchClient.index(i -> i.index("donation_index").id(String.valueOf(doc.getId())).document(doc));
//                log.info("Indexed Donation: id={}, title={}, description={}, authorName={}, suggest={}", doc.getId(),
//                        doc.getTitle(), doc.getDescription(), doc.getAuthorName(), doc.getSuggest());
            } catch (IOException e) {
                log.error("Donation indexing error for id={}: {}", donation.getId(), e.getMessage());
                throw new RuntimeException("Donation 인덱싱 중 오류", e);
            }
        });
        log.info("Completed indexing Donations");
    }
}