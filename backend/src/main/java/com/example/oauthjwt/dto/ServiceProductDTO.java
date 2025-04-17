package com.example.oauthjwt.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.entity.*;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ServiceProductDTO {

  private Long id; // id값

  private String title; // 제목

  private String description; // 설명

  private int hours; // 시간(비용)

  private LocalDateTime startedAt; // 시작시간

  private LocalDateTime endAt; // 끝시간

  private Long ownerId; // 작성자 id

  private UserDTO owner; // 작성자

  private Long categoryId; // 서비스 카테고리 id

  private CategoryDTO category; // 서비스 카테고리

  private String providerType; // SP 타입 (구매, 판매)

  private List<String> images = new ArrayList<>(); // 이미지 url
}
