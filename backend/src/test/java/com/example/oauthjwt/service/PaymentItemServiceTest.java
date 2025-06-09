package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.PaymentItemResponse;
import com.example.oauthjwt.entity.PaymentItem;
import com.example.oauthjwt.repository.PaymentItemRepository;
import com.example.oauthjwt.service.impl.PaymentItemServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentItemServiceTest {

    @Mock
    private PaymentItemRepository paymentItemRepository;

    @InjectMocks
    private PaymentItemServiceImpl paymentItemService;

    @Test
    @DisplayName("list: repository.findAll() 결과를 DTO 리스트로 변환하여 반환")
    void list_ReturnsDtoList() {
        // given
        PaymentItem item1 = PaymentItem.builder()
                .id(1L)
                .name("ItemA")
                .time(10)
                .price(1000)
                .build();
        PaymentItem item2 = PaymentItem.builder()
                .id(2L)
                .name("ItemB")
                .time(20)
                .price(2000)
                .build();
        given(paymentItemRepository.findAll()).willReturn(List.of(item1, item2));

        // when
        List<PaymentItemResponse> result = paymentItemService.list();

        // then
        assertThat(result).hasSize(2);
        assertThat(result).extracting(PaymentItemResponse::getId)
                .containsExactly(1L, 2L);
        assertThat(result).extracting(PaymentItemResponse::getName)
                .containsExactly("ItemA", "ItemB");
        assertThat(result).extracting(PaymentItemResponse::getTime)
                .containsExactly(10, 20);
        assertThat(result).extracting(PaymentItemResponse::getPrice)
                .containsExactly(1000, 2000);
        then(paymentItemRepository).should().findAll();
    }
}
