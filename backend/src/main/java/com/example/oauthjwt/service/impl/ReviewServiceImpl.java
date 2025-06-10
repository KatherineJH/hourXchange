package com.example.oauthjwt.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.dto.response.UserTagResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewTagRepository reviewTagRepository;
    private final ProductRepository ProductRepository;
    private final TransactionRepository transactionRepository;
    private final UserTagRepository userTagRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.flask}/sentiment/predict")
    private String flaskUrl;

    @Override
    public ReviewResponse saveReview(ReviewRequest request, User reviewer) {
        Product product = ProductRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품 정보가 존재하지 않습니다."));
        if (request.getTransactionId() != null) {
            Optional<Review> existingReview = reviewRepository.findByTransactionId(request.getTransactionId());
            if (existingReview.isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 해당 거래에 대한 리뷰가 작성되었습니다.");
            }
        }
        // Flask 서버에 감성 분석 요청
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> flaskRequest = Map.of("text", request.getText());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(flaskRequest, headers);
        Map<String, Object> response = restTemplate.postForObject(flaskUrl, entity, Map.class);

        Map<String, Object> sentiment = (Map<String, Object>) response.get("sentiment");
        List<String> tags = (List<String>) response.get("tags");

        int rating = ((String) sentiment.get("result")).contains("긍정") ? 1 : 0;

        // 리뷰 저장
        Review review = Review.of(request, rating, reviewer, product);

        if (request.getTransactionId() != null) {
            Transaction transaction = transactionRepository.findById(request.getTransactionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "트랜잭션 정보가 존재하지 않습니다."));
            review.setTransaction(transaction);
            transaction.setReview(review); // 양방향 연관 설정
        }
        reviewRepository.save(review);

        // 태그 저장 (긍정인 경우만)
        if (rating == 1) {
            for (String tag : tags) {
                ReviewTag reviewTag = ReviewTag.of(tag, review);
                reviewTagRepository.save(reviewTag);

                Optional<UserTag> optional = userTagRepository.findByUserAndTag(product.getOwner(), tag);
                if (optional.isPresent()) {
                    UserTag userTag = optional.get();
                    userTag.incrementCount();
                    userTagRepository.save(userTag);
                } else {
                    UserTag userTag = UserTag.builder().tag(tag).count(1).user(product.getOwner()).build();
                    userTagRepository.save(userTag);
                }
            }
        }
        return ReviewResponse.toDto(review);
    }

    @Override
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "리뷰 정보가 존재하지 않습니다."));

        return ReviewResponse.toDto(review);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();

        return reviews.stream().map(review -> {
            List<String> tags = review.getTags().stream()
                    .map(ReviewTag::getTag)
                    .toList();

            return new ReviewResponse(
                    review.getId(),
                    review.getContent(),
                    review.getRates(),
                    review.getStars(),
                    tags
            );
        }).toList();
    }

    @Override
    public ReviewResponse updateReview(Long id, ReviewRequest request, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "리뷰 정보가 존재하지 않습니다."));

        if (!review.getReviewer().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신이 작성한 리뷰만 수정이 가능합니다.");
        }

        // Flask 서버에 새 텍스트로 감정 분석
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> flaskRequest = Map.of("text", request.getText());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(flaskRequest, headers);

        Map<String, Object> response = restTemplate.postForObject(flaskUrl, entity, Map.class);

        Map<String, Object> sentiment = (Map<String, Object>) response.get("sentiment");
        List<String> tags = (List<String>) response.get("tags");

        int rating = ((String) sentiment.get("result")).contains("긍정") ? 1 : 0;

        // 내용 업데이트
        review.setContent(request.getText());
        review.setRates(rating);
        review.setCreatedAt(LocalDateTime.now());
        review.setStars(request.getStars());
        reviewRepository.save(review);

        // 기존 태그 삭제 후 새로 저장 (긍정만)
        reviewTagRepository.deleteAll(review.getTags());

        if (rating == 1) {
            for (String tag : tags) {
                ReviewTag reviewTag = new ReviewTag();
                reviewTag.setTag(tag);
                reviewTag.setReview(review);
                reviewTagRepository.save(reviewTag);
            }
        }

        return ReviewResponse.toDto(review);
    }

    @Override
    public List<String> getReviewTagsByReceiverId(Long userId) {
        List<Review> reviews = reviewRepository.findByProductOwnerId(userId);
        return reviews.stream().flatMap(review -> review.getTags().stream()).map(ReviewTag::getTag).distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<UserTagResponse> getUserTags(Long userId) {
        return userTagRepository.findByUserIdOrderByCountDesc(userId).stream().limit(20) // count 기준 상위 20개 제한
                .map(ut -> new UserTagResponse(ut.getTag(), ut.getCount())).collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByReceiverId(Long userId) {
        List<Review> reviews = reviewRepository.findByProductOwnerId(userId);
        return reviews.stream()
                .map(review -> ReviewResponse.builder().reviewId(review.getId()).content(review.getContent())
                        .stars(review.getStars()) // 사용자 별점
                        .tags(review.getTags().stream().map(ReviewTag::getTag).toList()).build())
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(ReviewResponse::toDto);
    }

}
