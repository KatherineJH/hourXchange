package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProductService {

  ProductResponse save(ProductRequest productRequest);

  ProductResponse findById(Long id);

  ProductResponse update(ProductRequest productRequest);

  Page<ProductResponse> findAll(Pageable pageable);

  List<ProductResponse> findAllWithPosition(double lat, double lng);
}
