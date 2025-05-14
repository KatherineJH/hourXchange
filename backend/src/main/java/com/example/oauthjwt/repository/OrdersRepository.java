package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long> {

    Optional<Orders> findByImpUidAndMerchantUid(String impUid, String merchantUid);
}
