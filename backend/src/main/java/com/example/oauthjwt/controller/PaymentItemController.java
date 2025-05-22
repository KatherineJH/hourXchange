package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.PaymentItemResponse;
import com.example.oauthjwt.service.PaymentItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/paymentItem")
public class PaymentItemController {
    private final PaymentItemService paymentItemService;

    @GetMapping("list")
    public ResponseEntity<?> list() {
        List<PaymentItemResponse> result = paymentItemService.list();
        return ResponseEntity.ok(result);
    }
}
