package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.PaymentItemRepository;
import com.example.oauthjwt.repository.PaymentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Log4j2
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final PaymentItemRepository paymentItemRepository;
    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    @Override
    public PaymentResponse save(Map data) {
        User user = userRepository.findByEmail((String) data.get("buyer_email"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        PaymentItem paymentItem = paymentItemRepository.findByName((String) data.get("name"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품 정보가 존재하지 않습니다."));

        // 구매한 금액과 사용자의 이메일이 같은지 검사
        log.info(data);
        if(paymentItem.getPrice() != (int) data.get("amount") || !user.getEmail().equals(data.get("buyer_email"))) {
            log.info("{}:{}", paymentItem.getPrice(), data.get("amount"));
            log.info("{}:{}", user.getEmail(), data.get("buyer_email"));

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제 정보와 상품 정보가 일치하지 않습니다.");
        }

        user.addTime(paymentItem.getTime()); // 사용자의 시간 추가

        Payment payment = paymentRepository.save(Payment.of(data, user.getId(), paymentItem.getId())); // 결제 정보 저장

        return PaymentResponse.toDto(payment, user, paymentItem);
    }

    @Override
    public List<PaymentLogResponse> getDailyPaymentCounts(int daysBack) {
        LocalDate todaySeoul = LocalDate.now(SEOUL);
        LocalDate fromDate   = todaySeoul.minusDays(daysBack);
        LocalDateTime from   = fromDate.atStartOfDay();
        return paymentRepository.countByDay(from);
    }

    @Override
    public List<PaymentLogResponse> getWeeklyPaymentCounts(int weeksBack) {
        LocalDate todaySeoul = LocalDate.now(SEOUL);
        LocalDate fromDate   = todaySeoul.minusWeeks(weeksBack);
        LocalDateTime from   = fromDate.atStartOfDay();
        return paymentRepository.countByWeek(from);
    }

    @Override
    public List<PaymentLogResponse> getMonthlyPaymentCounts(int monthsBack) {
        LocalDate todaySeoul   = LocalDate.now(SEOUL);
        LocalDate firstOfMonth = todaySeoul.minusMonths(monthsBack)
                .withDayOfMonth(1);
        LocalDateTime from     = firstOfMonth.atStartOfDay();
        return paymentRepository.countByMonth(from);
    }

    @Override
    public List<PaymentLogResponse> getYearlyPaymentCounts(int yearsBack) {
        LocalDate todaySeoul = LocalDate.now(SEOUL);
        LocalDate firstOfYear = todaySeoul.minusYears(yearsBack)
                .withDayOfYear(1);
        LocalDateTime from    = firstOfYear.atStartOfDay();
        return paymentRepository.countByYear(from);
    }
}
