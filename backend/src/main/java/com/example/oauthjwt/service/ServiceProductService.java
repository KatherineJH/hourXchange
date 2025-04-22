package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;


public interface ServiceProductService {

  ServiceProductResponse save(ServiceProductRequest serviceProductRequest);

  ServiceProductResponse findById(Long id);

  ServiceProductResponse update(ServiceProductRequest serviceProductRequest);

  List<ServiceProductResponse> findAll();
}
