package com.example.oauthjwt.service.impl;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.entity.type.UserRole;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.DonationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
@CacheConfig(cacheNames = {"donationFindAll"})
public class DonationServiceImpl implements DonationService {
    private final DonationRepository donationRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final DonationImageRepository donationImageRepository;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    @CacheEvict(cacheNames = {"donationFindAll", "searchDonations"}, allEntries = true)
    public DonationResponse createDonation(DonationRequest donationRequest, CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다."));

        // 기부 생성
        Donation donation = Donation.of(donationRequest, author);

        // 이미지 중복 검사 및 저장
        if (donationRequest.getImages() != null) {
            for (String url : donationRequest.getImages()) {
                if (donationImageRepository.existsByImgUrl(url)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이미지입니다: " + url);
                }
                DonationImage donationImage = DonationImage.of(url, donation);
                donation.getImages().add(donationImage);
            }
        }

        // 저장
        Donation result = donationRepository.save(donation);

        return DonationResponse.toDto(result);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {"donationFindAll", "donationSearch"}, allEntries = true)
    public DonationResponse update(Long donationId, DonationRequest donationRequest, CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다."));

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));
        if(!donation.getStatus().equals(DonationStatus.ONGOING)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부모집이 진행중인 경우에만 수정이 가능합니다.");
        }
        if(!userDetails.getUser().getRole().equals(UserRole.ROLE_ADMIN)){
            if (!donation.getAuthor().getId().equals(author.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글을 수정할 권한이 없습니다.");
            }
        }

        if (donationRequest.getTargetAmount() < donation.getCurrentAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집 목표시간은 현재 모집된 시간보다 높아야합니다.");
        }

        // 이미지 중복 검사 및 저장
        if (donationRequest.getImages() != null) {
            donationImageRepository.deleteByDonationId(donation.getId());
            for (String url : donationRequest.getImages()) {
                if (donationImageRepository.existsByImgUrl(url)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이미지입니다.");
                }
                DonationImage donationImage = DonationImage.of(url, donation);
                donation.getImages().add(donationImage);
            }
        }

        Donation result = donationRepository.save(donation.setUpdateValue(donationRequest));

        return DonationResponse.toDto(result);
    }

    @Override
    public DonationResponse getDonation(Long donationId, String userKey) {
        Donation result = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));

        String key = "view donationId: " + donationId + ", by: " + userKey;

        Boolean alreadyExists = stringRedisTemplate.hasKey(key);
        if (!alreadyExists) { // 존재하지 않으면
            log.info("캐싱");
            // 뷰 카운트 증가
            donationRepository.save(result.addViewCount());
            // 24시간 TTL로 기록
            stringRedisTemplate.opsForValue().set(key, "1", Duration.ofHours(24));
        }
        log.info("무시");

        return DonationResponse.toDto(result);
    }

    @Override
    @Cacheable(cacheNames = "donationFindAll", key = "#page + ':' + #size")
    public PageResult<DonationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<Donation> donationPage = donationRepository.findAll(pageable);

        List<DonationResponse> content = donationPage.getContent().stream().map(DonationResponse::toDto)
                .collect(Collectors.toList());

        return new PageResult<>(content, donationPage.getNumber(), donationPage.getSize(),
                donationPage.getTotalElements(), donationPage.getTotalPages());
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = {"donationFindAll", "donationSearch"}, allEntries = true)
    public List<DonationHistoryResponse> cancel(Long donationId, CustomUserDetails userDetails) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));


        if(!userDetails.getUser().getRole().equals(UserRole.ROLE_ADMIN)){
            if (!donation.getAuthor().getId().equals(userDetails.getUser().getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글을 삭제할 권한이 없습니다.");
            }
        }
        if (!donation.getStatus().equals(DonationStatus.ONGOING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부모집이 진행중인 경우에만 취소가 가능합니다.");
        }

        Donation result = donationRepository.save(donation.setCancelled());

        // 2) 기부 히스토리에서 유저별 기부량 집계
        List<Object[]> rows = donationHistoryRepository.findUserIdAndTotalHoursByDonation(donationId);

        List<DonationHistoryResponse> donationHistoryResponseList = new ArrayList<>();
        // 3) 각 유저의 지갑에 credit 복원
        for (Object[] row : rows) {
            Long userId = (Long) row[0];
            Integer hours = ((Number) row[1]).intValue();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
            DonationHistory donationHistory = donationHistoryRepository.save(DonationHistory.of(result, user, hours));
            donationHistoryResponseList.add(DonationHistoryResponse.toDto(donationHistory));
            walletRepository.addCredit(userId, hours);
        }

        return donationHistoryResponseList;
    }

    @Override
    @CacheEvict(cacheNames = {"donationFindAll", "donationSearch"}, allEntries = true)
    public DonationResponse end(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));
        log.info(donation.getEndDate().toString());
        log.info(LocalDate.now().toString());
        log.info(LocalDate.now().isBefore(donation.getEndDate()));
        log.info(donation.getTargetAmount());
        log.info(donation.getCurrentAmount());
        log.info((double) donation.getCurrentAmount() / donation.getTargetAmount());
        if(!LocalDate.now().isAfter(donation.getEndDate())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "종료 날짜 이후에 종료가 가능합니다.");
        }
        if(!((double) donation.getCurrentAmount() / donation.getTargetAmount() > 0.5)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집된 시간이 50% 이상일 경우에 종료 처리가 가능합니다.");
        }
        if (!donation.getStatus().equals(DonationStatus.ONGOING)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부모집이 진행중인 경우에만 완료 처리가 가능합니다.");
        }
        Donation result = donationRepository.save(donation.setEnded());
        return DonationResponse.toDto(result);
    }

    @Override
    public DonationResponse complete(Long donationId, String url) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));
        if (!donation.getStatus().equals(DonationStatus.ENDED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부모집이 종료된 경우에만 증빙 처리가 가능합니다.");
        }
        if(url == null || url.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "증빙 시 사진은 필수입니다.");
        }

        Donation result = donationRepository.save(donation.setCompleted(url));
        return DonationResponse.toDto(result);
    }

    @Override
    public DonationResponse updateDonationProof(Long donationId, String url) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "기부 정보가 존재하지 않습니다."));
        if (!donation.getStatus().equals(DonationStatus.COMPLETED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기부모집이 완료된 경우에만 증빙 처리가 가능합니다.");
        }
        if(url == null || url.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "증빙 시 사진은 필수입니다.");
        }
        Donation result = donationRepository.save(donation.setCompleted(url));
        return DonationResponse.toDto(result);
    }

    @Override
    public List<DonationResponse> getTopByProgress(int limit) {
        LocalDate today = LocalDate.now();
        return donationRepository.findTopByProgress(DonationStatus.ONGOING, today, PageRequest.of(0, limit)).stream()
                .map(DonationResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public List<DonationResponse> getTopByViewCount(int limit) {
        LocalDate today = LocalDate.now();
        return donationRepository.findTopByViewCount(DonationStatus.ONGOING, today, PageRequest.of(0, limit)).stream()
                .map(DonationResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public List<DonationResponse> getTopByRecent(int limit) {
        LocalDate today = LocalDate.now();
        return donationRepository.findTopByCreatedAt(DonationStatus.ONGOING, today, PageRequest.of(0, limit)).stream()
                .map(DonationResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public PageResult<DonationResponse> search(int page, int size, DonationSearchCondition condition) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<Donation> donationPage = donationRepository.search(condition, pageable);

        List<DonationResponse> content = donationPage.getContent().stream().map(DonationResponse::toDto)
                .collect(Collectors.toList());

        return new PageResult<>(content, donationPage.getNumber(), donationPage.getSize(),
                donationPage.getTotalElements(), donationPage.getTotalPages());
    }

    @Override
    public Page<DonationResponse> findAllMyDonation(Pageable pageable, CustomUserDetails userDetails) {
        return donationRepository.findByAuthorId(userDetails.getUser().getId(), pageable).map(DonationResponse::toDto);
    }


}
