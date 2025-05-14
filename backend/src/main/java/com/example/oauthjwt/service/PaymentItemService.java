package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.PaymentItemResponse;

import java.util.List;

public interface PaymentItemService {
    List<PaymentItemResponse> list();
}
