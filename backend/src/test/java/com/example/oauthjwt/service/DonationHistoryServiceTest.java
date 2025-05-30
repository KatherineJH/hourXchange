package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.DonationHistoryRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.TopDonatorResponse;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.DonationHistoryRepository;
import com.example.oauthjwt.repository.DonationRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.impl.DonationHistoryServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class DonationHistoryServiceTest {

    @Mock
    private DonationHistoryRepository donationHistoryRepository;

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DonationHistoryServiceImpl donationHistoryService;

    private DonationHistoryRequest makeRequest(int amount, Long donationId) {
        return DonationHistoryRequest.builder()
                .amount(amount)
                .donationId(donationId)
                .build();
    }

    @Test
    @DisplayName("createDonationHistory: 정상 생성")
    void createDonationHistory_Success() {
        Long userId = 1L;
        Long donationId = 2L;
        DonationHistoryRequest req = makeRequest(5, donationId);

        // mock donator and wallet
        User donator = mock(User.class);
        var wallet = mock(com.example.oauthjwt.entity.Wallet.class);
        given(userRepository.findById(userId)).willReturn(Optional.of(donator));
        given(donator.getWallet()).willReturn(wallet);
        given(wallet.getCredit()).willReturn(10);

        // mock donation entity
        Donation donation = mock(Donation.class);
        given(donationRepository.findById(donationId)).willReturn(Optional.of(donation));
        given(donation.getCurrentAmount()).willReturn(0);
        given(donation.getTargetAmount()).willReturn(100);

        // stub save twice
        given(donationHistoryRepository.save(any(DonationHistory.class)))
                .willAnswer(inv -> inv.getArgument(0));

        // 실행
        DonationHistoryResponse res = donationHistoryService.createDonationHistory(req, userId);

        // 검증
        assertThat(res.getAmount()).isEqualTo(5);
        then(userRepository).should().save(donator);
        then(donationHistoryRepository).should(times(2)).save(any(DonationHistory.class));
    }

    @Test
    @DisplayName("createDonationHistory: 유저 없음 예외")
    void createDonationHistory_UserNotFound() {
        Long userId = 1L;
        given(userRepository.findById(userId)).willReturn(Optional.empty());

        assertThatThrownBy(() ->
                donationHistoryService.createDonationHistory(makeRequest(5, 2L), userId)
        ).isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }

    @Test
    @DisplayName("createDonationHistory: 잔액 부족 예외")
    void createDonationHistory_InsufficientCredit() {
        Long userId = 1L;
        User donator = mock(User.class);
        var wallet = mock(com.example.oauthjwt.entity.Wallet.class);

        given(userRepository.findById(userId)).willReturn(Optional.of(donator));
        given(donator.getWallet()).willReturn(wallet);
        given(wallet.getCredit()).willReturn(3);

        assertThatThrownBy(() ->
                donationHistoryService.createDonationHistory(makeRequest(5, 2L), userId)
        ).isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                });
    }

    @Test
    @DisplayName("createDonationHistory: 기부모집 정보 없음 예외")
    void createDonationHistory_DonationNotFound() {
        Long userId = 1L;
        User donator = mock(User.class);
        var wallet = mock(com.example.oauthjwt.entity.Wallet.class);

        given(userRepository.findById(userId)).willReturn(Optional.of(donator));
        given(donator.getWallet()).willReturn(wallet);
        given(wallet.getCredit()).willReturn(10);
        given(donationRepository.findById(2L)).willReturn(Optional.empty());

        assertThatThrownBy(() ->
                donationHistoryService.createDonationHistory(makeRequest(5, 2L), userId)
        ).isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }

    @Test
    @DisplayName("createDonationHistory: 목표 초과 예외")
    void createDonationHistory_OverTarget() {
        Long userId = 1L;
        DonationHistoryRequest req = makeRequest(50, 2L);

        User donator = mock(User.class);
        var wallet = mock(com.example.oauthjwt.entity.Wallet.class);
        Donation donation = mock(Donation.class);

        given(userRepository.findById(userId)).willReturn(Optional.of(donator));
        given(donator.getWallet()).willReturn(wallet);
        given(wallet.getCredit()).willReturn(100);
        given(donationRepository.findById(2L)).willReturn(Optional.of(donation));
        given(donation.getCurrentAmount()).willReturn(60);
        given(donation.getTargetAmount()).willReturn(100);

        assertThatThrownBy(() ->
                donationHistoryService.createDonationHistory(req, userId)
        ).isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                });
    }

    @Test
    @DisplayName("getMyDonationHistoryByDonator: 페이징 반환")
    void getMyDonationHistoryByDonator_Success() {
        User donator = new User();
        PageRequest pageable = PageRequest.of(0, 2);
        DonationHistory dh = DonationHistory.of(mock(Donation.class),
                donator, 5);
        Page<DonationHistory> page = new PageImpl<>(List.of(dh), pageable, 1);

        given(donationHistoryRepository.findByDonator(pageable, donator))
                .willReturn(page);

        Page<DonationHistoryResponse> result =
                donationHistoryService.getMyDonationHistoryByDonator(pageable, donator);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getAmount()).isEqualTo(5);
    }

    @Test
    @DisplayName("getDonationHistoryByDonator: 전체 페이징 반환")
    void getDonationHistoryByDonator_Success() {
        PageRequest pageable = PageRequest.of(0, 3);
        DonationHistory dh = DonationHistory.of(mock(Donation.class),
                mock(User.class), 7);
        Page<DonationHistory> page = new PageImpl<>(List.of(dh), pageable, 1);

        given(donationHistoryRepository.findAll(pageable))
                .willReturn(page);

        Page<DonationHistoryResponse> result =
                donationHistoryService.getDonationHistoryByDonator(pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getAmount()).isEqualTo(7);
    }

    @Test
    @DisplayName("getWeeklyTop3: 주간 Top3 반환")
    void getWeeklyTop3_Success() {
        User topUser = new User(); topUser.setId(10L);
        Object[] row = new Object[]{ topUser, Integer.valueOf(15) };
        given(donationHistoryRepository.findTopDonatorsSince(
                any(LocalDateTime.class),
                eq(PageRequest.of(0, 3))
        )).willReturn((List<Object[]>) List.of(row));

        List<TopDonatorResponse> topList = donationHistoryService.getWeeklyTop3();

        assertThat(topList).hasSize(1);
        assertThat(topList.get(0).getUser().getId()).isEqualTo(10L);
        assertThat(topList.get(0).getTotalDonationTime()).isEqualTo(15);
    }

    @Test
    @DisplayName("getMonthlyTop3: 월간 Top3 반환")
    void getMonthlyTop3_Success() {
        User topUser = new User(); topUser.setId(20L);
        Object[] row = new Object[]{ topUser, Integer.valueOf(25) };
        given(donationHistoryRepository.findTopDonatorsSince(
                any(LocalDateTime.class),
                eq(PageRequest.of(0, 3))
        )).willReturn((List<Object[]>) List.of(row));

        List<TopDonatorResponse> topList = donationHistoryService.getMonthlyTop3();

        assertThat(topList).hasSize(1);
        assertThat(topList.get(0).getUser().getId()).isEqualTo(20L);
        assertThat(topList.get(0).getTotalDonationTime()).isEqualTo(25);
    }

    @Test
    @DisplayName("getYearlyTop3: 연간 Top3 반환")
    void getYearlyTop3_Success() {
        User topUser = new User(); topUser.setId(30L);
        Object[] row = new Object[]{ topUser, Integer.valueOf(35) };
        given(donationHistoryRepository.findTopDonatorsSince(
                any(LocalDateTime.class),
                eq(PageRequest.of(0, 3))
        )).willReturn((List<Object[]>) List.of(row));

        List<TopDonatorResponse> topList = donationHistoryService.getYearlyTop3();

        assertThat(topList).hasSize(1);
        assertThat(topList.get(0).getUser().getId()).isEqualTo(30L);
        assertThat(topList.get(0).getTotalDonationTime()).isEqualTo(35);
    }
}
