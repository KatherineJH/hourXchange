package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import com.example.oauthjwt.dto.request.PaymentVerifyRequest;
import com.example.oauthjwt.dto.response.PaymentOrderResponse;
import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.dto.response.PaymentVerifyResponse;
import com.example.oauthjwt.service.IamportService;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
@Log4j2
public class PaymentController {
    private final IamportService iamportService;
    private final PaymentService paymentService;


    /** 클라이언트 콜백으로부터 imp_uid, merchant_uid 를 받아 검증 */
    @PostMapping("/iamport/transaction")
    public ResponseEntity<?> iamportTransaction(@RequestBody Map<String, String> data) {
        // 결제 정보 검증
        PaymentResponse result = iamportService.transaction(data);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/order")
    public ResponseEntity<?> order(@RequestBody PaymentOrderRequest paymentOrderRequest) {
        log.info("Order request: " + paymentOrderRequest);
        PaymentOrderResponse result = paymentService.order(paymentOrderRequest);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody PaymentVerifyRequest paymentVerifyRequest) {
        log.info("Verify request: " + paymentVerifyRequest);

        PaymentVerifyResponse result = paymentService.verify(paymentVerifyRequest);

        return ResponseEntity.ok(result);
    }
}
