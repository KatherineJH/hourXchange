package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.AdvertisementRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.AdvertisementService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdvertisementServiceImpl implements AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final UserRepository userRepository;


    public Map<String, String> existsById(Long id) {
        if(!advertisementRepository.existsById(id)) {
            return Map.of("error", "광고를 찾을 수 없습니다.");
        }
        return Collections.emptyMap();
    }

    @Override
    public Advertisement createAdvertisement(AdvertisementRequest advertisementRequest) {
            User owner = userRepository.findById(advertisementRequest.getOwnerId())
                    .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다."));
            Advertisement advertisement =advertisementRepository.find

    }

   public Advertisement findAdvertisementById(Long advertisementId, Long ownerId) {
        Optional<Advertisement> advertisement = advertisementRepository.findById(advertisementId);
        if(advertisement.isEmpty()) {
            throw  new IllegalArgumentException("존재하지 않는 광고입니다.");
        }

        Advertisement advertisement1 =advertisement.get();
        if(!advertisement1.getOwner().getId().equals(ownerId)) {
            throw  new IllegalArgumentException("해당 광고에 대한 권한이 없습니다");
        }
        return advertisement1;
   }

    public List<Advertisement> findAllAdvertisements() {
        return advertisementRepository.findAll();
    }

    public Advertisement updateAdvertisement() {

    }
}
