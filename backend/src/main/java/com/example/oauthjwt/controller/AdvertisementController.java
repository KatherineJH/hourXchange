package com.example.oauthjwt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.response.AdvertisementResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.service.AdvertisementService;
import com.example.oauthjwt.service.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@Log4j2
@RequestMapping("/api/advertisement")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @PostMapping("/")
    public ResponseEntity<?> createAdvertisement(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid AdvertisementRequest advertisementRequest) {
        log.info(advertisementRequest);
        // 인증한 유저의 id 값으로 할당

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        advertisementRequest.setOwnerId(userDetails.getUser().getId());

        log.info(advertisementRequest.toString());
        Advertisement ad = advertisementService.createAdvertisement(advertisementRequest);
        AdvertisementResponse response = AdvertisementResponse.toDto(ad);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?>  findAllAdvertisement() {
        List<AdvertisementResponse> responses = advertisementService.findAllAdvertisements();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{advertisementId}")
    public ResponseEntity<?> findById(@PathVariable Long advertisementId) {
        Advertisement ad = advertisementService.findById(advertisementId);
        AdvertisementResponse response = AdvertisementResponse.toDto(ad);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{advertisementId}")
    public ResponseEntity<?> updateAdvertisement(@PathVariable Long advertisementId,
                                                 @RequestBody @Valid AdvertisementRequest advertisementRequest,
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        advertisementRequest.setId(advertisementId);

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        advertisementRequest.setOwnerId(userDetails.getUser().getId());
        AdvertisementResponse response = advertisementService.updateAdvertisement(advertisementRequest);
        return ResponseEntity.ok("광고 수정 성공");
    }
}
