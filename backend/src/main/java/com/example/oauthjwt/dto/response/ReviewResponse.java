package com.example.oauthjwt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private Long reviewId;
    private String content;
    private int rating;
    private List<String> tags;
}