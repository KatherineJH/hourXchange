package com.example.oauthjwt.repository.custom;

import com.example.oauthjwt.dto.condition.PaymentSearchCondition;
import com.example.oauthjwt.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentRepositoryCustom {
    Page<Payment> search(PaymentSearchCondition condition, Pageable pageable);
}
