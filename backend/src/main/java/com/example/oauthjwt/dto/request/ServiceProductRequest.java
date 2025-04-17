package com.example.oauthjwt.dto.request;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceProductRequest {
  private String title; // 제목

  private String description; // 설명

  private int hours; // 시간(비용)

  private LocalDateTime startedAt; // 시작시간

  private LocalDateTime endAt; // 끝시간

  private Long ownerId; // 작성자 id

  private Long categoryId; // 서비스 카테고리 id

  private String providerType; // SP 타입 (구매, 판매)

  private List<String> images = new ArrayList<>(); // 이미지 url
}
