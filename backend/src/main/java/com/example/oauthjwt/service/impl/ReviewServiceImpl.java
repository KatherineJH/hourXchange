package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.Review;
import com.example.oauthjwt.entity.ReviewTag;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.ProductRepository;
import com.example.oauthjwt.repository.ReviewRepository;
import com.example.oauthjwt.repository.ReviewTagRepository;
import com.example.oauthjwt.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewTagRepository reviewTagRepository;
    private final ProductRepository ProductRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String flaskUrl = "http://127.0.0.1:5000/predict";

    @Override
    public ReviewResponse saveReview(ReviewRequest request, User reviewer) {
        Product product = ProductRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Flask 서버에 감성 분석 요청
        Map<String, Object> flaskRequest = Map.of("text", request.getText());
        Map<String, Object> response = restTemplate.postForObject(flaskUrl, flaskRequest, Map.class);

        Map<String, Object> sentiment = (Map<String, Object>) response.get("sentiment");
        List<String> tags = (List<String>) response.get("tags");

        int rating = ((String) sentiment.get("result")).contains("긍정") ? 1 : 0;

        // 리뷰 저장
        Review review = new Review();
        review.setContent(request.getText());
        review.setCreatedAt(LocalDateTime.now());
        review.setRates(rating);
        review.setReviewer(reviewer);
        review.setProduct(product);
        reviewRepository.save(review);

        // 태그 저장 (긍정인 경우만)
        if (rating == 1) {
            for (String tag : tags) {
                ReviewTag reviewTag = new ReviewTag();
                reviewTag.setTag(tag);
                reviewTag.setReview(review);
                reviewTagRepository.save(reviewTag);
            }
        }
        return new ReviewResponse(review.getId(), review.getContent(), rating, tags);
    }
}
