package com.example.oauthjwt.repository.custom;

import com.example.oauthjwt.dto.condition.OrdersSearchCondition;
import com.example.oauthjwt.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrdersRepositoryCustom {
    Page<Orders> search(OrdersSearchCondition condition, Pageable pageable);
}
