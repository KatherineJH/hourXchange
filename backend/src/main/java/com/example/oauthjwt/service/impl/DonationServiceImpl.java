package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.DonationHistoryRepository;
import com.example.oauthjwt.repository.DonationRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.repository.WalletRepository;
import com.example.oauthjwt.service.DonationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {
    private final DonationRepository donationRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    @Override
    public DonationResponse createDonation(DonationRequest donationRequest) {
        Donation result = donationRepository.save(Donation.of(donationRequest));

        return DonationResponse.toDto(result);
    }

    @Override
    public DonationResponse getDonation(Long donationId) {
        Donation result = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부 정보가 존재하지 않습니다."));

        return DonationResponse.toDto(result);
    }

    @Override
    public Page<DonationResponse> findAll(Pageable pageable) {
        Page<Donation> donationPage = donationRepository.findAll(pageable);

        return donationPage.map(DonationResponse::toDto);
    }

    @Override
    public DonationResponse update(Long donationId, DonationRequest donationRequest) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부 정보가 존재하지 않습니다."));
        if(donationRequest.getTargetAmount() < donation.getCurrentAmount()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집 목표시간은 현재 모집된 시간보다 높아야합니다.");
        }
        Donation result = donationRepository.save(donation.setUpdateValue(donationRequest));

        return DonationResponse.toDto(result);
    }

    @Override
    @Transactional
    public List<DonationHistoryResponse> delete(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부 정보가 존재하지 않습니다."));
        Donation result = donationRepository.save(donation.setDelete());

        // 2) 기부 히스토리에서 유저별 기부량 집계
        List<Object[]> rows = donationHistoryRepository.findUserIdAndTotalHoursByDonation(donationId);

        List<DonationHistoryResponse> donationHistoryResponseList = new ArrayList<>();
        // 3) 각 유저의 지갑에 credit 복원
        for (Object[] row : rows) {
            Long userId = (Long) row[0];
            Integer hours = ((Number) row[1]).intValue();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));
            DonationHistory donationHistory = donationHistoryRepository.save(DonationHistory.of(result, user, hours));
            donationHistoryResponseList.add(DonationHistoryResponse.toDto(donationHistory));
            walletRepository.addCredit(userId, hours);
        }

        return donationHistoryResponseList;
    }
}
