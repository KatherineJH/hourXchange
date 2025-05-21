package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.DonationHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/donationHistory")
@RequiredArgsConstructor
@Log4j2
public class DonationHistoryController {
    private final DonationHistoryService donationHistoryService;

    @PostMapping("/")
    public ResponseEntity<?> createDonationHistory(@RequestBody DonationHistoryRequest donationHistoryRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("Create DonationHistory");
        log.info(donationHistoryRequest);
        log.info(userDetails.getUser().getId());
        DonationHistoryResponse result = donationHistoryService.createDonationHistory(donationHistoryRequest, userDetails.getUser().getId());

        return ResponseEntity.ok(result);
    }


//    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page,
//                                     @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // ✅ 최신순 정렬
    @GetMapping("/")
    public ResponseEntity<?> getDonationHistory(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // ✅ 최신순 정렬

        Page<DonationHistoryResponse> result = donationHistoryService.getDonationHistoryByDonator(pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyDonationHistory(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // ✅ 최신순 정렬

        Page<DonationHistoryResponse> result = donationHistoryService.getMyDonationHistoryByDonator(pageable, userDetails.getUser());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/topDonator")
    public ResponseEntity<?> getTopDonator(@RequestParam("period") String period){
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

}
