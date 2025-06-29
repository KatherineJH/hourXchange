package com.example.oauthjwt.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.DonationHistorySearchCondition;
import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.entity.User;

public interface DonationHistoryService {
    DonationHistoryResponse createDonationHistory(DonationHistoryRequest donationHistoryRequest, Long userId);

    Page<DonationHistoryResponse> getDonationHistoryByDonator(Pageable pageable);

    Page<DonationHistoryResponse> getMyDonationHistoryByDonator(Pageable pageable, User donator);

    List<TopDonatorResponse> getWeeklyTop3();

    List<TopDonatorResponse> getMonthlyTop3();

    List<TopDonatorResponse> getYearlyTop3();

    List<DonationHistoryResponse> getPaymentsBetween(String from, String to);

    List<DonationHistoryResponse> getAmountSumBetween(String from, String to);

    Page<DonationHistoryResponse> search(Pageable pageable, DonationHistorySearchCondition condition);
}
