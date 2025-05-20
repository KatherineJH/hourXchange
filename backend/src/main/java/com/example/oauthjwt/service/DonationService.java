package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationService {
    DonationResponse createDonation(DonationRequest donationRequest, CustomUserDetails userDetails);

    DonationResponse getDonation(Long donationId);

    Page<DonationResponse> findAll(Pageable pageable);

    DonationResponse update(Long donationId, DonationRequest donationRequest, CustomUserDetails userDetails);

    List<DonationHistoryResponse> delete(Long donationId);
}
