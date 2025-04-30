package com.example.oauthjwt.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.entity.Category;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequest {

  private Long id; // 게시글 id

  @NotNull(message = "작성자는 필수입니다.") // Valid로 입력값 검사 컨트롤러에 @Valid 추가 -> GlobalExceptionHandler에서
  // message의 문구와
  // 함께 표시
  private Long authorId;

  ; // 작성자 id

  private String title;

  private List<String> images = new ArrayList<>(); // 이미지 url

  private Category category; // 카테고리

  @NotNull(message = "작성자는 필수입니다.") // Valid로 입력값 검사 컨트롤러에 @Valid 추가 -> GlobalExceptionHandler에서
  // message의 문구와
  // 함께 표시
  private Long categoryId; // 카테고리 id

  private String description; // 게시글 내용
}
