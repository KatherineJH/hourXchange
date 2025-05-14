package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.response.PaymentItemResponse;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.repository.PaymentItemRepository;
import com.example.oauthjwt.service.PaymentItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentItemServiceImpl implements PaymentItemService {
    private final PaymentItemRepository paymentItemRepository;

    @Override
    public List<PaymentItemResponse> list() {
        List<PaymentItem> paymentItemList = paymentItemRepository.findAll();

        return paymentItemList.stream().map(PaymentItemResponse::toDto).collect(Collectors.toList());
    }
}
