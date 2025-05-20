package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.DonationHistoryRequest;

import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationHistoryService {
    DonationHistoryResponse createDonationHistory(DonationHistoryRequest donationHistoryRequest, Long userId);

    Page<DonationHistoryResponse> getDonationHistoryByDonator(Pageable pageable);

    Page<DonationHistoryResponse> getMyDonationHistoryByDonator(Pageable pageable, User donator);

    List<TopDonatorResponse> getWeeklyTop3();

    List<TopDonatorResponse> getMonthlyTop3();

    List<TopDonatorResponse> getYearlyTop3();
}
