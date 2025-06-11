package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DonationService {
    DonationResponse createDonation(DonationRequest donationRequest, CustomUserDetails userDetails);

    DonationResponse getDonation(Long donationId, String userKey);

    PageResult<DonationResponse> findAll(int page, int size);

    DonationResponse update(Long donationId, DonationRequest donationRequest, CustomUserDetails userDetails);

    List<DonationHistoryResponse> cancel(Long donationId, CustomUserDetails userDetails);

    List<DonationResponse> getTopByProgress(int limit);
    List<DonationResponse> getTopByViewCount(int limit);
    List<DonationResponse> getTopByRecent(int limit);

    PageResult<DonationResponse> search(int page, int size, DonationSearchCondition condition);

    Page<DonationResponse> findAllMyDonation(Pageable pageable, CustomUserDetails userDetails);

    DonationResponse end(Long donationId);

    DonationResponse complete(Long donationId, String url);

    DonationResponse updateDonationProof(Long donationId, String url);
}
