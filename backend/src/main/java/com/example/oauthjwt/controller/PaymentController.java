package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.condition.OrdersSearchCondition;
import com.example.oauthjwt.dto.condition.PaymentSearchCondition;
import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import com.example.oauthjwt.dto.request.PaymentVerifyRequest;
import com.example.oauthjwt.dto.response.PaymentOrderResponse;
import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.dto.response.PaymentVerifyResponse;
import com.example.oauthjwt.service.impl.IamportService;
import com.example.oauthjwt.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaymentResponse> iamportTransaction(@RequestBody Map<String, String> data) {
        // 결제 정보 검증
        PaymentResponse result = iamportService.transaction(data);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/order")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<PaymentOrderResponse> order(@RequestBody @Valid PaymentOrderRequest paymentOrderRequest) {
        log.info("Order request: " + paymentOrderRequest);
        PaymentOrderResponse result = paymentService.order(paymentOrderRequest);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<PaymentVerifyResponse> verify(@RequestBody @Valid PaymentVerifyRequest paymentVerifyRequest) {
        log.info("Verify request: " + paymentVerifyRequest);

        PaymentVerifyResponse result = paymentService.verify(paymentVerifyRequest);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/order/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<PaymentOrderResponse>> orderList(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<PaymentOrderResponse> result = paymentService.orderList(pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/order/search/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<PaymentOrderResponse>> orderSearch(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @ModelAttribute OrdersSearchCondition ordersSearchCondition) {
        log.info(ordersSearchCondition);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬

        Page<PaymentOrderResponse> result = paymentService.orderSearch(pageable, ordersSearchCondition);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/payment/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> paymentList(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("paidAt").descending()); // 최신순 정렬

        Page<PaymentResponse> result = paymentService.paymentList(pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/payment/search/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> paymentSearch(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                               @ModelAttribute PaymentSearchCondition paymentSearchCondition) {
        log.info(paymentSearchCondition);
        Pageable pageable = PageRequest.of(page, size, Sort.by("paidAt").descending()); // 최신순 정렬

        Page<PaymentResponse> result = paymentService.paymentSearch(pageable, paymentSearchCondition);

        return ResponseEntity.ok(result);
    }
}
