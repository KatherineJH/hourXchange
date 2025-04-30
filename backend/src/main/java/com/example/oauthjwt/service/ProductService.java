package com.example.oauthjwt.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.FavoriteResponse;
import com.example.oauthjwt.dto.response.ProductResponse;

public interface ProductService {

  ProductResponse save(ProductRequest productRequest);

  ProductResponse findById(Long id);

  ProductResponse update(ProductRequest productRequest);

  Page<ProductResponse> findAll(Pageable pageable);

  List<ProductResponse> findAllWithPosition(double lat, double lng);

  FavoriteResponse toggleFavorite(Long productId, Long userId);

  List<FavoriteResponse> findAllFavorite(Long userId);
}
