package com.example.oauthjwt.controller;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.elastic.ElasticSearchService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final ElasticSearchService elasticSearchService;
    private final LocationUtil locationUtil;

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> save(@RequestBody @Valid BoardRequest boardRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        BoardResponse result = boardService.save(boardRequest, userDetails);
        return ResponseEntity.created(locationUtil.createdLocation(result.getId())).body(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAllBoards(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BoardResponse> responses = boardService.findAllBoards(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBoards(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(elasticSearchService.searchBoards(keyword, page, size));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> findMyBoards(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BoardResponse> result = boardService.findByAuthorId(userDetails.getUser().getId(), pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        BoardResponse response = boardService.findById(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> findMyBoardById(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        BoardResponse response = boardService.findMyBoardById(id, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{boardId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> update(@PathVariable Long boardId, @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        BoardResponse result = boardService.update(boardRequest, boardId, userDetails);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/thumbs-up")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateLike(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails)
            throws Exception {
        BoardResponse resp = boardService.toggleThumbsUp(id, userDetails.getUser().getId());
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        boardService.delete(id, userDetails.getUser().getId());
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
