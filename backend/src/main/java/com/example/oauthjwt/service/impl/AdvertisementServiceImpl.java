package com.example.oauthjwt.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.AdvertisementResponse;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.AdvertisementRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.AdvertisementService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdvertisementServiceImpl implements AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final UserRepository userRepository;

    @Override
    public Advertisement createAdvertisement(AdvertisementRequest advertisementRequest, CustomUserDetails userDetails) {
        User owner = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));

        Advertisement advertisement = Advertisement.of(advertisementRequest, owner);

        boolean existsByTitle = advertisementRepository.existsByTitle(advertisementRequest.getTitle());
        if (existsByTitle) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 제목입니다.");
        }

        return advertisementRepository.save(advertisement);
    }

    @Override
    @Transactional(readOnly = true)
    public AdvertisementResponse findAdvertisementDetail(Long advertisementId) {
        Advertisement advertisement = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "광고가 존재하지 않습니다."));
        return AdvertisementResponse.toDto(advertisement);
    }

    @Override
    public AdvertisementResponse updateAdvertisement(Long advertisementId, AdvertisementRequest advertisementRequest,
            CustomUserDetails userDetails) {
        User owner = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));

        Advertisement advertisement = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 광고가 존재하지 않습니다."));

        if (!advertisement.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 수정할 수 있습니다.");
        }

        advertisement.setUpdateValue(advertisementRequest);
        Advertisement updated = advertisementRepository.save(advertisement);
        return AdvertisementResponse.toDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdvertisementResponse> findAllAdvertisements(Pageable pageable) {
        // List<Advertisement> advertisementList = advertisementRepository.findAll();
        // advertisementList.forEach(ad -> ad.getImages().size());
        return advertisementRepository.findAll(pageable).map(AdvertisementResponse::toDto);
    }

    @Override
    @Transactional
    public AdvertisementResponse deleteAdvertisement(Long advertisementId, CustomUserDetails userDetails) {
        User owner = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));

        Advertisement advertisement = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제할 광고가 존재하지 않습니다."));
        if (!advertisement.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 삭제할 수 있습니다.");
        }
        AdvertisementResponse responseToReturn = AdvertisementResponse.toDto(advertisement);

        advertisementRepository.delete(advertisement);

        return responseToReturn;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdvertisementResponse> findMyAdvertisements(CustomUserDetails userDetails, Pageable pageable) {
        // Long userId = userDetails.getUser().getId();
        // List<Advertisement> advertisementList =
        // advertisementRepository.findAllByOwnerId(userId);
        // advertisementList.forEach(ad -> ad.getImages().size());
        User user = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."));
        return advertisementRepository.findByOwner(user, pageable).map(AdvertisementResponse::toDto);
    }
}
