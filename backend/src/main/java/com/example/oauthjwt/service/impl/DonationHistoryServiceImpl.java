package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.DonationHistoryRepository;
import com.example.oauthjwt.repository.DonationRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.DonationHistoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class DonationHistoryServiceImpl implements DonationHistoryService {
    private final DonationHistoryRepository donationHistoryRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DonationHistoryResponse createDonationHistory(DonationHistoryRequest donationHistoryRequest, Long userId) {
        User donator = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        if(donator.getWallet().getCredit() < donationHistoryRequest.getAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "시간이 충분하지 않습니다.");
        }

        Donation donation = donationRepository.findById(donationHistoryRequest.getDonationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부모집 정보가 존재하지 않습니다."));
        if(donation.getCurrentAmount() + donationHistoryRequest.getAmount() > donation.getTargetAmount()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "목표액 이상으로 기부하실 수 없습니다.");
        }

        DonationHistory result = donationHistoryRepository.save(DonationHistory.of(donationHistoryRequest, donation, donator));

        donator.addCredit(-result.getAmount());
        donation.addTime(result.getAmount());

        userRepository.save(donator);
        donationHistoryRepository.save(result);

        return DonationHistoryResponse.toDto(result);
    }

    @Override
    public Page<DonationHistoryResponse> getMyDonationHistoryByDonator(Pageable pageable, User donator) {
        return donationHistoryRepository.findByDonator(pageable, donator).map(DonationHistoryResponse::toDto);
    }

    @Override
    public Page<DonationHistoryResponse> getDonationHistoryByDonator(Pageable pageable) {
        return donationHistoryRepository.findAll(pageable).map(DonationHistoryResponse::toDto);
    }



    // 주간 top 3
    @Override
    public List<TopDonatorResponse> getWeeklyTop3() {
        var rows = donationHistoryRepository.findTopDonatorsSince(
                LocalDateTime.now().minusWeeks(1),
                PageRequest.of(0, 3)
        );
        return rows.stream()
                .map(row -> TopDonatorResponse.toDto(
                        (User)   row[0],
                        ((Number) row[1]).intValue()
                ))
                .collect(Collectors.toList());
    }

    // 월간 top 3
    @Override
    public List<TopDonatorResponse> getMonthlyTop3() {
        var rows = donationHistoryRepository.findTopDonatorsSince(
                LocalDateTime.now().minusMonths(1),
                PageRequest.of(0, 3)
        );
        return rows.stream()
                .map(row -> TopDonatorResponse.toDto(
                        (User)   row[0],
                        ((Number) row[1]).intValue()
                ))
                .collect(Collectors.toList());
    }

    // 반년(6개월) top 3
    @Override
    public List<TopDonatorResponse> getYearlyTop3() {
        var rows = donationHistoryRepository.findTopDonatorsSince(
                LocalDateTime.now().minusMonths(12),
                PageRequest.of(0, 3)
        );
        return rows.stream()
                .map(row -> TopDonatorResponse.toDto(
                        (User)   row[0],
                        ((Number) row[1]).intValue()
                ))
                .collect(Collectors.toList());
    }
}
