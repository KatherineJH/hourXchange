package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.entity.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardResponse {
  private Long id;

  private String title;

  private CategoryResponse category;

  private String description;

  private UserResponse author;

  private Long authorId;

  @Builder.Default
  private List<String> images = new ArrayList<>();

  private LocalDateTime createdAt;

  public static BoardResponse toDto(Board board) {
    return BoardResponse.builder().id(board.getId()).title(board.getTitle()).description(board.getDescription())
        .createdAt(board.getCreatedAt()).authorId(board.getAuthor().getId())
        .author(UserResponse.toDto(board.getAuthor())).category(CategoryResponse.toDto(board.getCategory()))
        .images(board.getImages() == null
            ? null
            : board.getImages().stream().map(BoardImage::getImgUrl).collect(Collectors.toList())) // 이미지 엔티티에서 url만
                                                                                                  // String list로
        // 변환
        .build();
  }

  // 게시글 좋아요 기능
  private long likeCount;
  private boolean likedByMe;

  public static BoardResponse toDto(Board board, long likeCount, boolean likedByMe) {
    BoardResponse dto = toDto(board);
    dto.setLikeCount(likeCount);
    dto.setLikedByMe(likedByMe);
    return dto;
  }
}
