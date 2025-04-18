package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {

    private Long id; // 댓글 id

    private Long authorId; // 작성자 id

    private Long boardId; // 게시글 id

    private String content; // 댓글 내용

    private Board board; // 게시글
}
