package com.example.oauthjwt.controller;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.AdvertisementResponse;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.service.AdvertisementService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@Log4j2
@RequestMapping("/api/advertisement")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;
    private final LocationUtil locationUtil;

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> createAdvertisement(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid AdvertisementRequest advertisementRequest) {
        AdvertisementResponse response = advertisementService.createAdvertisement(advertisementRequest, userDetails);
        return ResponseEntity.created(locationUtil.createdLocation(response.getId())).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAllAdvertisement(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AdvertisementResponse> responses = advertisementService.findAllAdvertisements(PageRequest.of(page, size));
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    public ResponseEntity<?> findMyAds(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<AdvertisementResponse> responses = advertisementService.findMyAdvertisements(userDetails,
                PageRequest.of(page, size));
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/{advertisementId}")
    public ResponseEntity<?> findById(@PathVariable Long advertisementId) {

        AdvertisementResponse response = advertisementService.findAdvertisementDetail(advertisementId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{advertisementId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateAdvertisement(@PathVariable Long advertisementId,
            @RequestBody @Valid AdvertisementRequest advertisementRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        AdvertisementResponse response = advertisementService.updateAdvertisement(advertisementId, advertisementRequest,
                userDetails);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{advertisementId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void deleteAdvertisement(@PathVariable Long advertisementId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        advertisementService.deleteAdvertisement(advertisementId, userDetails);
    }

    //광고 시청 후 트레딧 지급
    @PostMapping("/{advertisementId}/watch")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> watchAdvertisement(@PathVariable Long advertisementId,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        AdvertisementResponse response = advertisementService.watchAdvertisement(advertisementId,userDetails);

        return ResponseEntity.ok(response);
    }

}
