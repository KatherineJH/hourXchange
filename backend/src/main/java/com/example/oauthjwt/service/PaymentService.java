package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import com.example.oauthjwt.dto.request.PaymentVerifyRequest;
import com.example.oauthjwt.dto.response.*;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    PaymentResponse save(Map payment);
    List<PaymentLogResponse> getDailyPaymentCounts(int daysBack);
    List<PaymentLogResponse> getWeeklyPaymentCounts(int weeksBack);
    List<PaymentLogResponse> getMonthlyPaymentCounts(int monthsBack);
    List<PaymentLogResponse> getYearlyPaymentCounts(int yearsBack);

    List<PaymentLogResponse> getDailyAmountSums(int daysBack);
    List<PaymentLogResponse> getWeeklyAmountSums(int weeksBack);
    List<PaymentLogResponse> getMonthlyAmountSums(int monthsBack);
    List<PaymentLogResponse> getYearlyAmountSums(int yearsBack);

    List<PaymentItemRatioResponse> getPaymentRatioByItem();

    PaymentOrderResponse order(PaymentOrderRequest paymentOrderRequest);

    PaymentVerifyResponse verify(PaymentVerifyRequest paymentVerifyRequest);

    List<PaymentLogResponse> getPaymentsBetween(String from, String to);
}
