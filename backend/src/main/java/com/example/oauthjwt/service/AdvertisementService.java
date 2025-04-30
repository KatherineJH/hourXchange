package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.entity.Advertisement;

import java.util.List;
import java.util.Map;

public interface AdvertisementService {

    Advertisement createAdvertisement(AdvertisementRequest advertisementRequest);

    Advertisement findAdvertisementById(Long advertisementId, Long ownerId);

    Advertisement updateAdvertisement(AdvertisementRequest advertisementRequest);

    List<Advertisement> findAllAdvertisements();
}
