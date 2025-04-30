package com.example.oauthjwt.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.AdvertisementResponse;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.repository.AdvertisementRepository;
import com.example.oauthjwt.service.AdvertisementService;
import com.example.oauthjwt.service.CustomUserDetails;

import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/api/advertisement")
@RequiredArgsConstructor
public class AdvertisementController {

  private final AdvertisementRepository advertisementRepository;
  private final AdvertisementService advertisementService;

  @PostMapping("/")
  public ResponseEntity<?> createAdvertisement(@AuthenticationPrincipal CustomUserDetails userDetails,
      @RequestBody @Valid AdvertisementRequest advertisementRequest) {
    log.info(advertisementRequest);
    // 인증한 유저의 id 값으로 할당
    advertisementRequest.setOwnerId(userDetails.getUser().getId());
    Advertisement result = advertisementService.createAdvertisement(advertisementRequest);
    Advertisement response = AdvertisementResponse.toDto(result);
    return ResponseEntity.ok(ApiResponse.success("광고가 생성되었습니다."));
  }

  @GetMapping("/all")
  public ResponseEntity<?> findAllAdvertisement(@AuthenticationPrincipal CustomUserDetails userDetails) {
    log.info("userDetails: {}", userDetails);
    List<Advertisement> responses = advertisementService.findAllAdvertisements();
    return ResponseEntity.ok(responses);
  }

  @GetMapping("/{advertisementId}")
  public ResponseEntity<?> findAdvertisementById(@PathVariable Long advertisementId,
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    try {
      Advertisement advertisement = advertisementService.findAdvertisementById(advertisementId,
          userDetails.getUser().getId());
      Advertisement response = AdvertisementResponse.toDto(advertisement);
      return ResponseEntity.ok(ApiResponse.success("광고 조회 성공"));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
    } catch (Exception e) {
      log.error("광고 조회 중 오류 발생", e);
      return ResponseEntity.internalServerError().body(ApiResponse.serverError("광고 조회 중 오류 발생"));
    }
  }

  @PutMapping("/{advertisementId}")
  public ResponseEntity<?> updateAdvertisement(@PathVariable Long advertisementId,
      @RequestBody AdvertisementRequest advertisementRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
    try {
      advertisementRequest.setId(advertisementId);
      advertisementRequest.setOwnerId(userDetails.getUser().getId());
      Advertisement result = advertisementService.updateAdvertisement(advertisementRequest);
      return ResponseEntity.ok(result);
    } catch (ValidationException e) {
      return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(ApiResponse.serverError("서버 내부에서 오류 발생"));
    }
  }
}
