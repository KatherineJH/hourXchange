package com.example.oauthjwt.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.OrdersSearchCondition;
import com.example.oauthjwt.entity.Orders;

public interface OrdersRepositoryCustom {
    Page<Orders> search(OrdersSearchCondition condition, Pageable pageable);
}
