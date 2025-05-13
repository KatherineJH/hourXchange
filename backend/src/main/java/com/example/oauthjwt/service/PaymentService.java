package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {
    PaymentResponse save(Map payment);
}
