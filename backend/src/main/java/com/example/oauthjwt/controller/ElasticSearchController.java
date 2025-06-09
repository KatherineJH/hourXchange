package com.example.oauthjwt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.document.BoardDocument;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.ProductResponse;
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
    public ResponseEntity<PageResult<ProductResponse>> searchProducts(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchProducts(keyword, page, size));
    }

    @GetMapping("/boards")
    public ResponseEntity<PageResult<BoardDocument>> searchBoards(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchBoards(keyword, page, size));
    }

    @GetMapping("/donations")
    public ResponseEntity<PageResult<DonationResponse>> searchDonations(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchDonations(keyword, page, size));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(@RequestParam String prefix, @RequestParam String index) {
        return ResponseEntity.ok(searchService.autocomplete(prefix, index));
    }

    @PostMapping("/index")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> indexAll() { // 수동 인덱싱
        indexer.indexAll();
        return ResponseEntity.ok(Map.of("message", "Indexing complete!"));
    }
}
