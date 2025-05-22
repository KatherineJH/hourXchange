// src/main/java/com/example/oauthjwt/service/impl/PaymentServiceImpl.java
package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.PaymentOrderRequest;
import com.example.oauthjwt.dto.request.PaymentVerifyRequest;
import com.example.oauthjwt.dto.response.*;
import com.example.oauthjwt.entity.Orders;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.repository.OrdersRepository;
import com.example.oauthjwt.repository.PaymentItemRepository;
import com.example.oauthjwt.repository.PaymentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.PaymentService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PaymentItemRepository paymentItemRepository;
    private final OrdersRepository ordersRepository;
    private final JWTUtil jwtUtil;
    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    @Override
    public PaymentResponse save(Map data) {
        User user = userRepository.findByEmail((String) data.get("buyer_email"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        PaymentItem paymentItem = paymentItemRepository.findByName((String) data.get("name"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품 정보가 존재하지 않습니다."));

        // 구매한 금액과 사용자의 이메일이 같은지 검사
        if (paymentItem.getPrice() != (int) data.get("amount")
                || !user.getEmail().equals(data.get("buyer_email"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제 정보와 상품 정보가 일치하지 않습니다.");
        }

        user.addCredit(paymentItem.getTime()); // 사용자의 시간 추가

        Payment payment = paymentRepository.save(Payment.of(data, user.getId(), paymentItem.getId()));
        return PaymentResponse.toDto(payment, user, paymentItem);
    }

    @Override
    public PaymentOrderResponse order(PaymentOrderRequest paymentOrderRequest) {
        String impUid = "order_" + UUID.randomUUID();
        Orders orders = Orders.of(paymentOrderRequest, impUid, paymentOrderRequest.getMerchantUid());
        PaymentOrderResponse paymentOrderResponse = PaymentOrderResponse.toDto(ordersRepository.save(orders));

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", paymentOrderResponse.getId());
        claims.put("impUid", impUid); // 결제 서버에서 만들어 주는 id
        claims.put("merchantUid", paymentOrderRequest.getMerchantUid()); // 서버로 보내온 값
        claims.put("email", paymentOrderResponse.getEmail());
        claims.put("paymentItemName", paymentOrderResponse.getPaymentItemName());
        claims.put("paymentItemPrice", paymentOrderResponse.getPaymentItemPrice());

        paymentOrderResponse.setOrderToken(jwtUtil.createToken(claims, 300000)); // 5분

        return paymentOrderResponse;
    }

    @Override
    public PaymentVerifyResponse verify(PaymentVerifyRequest paymentVerifyRequest) {
        // 주문 시 발급 받은 토큰 검증 및 내용 반환
        Claims claims = jwtUtil.getClaims(paymentVerifyRequest.getOrderToken());

        // 토큰이 정상이라면 해당 merchantUid를 사용해 주문 내역 조회
        Orders orders = ordersRepository.findByImpUidAndMerchantUid((claims.get("impUid", String.class)), claims.get("merchantUid", String.class))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제 정보가 존재하지 않습니다."));

        // 토큰으로 조회한 주문 내역과 토큰의 내용이 다르면
        if(!orders.getImpUid().equals(claims.get("impUid", String.class)) ||
                !orders.getEmail().equals(claims.get("email", String.class)) ||
                !orders.getPaymentItemName().equals(claims.get("paymentItemName", String.class)) ||
                !orders.getPaymentItemPrice().equals(claims.get("paymentItemPrice", String.class))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제 정보와 주문 내역이 일치하지 않습니다.");
        }

        User user = userRepository.findByEmail(orders.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        PaymentItem paymentItem = paymentItemRepository.findByName(orders.getPaymentItemName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품 정보가 존재하지 않습니다."));


        user.addCredit(paymentItem.getTime()); // 시간 추가

        Payment payment = paymentRepository.save(Payment.of(orders, user, paymentItem));

        return PaymentVerifyResponse.toDto(orders, user, payment, paymentItem);
    }


    /*--- 기존 countByXXX (건수) ---*/
    @Override
    public List<PaymentLogResponse> getDailyPaymentCounts(int daysBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusDays(daysBack).atStartOfDay();
        return paymentRepository.countByDay(from);
    }

    @Override
    public List<PaymentLogResponse> getWeeklyPaymentCounts(int weeksBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusWeeks(weeksBack).atStartOfDay();
        return paymentRepository.countByWeek(from);
    }

    @Override
    public List<PaymentLogResponse> getMonthlyPaymentCounts(int monthsBack) {
        LocalDate firstOfMonth = LocalDate.now(SEOUL).minusMonths(monthsBack).withDayOfMonth(1);
        return paymentRepository.countByMonth(firstOfMonth.atStartOfDay());
    }

    @Override
    public List<PaymentLogResponse> getYearlyPaymentCounts(int yearsBack) {
        LocalDate firstOfYear = LocalDate.now(SEOUL).minusYears(yearsBack).withDayOfYear(1);
        return paymentRepository.countByYear(firstOfYear.atStartOfDay());
    }

    /*--- 추가: 금액 합계 ---*/
    @Override
    public List<PaymentLogResponse> getDailyAmountSums(int daysBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusDays(daysBack).atStartOfDay();
        return paymentRepository.sumAmountByDay(from);
    }

    @Override
    public List<PaymentLogResponse> getWeeklyAmountSums(int weeksBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusWeeks(weeksBack).atStartOfDay();
        return paymentRepository.sumAmountByWeek(from);
    }

    @Override
    public List<PaymentLogResponse> getMonthlyAmountSums(int monthsBack) {
        LocalDate firstOfMonth = LocalDate.now(SEOUL).minusMonths(monthsBack).withDayOfMonth(1);
        return paymentRepository.sumAmountByMonth(firstOfMonth.atStartOfDay());
    }

    @Override
    public List<PaymentLogResponse> getYearlyAmountSums(int yearsBack) {
        LocalDate firstOfYear = LocalDate.now(SEOUL).minusYears(yearsBack).withDayOfYear(1);
        return paymentRepository.sumAmountByYear(firstOfYear.atStartOfDay());
    }

    /*--- 추가: 아이템별 비율 ---*/
    @Override
    public List<PaymentItemRatioResponse> getPaymentRatioByItem() {
        return paymentRepository.ratioByItem();
    }

    @Override
    public List<PaymentLogResponse> getPaymentsBetween(String from, String to) {
        try {
            LocalDateTime fromDate = LocalDate.parse(from).atStartOfDay();
            LocalDateTime toDate = LocalDate.parse(to).plusDays(1).atStartOfDay(); // 포함 처리

            return paymentRepository.countByRange(fromDate, toDate);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 날짜 형식입니다. yyyy-MM-dd 형식이어야 합니다.");
        }
    }
    @Override
    public List<PaymentLogResponse> getAmountSumBetween(String from, String to) {
        try {
            LocalDateTime fromDate = LocalDate.parse(from).atStartOfDay();
            LocalDateTime toDate = LocalDate.parse(to).plusDays(1).atStartOfDay();
            return paymentRepository.sumAmountByRange(fromDate, toDate);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "날짜 형식이 잘못되었습니다.");
        }
    }
}
