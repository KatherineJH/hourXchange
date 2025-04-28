package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.BoardDocument;
import com.example.oauthjwt.dto.ServiceProductDocument;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.elastic.Indexer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class ElasticSearchController {

    private final ElasticSearchService searchService;
    private final Indexer indexer;

    @GetMapping("/products")
    public ResponseEntity<PageResult<ServiceProductDocument>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchServiceProducts(keyword, page, size));
    }

    @GetMapping("/boards")
    public ResponseEntity<PageResult<BoardDocument>> searchBoards(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(searchService.searchBoards(keyword, page, size));
    }

//    @GetMapping("/autocomplete")
//    public ResponseEntity<List<String>> autocomplete(@RequestParam String prefix, @RequestParam String index) {
//        return ResponseEntity.ok(searchService.autocomplete(prefix, index));
//    }

    // ✅ GET 방식 지원: /api/board/autocomplete?keyword=피
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocompleteGet(@RequestParam("keyword") String keyword) {
        List<String> results = searchService.autocomplete(keyword);
        return ResponseEntity.ok(results);
    }

    // ✅ POST 방식 지원: { "keyword": "피" }
    @PostMapping("/autocomplete")
    public ResponseEntity<List<String>> autocompletePost(@RequestBody Map<String, String> request) {
        String keyword = request.get("keyword");
        List<String> results = searchService.autocomplete(keyword);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/index")
    public ResponseEntity<String> indexAll() {
        indexer.indexAll();
        return ResponseEntity.ok("Indexing complete!");
    }
}