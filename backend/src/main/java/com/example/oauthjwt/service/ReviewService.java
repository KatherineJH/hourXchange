package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.dto.response.UserTagResponse;
import com.example.oauthjwt.entity.User;

import java.util.List;

public interface ReviewService {

    ReviewResponse saveReview(ReviewRequest request, User reviewer);

    ReviewResponse getReviewById(Long id);

    ReviewResponse updateReview(Long id, ReviewRequest request, User user);

    List<String> getReviewTagsByReceiverId(Long userId);

    List<UserTagResponse> getUserTags(Long userId);
}
