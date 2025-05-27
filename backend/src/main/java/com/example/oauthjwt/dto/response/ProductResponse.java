package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.document.ProductDocument;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.ProductImage;

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

    private Double lat;

    private Double lng;

    private int viewCount;

    private LocalDateTime createdAt;

    private int favoriteCount;      // 찜한 유저 수
    private int chatCount;          // 이 상품과 연결된 채팅방 수
    private double starsAverage;    // 이 상품에 대한 평균 별점
    private int reviewCount;        // 이 상품에 대한 리뷰 수

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
                .lat(Double.valueOf(product.getLat()))
                .lng(Double.valueOf(product.getLng()))
                .viewCount(product.getViewCount())
                .createdAt(product.getCreatedAt())
                .owner(UserResponse.toDto(product.getOwner()))
                .category(CategoryResponse.toDto(product.getCategory()))
                .providerType(product.getProviderType().toString())
                .images(product.getImages() == null
                        ? null
                        : product.getImages().stream().map(ProductImage::getImgUrl).collect(Collectors.toList())) // 이미지
                .build();
    }

    public static ProductResponse toDto(Product product, double starsAverage) {
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .hours(product.getHours())
                .startedAt(product.getStartedAt())
                .endAt(product.getEndAt())
                .lat(Double.valueOf(product.getLat()))
                .lng(Double.valueOf(product.getLng()))
                .viewCount(product.getViewCount())
                .createdAt(product.getCreatedAt())
                .owner(UserResponse.toDto(product.getOwner()))
                .category(CategoryResponse.toDto(product.getCategory()))
                .providerType(product.getProviderType().toString())
                .images(product.getImages() == null
                        ? null
                        : product.getImages().stream().map(ProductImage::getImgUrl).collect(Collectors.toList())) // 이미지
                .favoriteCount(product.getFavoriteList().size())
                .chatCount(product.getChatRooms().size())
                .starsAverage(starsAverage)
                .reviewCount(product.getReviews().size())
                .build();
    }

    public static ProductResponse toDto(ProductDocument productDocument){
        return ProductResponse.builder()
                .id(productDocument.getId())
                .title(productDocument.getTitle())
                .description(productDocument.getDescription())
                .hours(productDocument.getHours())
                .startedAt(productDocument.getStartedAt())
                .endAt(productDocument.getEndAt())
                .lat(productDocument.getLat())
                .lng(productDocument.getLng())
                .viewCount(productDocument.getViewCount())
                .createdAt(productDocument.getCreatedAt())
                .owner(productDocument.getOwner())
                .category(productDocument.getCategory())
                .providerType(productDocument.getProviderType())
                .images(productDocument.getImages())
                .favoriteCount(productDocument.getFavoriteCount())
                .chatCount(productDocument.getChatCount())
                .starsAverage(productDocument.getStarsAverage())
                .reviewCount(productDocument.getReviewCount())
                .build();
    }
}
