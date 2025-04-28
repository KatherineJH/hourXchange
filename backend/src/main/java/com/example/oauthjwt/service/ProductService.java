package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.ProductResponse;


public interface ProductService {

  ProductResponse save(ProductRequest productRequest);

  ProductResponse findById(Long id);

  ProductResponse update(ProductRequest productRequest);

  List<ProductResponse> findAll();
}
