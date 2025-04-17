package com.example.oauthjwt.service;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.ServiceProductDTO;

@Service
public interface ServiceProductService {

  ServiceProductDTO save(ServiceProductDTO serviceProductDTO);
}
