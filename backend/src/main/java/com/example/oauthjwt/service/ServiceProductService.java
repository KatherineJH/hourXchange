package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.ServiceProductDTO;
import com.example.oauthjwt.entity.ServiceProduct;
import org.springframework.stereotype.Service;

@Service
public interface ServiceProductService {

    ServiceProductDTO save(ServiceProductDTO serviceProductDTO);
}
