package com.example.oauthjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.PaymentItem;

public interface PaymentItemRepository extends JpaRepository<PaymentItem, Long> {
    Optional<PaymentItem> findByName(String name);
}
