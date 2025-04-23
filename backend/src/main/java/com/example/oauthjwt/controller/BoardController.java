package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.exception.ValidationException;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody @Valid BoardRequest boardRequest) {
        log.info(boardRequest);
//        try {
            BoardResponse result = boardService.save(boardRequest);
            return ResponseEntity.ok(result);
//        } catch (ValidationException e) {
//            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
//        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAllBoards(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            List<BoardResponse> responses = boardService.findAllBoards();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.serverError("게시글 전체 조회 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long userId = userDetails.getUser().getId();
            BoardResponse response = boardService.findById(id, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<?> findMyBoardById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long userId = userDetails.getUser().getId();
            BoardResponse response = boardService.findMyBoardById(id, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            boardRequest.setId(id); // URL 경로에서 받은 id 설정
            boardRequest.setAuthorId(userDetails.getUser().getId()); // 로그인 사용자 정보
            BoardResponse result = boardService.update(boardRequest);
            return ResponseEntity.ok(result);

        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }

    @PutMapping("/{id}/thumbs-up")
    public ResponseEntity<?> updateLike(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            BoardResponse resp = boardService.toggleThumbsUp(
                    id, userDetails.getUser().getId());
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException ex) { // 자기 자신의 게시물에 좋아요 누르려고 하는 경우
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.serverError("서버 내부 오류가 발생했습니다."));
        }
    }
}
