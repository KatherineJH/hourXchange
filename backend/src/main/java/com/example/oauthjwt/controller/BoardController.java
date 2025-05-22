package com.example.oauthjwt.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.service.BoardService;
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

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody @Valid BoardRequest boardRequest) {
        log.info(boardRequest);
        BoardResponse result = boardService.save(boardRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAllBoards(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BoardResponse> responses = boardService.findAllBoards(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    public ResponseEntity<?> findMyBoards(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size) {
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
    public ResponseEntity<?> findMyBoardById(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        BoardResponse response = boardService.findMyBoardById(id, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boardRequest.setId(id);
        boardRequest.setAuthorId(userDetails.getUser().getId());
        BoardResponse result = boardService.update(boardRequest);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/thumbs-up")
    public ResponseEntity<?> updateLike(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) throws Exception {
        BoardResponse resp = boardService.toggleThumbsUp(id, userDetails.getUser().getId());
        return ResponseEntity.ok(resp);
    }
}
