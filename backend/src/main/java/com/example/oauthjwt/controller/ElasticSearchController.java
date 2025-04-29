package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ProductDocument;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.elastic.Indexer;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Log4j2
public class ElasticSearchController {

    private final ElasticSearchService searchService;
    private final Indexer indexer;

    @GetMapping("/products")
    public ResponseEntity<PageResult<ProductDocument>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchProducts(keyword, page, size));
    }

    @GetMapping("/boards")
    public ResponseEntity<PageResult<BoardDocument>> searchBoards(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchBoards(keyword, page, size));
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