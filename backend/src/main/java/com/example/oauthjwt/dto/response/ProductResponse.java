package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.entity.SPImage;
import com.example.oauthjwt.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
  private Long id; // id값

  private String title; // 제목

  private String description; // 설명

  private int hours; // 시간(비용)

  private LocalDateTime startedAt; // 시작시간

  private LocalDateTime endAt; // 끝시간

  private String lat;

  private String lng;

  private LocalDateTime createAt;

  private UserResponse owner; // 작성자

  private CategoryResponse category; // 서비스 카테고리

  private String providerType; // SP 타입 (구매, 판매)

  private List<String> images = new ArrayList<>(); // 이미지 url

  public static ProductResponse toDto(Product product) {
    return ProductResponse.builder()
        .id(product.getId())
        .title(product.getTitle())
        .description(product.getDescription())
        .hours(product.getHours())
        .startedAt(product.getStartedAt())
        .endAt(product.getEndAt())
        .lat(product.getLat())
        .lng(product.getLng())
        .createAt(product.getCreateAt())
        .owner(UserResponse.toDto(product.getOwner()))
        .category(CategoryResponse.toDto(product.getCategory()))
        .providerType(product.getProviderType().toString())
        .images(
            product.getImages() == null
                ? null
                : product.getImages().stream()
                    .map(SPImage::getImgUrl)
                    .collect(Collectors.toList())) // 이미지 엔티티에서 url만 String list로 변환
        .build();
  }
}
