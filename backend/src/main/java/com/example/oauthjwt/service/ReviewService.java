package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.entity.User;

public interface ReviewService {

  ReviewResponse saveReview(ReviewRequest request, User reviewer);

  ReviewResponse getReviewById(Long id);

  ReviewResponse updateReview(Long id, ReviewRequest request, User user);
}
