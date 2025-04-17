package com.example.oauthjwt.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;

@Service
public interface ServiceProductService {

  ServiceProductResponse save(ServiceProductRequest serviceProductRequest);

  Map<String, String> existsById(Long id);

  ServiceProductResponse findById(Long id);

  ServiceProductResponse update(ServiceProductUpdateRequest serviceProductUpdateRequest);
}
