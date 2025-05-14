package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.PaymentItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentItemRepository extends JpaRepository<PaymentItem, Long> {
    Optional<PaymentItem> findByName(String name);
}
