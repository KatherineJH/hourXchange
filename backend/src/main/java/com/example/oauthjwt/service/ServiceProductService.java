package com.example.oauthjwt.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.ServiceProductReqDTO;
import com.example.oauthjwt.dto.ServiceProductResDTO;

@Service
public interface ServiceProductService {

  ServiceProductResDTO save(ServiceProductReqDTO serviceProductReqDTO);

  Map<String, String> existsById(Long id);
}
