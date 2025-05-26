package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationService {
    DonationResponse createDonation(DonationRequest donationRequest, CustomUserDetails userDetails);

    DonationResponse getDonation(Long donationId, String userKey);

    PageResult<DonationResponse> findAll(int page, int size);

    DonationResponse update(Long donationId, DonationRequest donationRequest, CustomUserDetails userDetails);

    List<DonationHistoryResponse> delete(Long donationId, CustomUserDetails userDetails);

    List<DonationResponse> getTopByProgress(int limit);
    List<DonationResponse> getTopByViewCount(int limit);
    List<DonationResponse> getTopByRecent(int limit);
}
