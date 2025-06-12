package com.example.oauthjwt.controller;

import java.util.List;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.DonationService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/donation")
@RequiredArgsConstructor
@Log4j2
public class DonationController {
    private final DonationService donationService;
    private final LocationUtil locationUtil;

    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<DonationResponse> createDonation(@RequestBody @Valid DonationRequest donationRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(donationRequest);

        DonationResponse result = donationService.createDonation(donationRequest, userDetails);
        return ResponseEntity.created(locationUtil.createdLocation(result.getId())).body(result);
    }

    @GetMapping("/{donationId}")
    public ResponseEntity<DonationResponse> getDonation(@PathVariable Long donationId, HttpServletRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 인증된 유저면 userId, 아니면 클라이언트 IP
        String userKey = (userDetails != null)
                ? "user:" + userDetails.getUser().getId()
                : "ip:" + request.getRemoteAddr();

        DonationResponse result = donationService.getDonation(donationId, userKey);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<PageResult<DonationResponse>> findAll(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // 로직 실행
        PageResult<DonationResponse> result = donationService.findAll(page, size);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<DonationResponse>> findAllMyDonation(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size,
                                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // 로직 실행
        Page<DonationResponse> result = donationService.findAllMyDonation(pageable, userDetails);
        // 반환
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PageResult<DonationResponse>> search(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @ModelAttribute DonationSearchCondition condition) {
        // 로직 실행
        PageResult<DonationResponse> result = donationService.search(page, size, condition);
        // 반환
        return ResponseEntity.ok(result);
    }

    @PutMapping("/modify/{donationId}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<DonationResponse> updateDonation(@PathVariable Long donationId,
            @RequestBody @Valid DonationRequest donationRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info(donationRequest);
        DonationResponse result = donationService.update(donationId, donationRequest, userDetails);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/cancel/{donationId}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<DonationHistoryResponse>> cancelDonation(@PathVariable Long donationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<DonationHistoryResponse> result = donationService.cancel(donationId, userDetails);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/end/{donationId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DonationResponse> endDonation(@PathVariable Long donationId){
        DonationResponse result = donationService.end(donationId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/complete/{donationId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DonationResponse> completeDonation(@PathVariable Long donationId,
                                                             @RequestBody String url){
        log.info(url);
        DonationResponse result = donationService.complete(donationId, url);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/updateProof/{donationId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DonationResponse> updateDonationProof(@PathVariable Long donationId,
                                                             @RequestBody String url){
        log.info(url);
        DonationResponse result = donationService.updateDonationProof(donationId, url);
        return ResponseEntity.ok(result);
    }


    // 목표 대비 진행률 상위 n개
    @GetMapping("/top-progress")
    public ResponseEntity<List<DonationResponse>> topByProgress(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByProgress(limit);
        return ResponseEntity.ok(result);
    }

    // 조회수 상위 n개
    @GetMapping("/top-views")
    public ResponseEntity<List<DonationResponse>> topByViews(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByViewCount(limit);
        return ResponseEntity.ok(result);
    }

    // 최신 생성 순 상위 n개
    @GetMapping("/recent")
    public ResponseEntity<List<DonationResponse>> topByRecent(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DonationResponse> result = donationService.getTopByRecent(limit);
        return ResponseEntity.ok(result);
    }

}
