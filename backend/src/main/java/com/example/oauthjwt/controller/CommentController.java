package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.CommentRequest;
import com.example.oauthjwt.dto.response.CommentResponse;
import com.example.oauthjwt.entity.Comment;
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
    private final BoardService boardService;
    private final UserService userService;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody CommentRequest commentRequest) {
        log.info(commentRequest);
        // 입력 값 검증
        Map<String, String> saveCheck = commentService.saveCheck(commentRequest);
        if (!saveCheck.isEmpty()) {
            return ResponseEntity.badRequest().body(saveCheck);
        }
        // 로직 실행
        CommentResponse result = commentService.save(commentRequest);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        // 댓글이 있는지 조회
        Map<String, String> commentCheck = commentService.existsById(id);
        if (!commentCheck.isEmpty()) {
            return ResponseEntity.badRequest().body(commentCheck);
        }
        CommentResponse result = commentService.findById(id);
        return ResponseEntity.ok(result);
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
        // 댓글이 있는지 조회
        Map<String, String> commentCheck = commentService.existsById(id);
        if (!commentCheck.isEmpty()) {
            return ResponseEntity.badRequest().body(commentCheck);
        }

        // 2. 실제 댓글을 DB에서 가져옴
        Comment original = commentService.getEntityById(id);

        // 3. 댓글 작성자와 현재 로그인 사용자가 같은지 비교
        if (!original.getAuthor().getId().equals(userDetails.getUser().getId())) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "자신의 댓글만 수정할 수 있습니다."));
        }
        // 4. 댓글 id를 DTO에 다시 설정
        commentRequest.setId(id);

        // 5. 댓글 업데이트
        CommentResponse result = commentService.update(commentRequest);
        return ResponseEntity.ok(result);
    }
}
