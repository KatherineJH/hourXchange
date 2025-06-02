package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.condition.DonationHistorySearchCondition;
import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.DonationHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donationHistory")
@RequiredArgsConstructor
@Log4j2
public class DonationHistoryController {
    private final DonationHistoryService donationHistoryService;

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<DonationHistoryResponse> createDonationHistory(@RequestBody @Valid DonationHistoryRequest donationHistoryRequest,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        DonationHistoryResponse result = donationHistoryService.createDonationHistory(donationHistoryRequest, userDetails.getUser().getId());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<DonationHistoryResponse>> getDonationHistory(@RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<DonationHistoryResponse> result = donationHistoryService.getDonationHistoryByDonator(pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/search/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<DonationHistoryResponse>> search(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size,
                                                                @ModelAttribute DonationHistorySearchCondition condition) {
        log.info(condition);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<DonationHistoryResponse> result = donationHistoryService.search(pageable, condition);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<DonationHistoryResponse>> getMyDonationHistory(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<DonationHistoryResponse> result = donationHistoryService.getMyDonationHistoryByDonator(pageable, userDetails.getUser());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/topDonator")
    public ResponseEntity<List<TopDonatorResponse>> getTopDonator(@RequestParam("period") String period){
        List<TopDonatorResponse> topList;
        switch (period.toLowerCase()) {
            case "weekly":
                topList = donationHistoryService.getWeeklyTop3();
                break;
            case "monthly":
                topList = donationHistoryService.getMonthlyTop3();
                break;
            case "yearly":
                topList = donationHistoryService.getYearlyTop3();
                break;
            default:
                throw new IllegalArgumentException("Unknown period: " + period);
        }
        return ResponseEntity.ok(topList);
    }

    /** 기간을 선택하여 데이터를 로드 */
    @GetMapping("/range")
    public List<DonationHistoryResponse> getDonationPaymentByRange(
            @RequestParam("from") String fromDateStr,
            @RequestParam("to") String toDateStr) {
        return donationHistoryService.getPaymentsBetween(fromDateStr, toDateStr);
    }

    @GetMapping("/range/amount")
    public List<DonationHistoryResponse> getDonationAmountByRange(
            @RequestParam("from") String from,
            @RequestParam("to") String to) {
        return donationHistoryService.getAmountSumBetween(from, to);
    }
}
