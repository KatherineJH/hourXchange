package com.example.oauthjwt.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.FavoriteResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.service.impl.CustomUserDetails;

public interface ProductService {

    ProductResponse save(ProductRequest productRequest, CustomUserDetails userDetails);

    ProductResponse findById(Long id, String userKey);

    ProductResponse update(ProductRequest productRequest, CustomUserDetails userDetails, Long productId);

    PageResult<ProductResponse> findAll(int page, int size);

    Page<ProductResponse> getFilteredList(int page, int size, ProviderType providerType);

    List<ProductResponse> findAllWithPosition(double swLat, double swLng, double neLat, double neLng);

    FavoriteResponse toggleFavorite(Long productId, Long userId);

    List<FavoriteResponse> findAllFavorite(Long userId);

    Page<ProductResponse> findByOwnerId(Long ownerId, Pageable pageable);

    ProductResponse delete(CustomUserDetails userDetails, Long productId);
}
