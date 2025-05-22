package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.DonationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donation")
@RequiredArgsConstructor
@Log4j2
public class DonationController {
    private final DonationService donationService;

    @PostMapping("/")
    public ResponseEntity<?> createDonation(@RequestBody DonationRequest donationRequest,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(donationRequest);

        DonationResponse result = donationService.createDonation(donationRequest, userDetails);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{donationId}")
    public ResponseEntity<?> getDonation(@PathVariable Long donationId, HttpServletRequest request,
                                         @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 인증된 유저면 userId, 아니면 클라이언트 IP
        String userKey = (userDetails != null)
                ? "user:" + userDetails.getUser().getId()
                : "ip:"   + request.getRemoteAddr();

        DonationResponse result = donationService.getDonation(donationId, userKey);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        // 로직 실행
        Page<DonationResponse> result = donationService.findAll(pageable);
        // 반환
        return ResponseEntity.ok(result);
    }

    @PutMapping("/modify/{donationId}")
    public ResponseEntity<?> updateDonation(@PathVariable Long donationId, @RequestBody DonationRequest donationRequest,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(donationRequest);
        DonationResponse result = donationService.update(donationId, donationRequest, userDetails);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/delete/{donationId}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long donationId) {
        List<DonationHistoryResponse> result = donationService.delete(donationId);
        return ResponseEntity.ok(result);
    }

    // 목표 대비 진행률 상위 n개
    @GetMapping("/top-progress")
    public ResponseEntity<?> topByProgress(@RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByProgress(limit);
        return ResponseEntity.ok(result);
    }

    // 조회수 상위 n개
    @GetMapping("/top-views")
    public ResponseEntity<?> topByViews(@RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByViewCount(limit);
        return ResponseEntity.ok(result);
    }

    // 최신 생성 순 상위 n개
    @GetMapping("/recent")
    public ResponseEntity<?> topByRecent(@RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByRecent(limit);
        return ResponseEntity.ok(result);
    }

}
