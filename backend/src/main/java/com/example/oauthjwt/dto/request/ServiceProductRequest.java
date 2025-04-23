package com.example.oauthjwt.dto.request;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceProductRequest {
  private Long id; // id

  @NotBlank(message = "제목은 필수입니다.")
  private String title; // 제목

  @NotBlank(message = "설명은 필수입니다.")
  private String description; // 설명

  @NotNull(message = "시간(비용)은 필수입니다.")
  private int hours; // 시간(비용)

  @NotNull(message = "시작시간은 필수입니다.")
  @FutureOrPresent(message = "과거의 시간으로는 입력할 수 없습니다.")
  private LocalDateTime startedAt; // 시작시간

  @NotNull(message = "끝시간은 필수입니다.")
  @FutureOrPresent(message = "과거의 시간으로는 입력할 수 없습니다.")
  private LocalDateTime endAt; // 끝시간

//  @NotNull(message = "작성자는 필수입니다.") 저장 시 인증된 토큰에서 가져오기
  private Long ownerId; // 작성자 id

  @NotNull(message = "카테고리는 필수입니다.")
  private Long categoryId; // 서비스 카테고리 id

  @NotBlank(message = "타입은 필수입니다.")
  private String providerType; // SP 타입 (구매, 판매)

  private List<String> images = new ArrayList<>(); // 이미지 url
}
