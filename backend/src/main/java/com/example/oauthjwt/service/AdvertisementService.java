package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.AdvertisementResponse;
import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdvertisementService {

    Advertisement createAdvertisement(AdvertisementRequest advertisementRequest, CustomUserDetails userDetails);

    AdvertisementResponse findAdvertisementDetail(Long advertisementId);

    AdvertisementResponse updateAdvertisement(Long advertisementId, AdvertisementRequest advertisementRequest, CustomUserDetails userDetails);

    Page<AdvertisementResponse> findAllAdvertisements(Pageable pageable);

    AdvertisementResponse deleteAdvertisement(Long advertisementId,CustomUserDetails userDetails);

    Page<AdvertisementResponse> findMyAdvertisements(CustomUserDetails userDetails, Pageable pageable);
}
