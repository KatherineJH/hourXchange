package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.service.IamportService;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/pay/iamport")
@RequiredArgsConstructor
@Log4j2
public class PaymentController {
    private final IamportService iamportService;
    private final PaymentService paymentService;

    /** 클라이언트 콜백으로부터 imp_uid, merchant_uid 를 받아 검증 */
    @PostMapping("/transaction")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> data) {
        // 결제 정보 검증
        PaymentResponse result = iamportService.transaction(data);

        return ResponseEntity.ok(result);
    }
}
