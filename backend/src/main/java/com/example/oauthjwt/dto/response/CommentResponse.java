package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;

    private String content;

    private LocalDateTime createdAt;

    private UserResponse author;

    private Long authorId;

    private Long boardId;

    public static CommentResponse toDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .authorId(comment.getAuthor().getId())
                .author(UserResponse.toDto(comment.getAuthor()))
                .boardId(comment.getBoard().getId())
                .build();
    }
}
