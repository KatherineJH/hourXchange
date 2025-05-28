package com.example.oauthjwt.dto.document;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.ProductImage;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.*;

@Document(indexName = "product_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description;

    private int hours; // 시간(비용)

    private LocalDateTime startedAt; // 시작시간

    private LocalDateTime endAt; // 끝시간

    private Double lat;

    private Double lng;

    private int viewCount;

    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;

    private int favoriteCount;      // 찜한 유저 수
    private int chatCount;          // 이 상품과 연결된 채팅방 수
    private double starsAverage;    // 이 상품에 대한 평균 별점
    private int reviewCount;        // 이 상품에 대한 리뷰 수

    private UserResponse owner; // 작성자

    private CategoryResponse category; // 서비스 카테고리

    private String providerType; // SP 타입 (구매, 판매)

    private List<String> images = new ArrayList<>(); // 이미지 url

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String ownerName;

    private List<String> suggest;

    public static ProductDocument toDocument(Product product, String ownerName, List<String> finalKeywords, double starsAverage) {
        return ProductDocument.builder()
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
                .ownerName(ownerName)
                .suggest(finalKeywords)
                .build();
    }
}
