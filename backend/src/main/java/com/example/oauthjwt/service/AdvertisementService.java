package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.dto.response.AdvertisementResponse;
import com.example.oauthjwt.entity.Advertisement;

public interface AdvertisementService {

    Advertisement createAdvertisement(AdvertisementRequest advertisementRequest);

    Advertisement findById(Long advertisementId);

    AdvertisementResponse updateAdvertisement(AdvertisementRequest advertisementRequest);

    List<AdvertisementResponse> findAllAdvertisements();
}
