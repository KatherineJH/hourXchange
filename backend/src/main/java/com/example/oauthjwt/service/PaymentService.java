package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.PaymentItemRatioResponse;
import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.dto.response.PaymentResponse;

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
}
