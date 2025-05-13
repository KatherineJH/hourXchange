package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
