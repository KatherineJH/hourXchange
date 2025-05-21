package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.response.AdvertisementResponse;
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


    @Override
    public Advertisement createAdvertisement(AdvertisementRequest advertisementRequest) {
        User owner = userRepository.findById(advertisementRequest.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다"));

        Advertisement advertisement = Advertisement.of(advertisementRequest, owner);

        boolean existsByTitle = advertisementRepository.existsByTitle(advertisementRequest.getTitle());
        if (existsByTitle) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 제목입니다.");
        }

        return advertisementRepository.save(advertisement);
    }

    @Override
    public Advertisement findById(Long advertisementId) {
        return advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new IllegalArgumentException("광고가 존재하지 않습니다."));
    }

    @Override
    public AdvertisementResponse updateAdvertisement(AdvertisementRequest advertisementRequest) {
        Advertisement advertisement = advertisementRepository.findById(advertisementRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 광고가 존재하지 않습니다."));
        if (!advertisement.getOwner().getId().equals(advertisementRequest.getOwnerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 수정할 수 있습니다.");
        }
//

        advertisement.setUpdateValue(advertisementRequest);
        Advertisement updated = advertisementRepository.save(advertisement);
        return AdvertisementResponse.toDto(updated);
    }

    public List<AdvertisementResponse> findAllAdvertisements() {
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        return advertisementList.stream().map(AdvertisementResponse::toDto).collect(Collectors.toList());
    }
}
