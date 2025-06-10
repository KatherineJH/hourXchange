package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.service.ReviewService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final LocationUtil locationUtil;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ReviewResponse> createReview(@RequestBody @Valid ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReviewResponse result = reviewService.saveReview(request, userDetails.getUser());
        return ResponseEntity.created(locationUtil.createdLocation(result.getReviewId())).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable Long id, @RequestBody @Valid ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reviewService.updateReview(id, request, userDetails.getUser()));
    }

    @GetMapping("/receiver/{userId}/tags")
    public ResponseEntity<List<String>> getTagsByReceiverId(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewTagsByReceiverId(userId));
    }

    @GetMapping("/receiver/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByReceiver(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByReceiverId(userId);
        return ResponseEntity.ok(reviews);
    }
}
