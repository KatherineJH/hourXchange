package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.PaymentRepository;
import com.example.oauthjwt.repository.TransactionRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.repository.VisitLogRepository;
import com.example.oauthjwt.service.UserGradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserGradeServiceImpl implements UserGradeService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.flask}/user-grade/predict")
    private String flaskUrl;

    private final UserRepository userRepository;
    private final VisitLogRepository visitLogRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Map<String, Object> predictUserGrade(Map<String, Object> userInfo) {
        Long userId = Long.parseLong(userInfo.get("userId").toString());

        LocalDateTime signupDate = userRepository.findCreatedAtById(userId);
        String regionFull = userRepository.findRegionByUserId(userId);
        String region = extractRegion(regionFull);

        int transactionCount = transactionRepository.countCompletedTransactions(userId);
        int paymentCount = paymentRepository.countPaymentsByUserId(userId);
        Integer totalAmount = paymentRepository.sumPaymentsByUserId(userId);
        if (totalAmount == null) totalAmount = 0;

        LocalDateTime lastVisit = visitLogRepository.findLastVisitTime(userId);
        long daysSinceLastActivity = Duration.between(lastVisit, LocalDateTime.now()).toDays();

        Map<String, Object> features = Map.of(
                "signup_date", signupDate.toLocalDate().toString(),
                "region", region,
                "transaction_count", transactionCount,
                "payment_count", paymentCount,
                "total_payment_amount", totalAmount,
                "days_since_last_activity", daysSinceLastActivity
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(features, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, entity, Map.class);
        return response.getBody();
    }

    private String extractRegion(String address) {
        if (address == null || address.isBlank()) return "기타";
        String[] parts = address.trim().split(" ");
        return parts.length > 0 ? parts[0] : "기타"; // "경기 성남시..." → "경기"
    }

    @Override
    public Map<String, Object> predictUserGradeById(Long userId) {
        return predictUserGrade(Map.of("userId", userId));
    }

    @Override
    public List<Map<String, Object>> predictAllUserGrades() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .<Map<String, Object>>map(user -> {
                    try {
                        return predictUserGradeById(user.getId());
                    } catch (Exception e) {
                        return Map.of(
                                "userId", user.getId(),
                                "error", e.getMessage()
                        );
                    }
                })
                .collect(Collectors.toList());
    }
}
