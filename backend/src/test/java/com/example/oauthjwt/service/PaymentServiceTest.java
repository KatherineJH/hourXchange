package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.repository.OrdersRepository;
import com.example.oauthjwt.repository.PaymentItemRepository;
import com.example.oauthjwt.repository.PaymentRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private UserRepository userRepository;
    @Mock private PaymentItemRepository paymentItemRepository;
    @Mock private OrdersRepository ordersRepository;
    @Mock private JWTUtil jwtUtil;

    // 실제 구현체를 주입해야 Mockito의 @InjectMocks가 작동합니다.
    @InjectMocks private PaymentServiceImpl paymentService;

    private Map<String,Object> makeSaveData() {
        Map<String,Object> data = new HashMap<>();
        data.put("buyer_email", "a@b.com");
        data.put("name", "ItemX");
        data.put("amount", 500);
        return data;
    }

    @Test @DisplayName("save: 정상 저장 및 DTO 반환")
    void save_Success() {
        Map<String,Object> data = makeSaveData();

        // 1) 유저 조회 목업
        User u = new User();
        u.setEmail("a@b.com");
        u.setId(1L);
        given(userRepository.findByEmail("a@b.com")).willReturn(Optional.of(u));

        // 2) 상품 조회 목업
        PaymentItem pi = new PaymentItem();
        pi.setName("ItemX");
        pi.setPrice(500);
        pi.setTime(30);
        pi.setId(2L);
        given(paymentItemRepository.findByName("ItemX")).willReturn(Optional.of(pi));

        // 3) 저장 시 ID를 세팅하도록 목업
        given(paymentRepository.save(any(Payment.class)))
                .willAnswer(inv -> {
                    Payment p = inv.getArgument(0);
                    p.setId(10L);
                    return p;
                });

        // when
        PaymentResponse res = paymentService.save(data);

        // then
        assertThat(res.getId()).isEqualTo(10L);
        // PaymentResponse.user.user.email 필드 검증
        assertThat(res.getUser().getEmail()).isEqualTo("a@b.com");
        // PaymentResponse.paymentItem.name 필드 검증
        assertThat(res.getPaymentItem().getName()).isEqualTo("ItemX");
        then(userRepository).should().findByEmail("a@b.com");
    }

    @Test @DisplayName("save: 유저 없음 예외")
    void save_UserNotFound() {
        Map<String,Object> data = makeSaveData();
        given(userRepository.findByEmail(anyString())).willReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.save(data))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    // getStatusCode()로 검사해야 합니다.
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }
}
