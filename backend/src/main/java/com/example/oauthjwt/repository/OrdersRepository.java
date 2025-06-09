package com.example.oauthjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Orders;
import com.example.oauthjwt.repository.custom.OrdersRepositoryCustom;

public interface OrdersRepository extends JpaRepository<Orders, Long>, OrdersRepositoryCustom {

    Optional<Orders> findByImpUidAndMerchantUid(String impUid, String merchantUid);
}
