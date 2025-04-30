package com.example.oauthjwt.entity;

import java.time.LocalDateTime;

import com.example.oauthjwt.dto.request.CommentRequest;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String content;

  @JoinColumn(name = "user_id", nullable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private User author;

  @JoinColumn(name = "board_id", nullable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private Board board;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  private void onCreate() {
    createdAt = LocalDateTime.now();
  }

  public Comment setUpdateValue(CommentRequest request) {
    if (request.getContent() != null) { // 댓글
      this.content = request.getContent();
    }
    if (request.getBoard() != null) { // 카테고리
      this.board = request.getBoard();
    }
    return this;
  }
}
