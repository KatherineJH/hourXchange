package com.example.oauthjwt.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.entity.Review;
import com.example.oauthjwt.entity.ReviewTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long reviewId;
    private String content;
    private int rating; // ML 감성 분석 결과
    private int stars; // 사용자 별점
    private List<String> tags;
    private LocalDateTime createdAt;

    public static ReviewResponse toDto(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getId())
                .content(review.getContent())
                .stars(review.getStars())
//                .tags(review.getTags().stream().map(ReviewTag::getTag).collect(Collectors.toList()))
                .tags(
                        review.getTags() != null
                                ? review.getTags().stream().map(ReviewTag::getTag).collect(Collectors.toList())
                                : List.of()
                )
                .createdAt(review.getCreatedAt())
                .build();
    }
}
