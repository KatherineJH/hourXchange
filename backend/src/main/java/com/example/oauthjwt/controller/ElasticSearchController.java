package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ServiceProductDocument;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.elastic.Indexer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class ElasticSearchController {

    private final ElasticSearchService searchService;
    private final Indexer indexer;

    @GetMapping("/products")
    public ResponseEntity<List<ServiceProductDocument>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(searchService.searchServiceProducts(keyword));
    }

    @GetMapping("/boards")
    public ResponseEntity<List<BoardDocument>> searchBoards(@RequestParam String keyword) {
        return ResponseEntity.ok(searchService.searchBoards(keyword));
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