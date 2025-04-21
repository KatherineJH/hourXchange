package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.Comment;
import com.example.oauthjwt.exception.ValidationException;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.CommentService;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody CommentRequest commentRequest) {
        log.info(commentRequest);
        try {
            CommentResponse result = commentService.save(commentRequest);
            return ResponseEntity.ok(result);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            CommentResponse result = commentService.findById(id);
            return ResponseEntity.ok(result);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> findAllByBoardId(@PathVariable Long boardId) {
        List<CommentResponse> result = commentService.findAllByBoardId(boardId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Comment comment = commentService.getEntityById(id);
            if (!comment.getAuthor().getId().equals(userDetails.getUser().getId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.forbidden("자신의 댓글만 수정할 수 있습니다."));
            }
            commentRequest.setId(id);
            CommentResponse result = commentService.update(commentRequest);
            return ResponseEntity.ok(result);

        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }
}
