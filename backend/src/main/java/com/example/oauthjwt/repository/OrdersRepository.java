package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Orders;
import com.example.oauthjwt.repository.custom.OrdersRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long>, OrdersRepositoryCustom {

    Optional<Orders> findByImpUidAndMerchantUid(String impUid, String merchantUid);
}
