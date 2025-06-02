package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.PaymentItemRatioResponse;
import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentLogController {
    private final PaymentService paymentService;

    /** 일별 결제 건수 (최근 14일) */
    @GetMapping("/daily")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> daily() {
        return ResponseEntity.ok(paymentService.getDailyPaymentCounts(14));
    }

    /** 주별 결제 건수 (최근 6주) */
    @GetMapping("/weekly")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> weekly() {
        return ResponseEntity.ok(paymentService.getWeeklyPaymentCounts(6));
    }

    /** 월별 결제 건수 (최근 6개월) */
    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> monthly() {
        return ResponseEntity.ok(paymentService.getMonthlyPaymentCounts(6));
    }

    /** 연별 결제 건수 (최근 5년) */
    @GetMapping("/yearly")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> yearly() {
        return ResponseEntity.ok(paymentService.getYearlyPaymentCounts(5));
    }

    // ────────────────────────────────────────────────

    /** 일별 결제 금액 합계 (최근 14일) */
    @GetMapping("/daily/amount")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> dailyAmount() {
        return ResponseEntity.ok(paymentService.getDailyAmountSums(14));
    }

    /** 주별 결제 금액 합계 (최근 6주) */
    @GetMapping("/weekly/amount")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> weeklyAmount() {
        return ResponseEntity.ok(paymentService.getWeeklyAmountSums(6));
    }

    /** 월별 결제 금액 합계 (최근 6개월) */
    @GetMapping("/monthly/amount")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> monthlyAmount() {
        return ResponseEntity.ok(paymentService.getMonthlyAmountSums(6));
    }

    /** 연별 결제 금액 합계 (최근 5년) */
    @GetMapping("/yearly/amount")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentLogResponse>> yearlyAmount() {
        return ResponseEntity.ok(paymentService.getYearlyAmountSums(5));
    }

    // ────────────────────────────────────────────────

    /** 결제 아이템별 건수 비율 (페이 차트용) */
    @GetMapping("/items/ratio")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaymentItemRatioResponse>> ratioByItem() {
        return ResponseEntity.ok(paymentService.getPaymentRatioByItem());
    }

    /** 기간을 선택하여 데이터를 로드 */
    @GetMapping("/range")
    public ResponseEntity<List<PaymentLogResponse>> getPaymentsByDateRange(
            @RequestParam("from") String fromDateStr,
            @RequestParam("to") String toDateStr) {
        return ResponseEntity.ok(paymentService.getPaymentsBetween(fromDateStr, toDateStr));
    }
    @GetMapping("/range/amount")
    public ResponseEntity<List<PaymentLogResponse>> getAmountSumByRange(
            @RequestParam("from") String from,
            @RequestParam("to") String to) {
        return ResponseEntity.ok(paymentService.getAmountSumBetween(from, to));
    }
}
