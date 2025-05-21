package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.PaymentItemRatioResponse;
import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
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

    // ────────────────────────────────────────────────

    /** 일별 결제 금액 합계 (최근 14일) */
    @GetMapping("/daily/amount")
    public List<PaymentLogResponse> dailyAmount() {
        return paymentService.getDailyAmountSums(14);
    }

    /** 주별 결제 금액 합계 (최근 6주) */
    @GetMapping("/weekly/amount")
    public List<PaymentLogResponse> weeklyAmount() {
        return paymentService.getWeeklyAmountSums(6);
    }

    /** 월별 결제 금액 합계 (최근 6개월) */
    @GetMapping("/monthly/amount")
    public List<PaymentLogResponse> monthlyAmount() {
        return paymentService.getMonthlyAmountSums(6);
    }

    /** 연별 결제 금액 합계 (최근 5년) */
    @GetMapping("/yearly/amount")
    public List<PaymentLogResponse> yearlyAmount() {
        return paymentService.getYearlyAmountSums(5);
    }

    // ────────────────────────────────────────────────

    /** 결제 아이템별 건수 비율 (페이 차트용) */
    @GetMapping("/items/ratio")
    public List<PaymentItemRatioResponse> ratioByItem() {
        return paymentService.getPaymentRatioByItem();
    }

    /** 기간을 선택하여 데이터를 로드 */
    @GetMapping("/range")
    public List<PaymentLogResponse> getPaymentsByDateRange(
            @RequestParam("from") String fromDateStr,
            @RequestParam("to") String toDateStr) {
        return paymentService.getPaymentsBetween(fromDateStr, toDateStr);
    }
}
