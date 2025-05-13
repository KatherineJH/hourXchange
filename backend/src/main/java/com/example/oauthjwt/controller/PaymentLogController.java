package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentLogController {
    private final PaymentService paymentService;

    /** 일별 결제 건수 (최근 14일) */
    @GetMapping("/daily")
    public List<PaymentLogResponse> daily() {
        return paymentService.getDailyPaymentCounts(14);
    }

    /** 주별 결제 건수 (최근 6주) */
    @GetMapping("/weekly")
    public List<PaymentLogResponse> weekly() {
        return paymentService.getWeeklyPaymentCounts(6);
    }

    /** 월별 결제 건수 (최근 6개월) */
    @GetMapping("/monthly")
    public List<PaymentLogResponse> monthly() {
        return paymentService.getMonthlyPaymentCounts(6);
    }

    /** 연별 결제 건수 (최근 5년) */
    @GetMapping("/yearly")
    public List<PaymentLogResponse> yearly() {
        return paymentService.getYearlyPaymentCounts(5);
    }
}
