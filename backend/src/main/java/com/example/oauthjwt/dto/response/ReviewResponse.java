package com.example.oauthjwt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private String content;
    private int rating;  // ML 감성 분석 결과
    private int stars;   // 사용자 별점
    private List<String> tags;
}