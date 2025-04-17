package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.ServiceProductReqDTO;
import com.example.oauthjwt.dto.ServiceProductResDTO;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface ServiceProductService {

    ServiceProductResDTO save(ServiceProductReqDTO serviceProductReqDTO);


    Map<String, String> existsById(Long id);

}
