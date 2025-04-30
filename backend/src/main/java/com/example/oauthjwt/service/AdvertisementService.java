package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import com.example.oauthjwt.entity.Advertisement;

public interface AdvertisementService {

    Advertisement createAdvertisement(AdvertisementRequest advertisementRequest);

    Advertisement findAdvertisementById(Long advertisementId, Long ownerId);

    Advertisement updateAdvertisement(AdvertisementRequest advertisementRequest);

    List<Advertisement> findAllAdvertisements();
}
