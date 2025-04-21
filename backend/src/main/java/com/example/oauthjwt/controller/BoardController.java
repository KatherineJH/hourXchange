package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.service.BoardService;
import com.example.oauthjwt.service.CategoryService;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final CategoryService categoryService;
    private final BoardService boardService;
    private final UserService userService;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody BoardRequest boardRequest){
        log.info(boardRequest);
        // 사용자가 있는지 조회
        Map<String, String> userCheck = userService.existsById(boardRequest.getAuthorId());
        if (!userCheck.isEmpty()) { // 등록한 사용자의 id가 존재하지 않으면
            return ResponseEntity.badRequest().body(userCheck);
        }
        // 카테고리가 있는지 조회
        Map<String, String> categoryCheck =
                categoryService.existsById(boardRequest.getCategoryId());
        if (!categoryCheck.isEmpty()) { // 카테고리 id 값을 통해 값이 존재 하지 않으면
            return ResponseEntity.badRequest().body(categoryCheck);
        }
        // 이미지 주소가 이미 있는지 조회
        for (int i = 0; i < boardRequest.getImages().size(); i++) {
            Map<String, String> existsByImgUrlCheck =
                    boardService.existsByImgUrl(boardRequest.getImages().get(i));
            if (!existsByImgUrlCheck.isEmpty()) {
                return ResponseEntity.badRequest().body(existsByImgUrlCheck);
            }
        }
        // 로직 실행
        BoardResponse result = boardService.save(boardRequest);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        // 게시글이 있는지 조회
        Map<String, String> boardCheck = boardService.existsById(id);
        if (!boardCheck.isEmpty()) {
            return ResponseEntity.badRequest().body(boardCheck);
        }
        BoardResponse result = boardService.findById(id);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 게시글이 있는지 조회
        Map<String, String> boardCheck = boardService.existsById(id);
        if (!boardCheck.isEmpty()) {
            return ResponseEntity.badRequest().body(boardCheck);
        }
        // 요청한 사용자와 토큰에 등록된 사용자가 같은지 조회
        Map<String, String> userCheck =
                userService.isEquals(
                        boardRequest.getAuthorId(), userDetails.getUser().getId());
        if (!userCheck.isEmpty()) { // 요청한 사용자와 쿠키를 통해 가져온 사용자의 아이디가 다른경우
            return ResponseEntity.badRequest().body(userCheck);
        }
        // url 주소로 받은 id 값 지정
        boardRequest.setId(id);
        BoardResponse result = boardService.update(boardRequest);

        return ResponseEntity.ok(result);
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
