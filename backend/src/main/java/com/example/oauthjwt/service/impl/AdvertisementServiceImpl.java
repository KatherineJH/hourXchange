package com.example.oauthjwt.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
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

    // public Map<String, String> existsById(Long id) {
    // if(!advertisementRepository.existsById(id)) {
    // return Map.of("error", "광고를 찾을 수 없습니다.");
    // }
    // return Collections.emptyMap();
    // }

    @Override
    public Advertisement createAdvertisement(AdvertisementRequest advertisementRequest) {
        User owner = userRepository.findById(advertisementRequest.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다"));

        boolean existsByTitle = advertisementRepository.existsByTitle(advertisementRequest.getTitle());
        if (existsByTitle) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 제목입니다.");
        }

        Advertisement advertisement = Advertisement.builder().owner(owner).id(advertisementRequest.getId())
                .title(advertisementRequest.getTitle()).description(advertisementRequest.getDescription())
                .hours(advertisementRequest.getHours()).build();
        return advertisementRepository.save(advertisement);
    }

    @Override
    public Advertisement findAdvertisementById(Long advertisementId, Long ownerId) {
        Advertisement advertisement = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new IllegalArgumentException("광고가 존재하지 않습니다."));

        if (!advertisement.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("해당 광고에 대한 권한이 없습니다");
        }
        return advertisement;
    }

    @Override
    public Advertisement updateAdvertisement(AdvertisementRequest advertisementRequest) {
        Advertisement advertisement = advertisementRepository.findById(advertisementRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 광고가 존재하지 않습니다."));
        if (!advertisement.getOwner().getId().equals(advertisementRequest.getOwnerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 수정할 수 있습니다.");
        }
        advertisement.setTitle(advertisementRequest.getTitle());
        advertisement.setDescription(advertisementRequest.getDescription());
        advertisement.setHours(advertisementRequest.getHours());

        return advertisementRepository.save(advertisement);
    }

    public List<Advertisement> findAllAdvertisements() {
        return advertisementRepository.findAll();
    }
}
