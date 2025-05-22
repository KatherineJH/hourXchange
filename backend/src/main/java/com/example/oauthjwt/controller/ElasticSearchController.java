package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.dto.document.DonationDocument;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.document.BoardDocument;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.elastic.Indexer;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Log4j2
public class ElasticSearchController {

    private final ElasticSearchService searchService;
    private final Indexer indexer;

    @GetMapping("/products")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending()); // 최신순 정렬
        return ResponseEntity.ok(searchService.searchProducts(keyword, pageable));
    }

    @GetMapping("/boards")
    public ResponseEntity<PageResult<BoardDocument>> searchBoards(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchBoards(keyword, page, size));
    }

    @GetMapping("/donations")
    public ResponseEntity<PageResult<DonationDocument>> searchDonations(@RequestParam String keyword,
                                                                        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchDonations(keyword, page, size));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(@RequestParam String prefix, @RequestParam String index) {
        return ResponseEntity.ok(searchService.autocomplete(prefix, index));
    }

    @PostMapping("/index")
    public ResponseEntity<String> indexAll() {
        indexer.indexAll();
        return ResponseEntity.ok("Indexing complete!");
    }
}
