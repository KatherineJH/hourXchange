package com.example.oauthjwt.service;

import java.util.List;

import com.example.oauthjwt.dto.response.PaymentItemResponse;

public interface PaymentItemService {
    List<PaymentItemResponse> list();
}
