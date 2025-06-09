package com.example.oauthjwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.Comment;
import com.example.oauthjwt.service.CommentService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> save(@RequestBody @Valid CommentRequest commentRequest) {
        log.info(commentRequest);
        CommentResponse result = commentService.save(commentRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        CommentResponse result = commentService.findById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> findAllByBoardId(@PathVariable Long boardId) {
        List<CommentResponse> result = commentService.findAllByBoardId(boardId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid CommentRequest commentRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Comment comment = commentService.getEntityById(id);
        // 자신이 작성한 댓글인지 검증
        if (!comment.getAuthor().getId().equals(userDetails.getUser().getId())) {
            return ResponseEntity.status(403).body(ApiResponse.forbidden("자신의 댓글만 수정할 수 있습니다."));
        }
        commentRequest.setId(id);
        CommentResponse result = commentService.update(commentRequest);
        return ResponseEntity.ok(result);
    }
}
