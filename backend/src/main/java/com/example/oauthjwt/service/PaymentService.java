package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.OrdersSearchCondition;
import com.example.oauthjwt.dto.condition.PaymentSearchCondition;
import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import com.example.oauthjwt.dto.request.PaymentVerifyRequest;
import com.example.oauthjwt.dto.response.*;

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

    List<PaymentLogResponse> getAmountSumBetween(String from, String to);

    Page<PaymentOrderResponse> orderList(Pageable pageable);

    Page<PaymentResponse> paymentList(Pageable pageable);

    Page<PaymentOrderResponse> orderSearch(Pageable pageable, OrdersSearchCondition ordersSearchCondition);

    Page<PaymentResponse> paymentSearch(Pageable pageable, PaymentSearchCondition paymentSearchCondition);
}
