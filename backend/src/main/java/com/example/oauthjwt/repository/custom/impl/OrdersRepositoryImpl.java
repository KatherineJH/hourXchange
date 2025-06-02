package com.example.oauthjwt.repository.custom.impl;

import com.example.oauthjwt.dto.condition.OrdersSearchCondition;
import com.example.oauthjwt.entity.Orders;
import com.example.oauthjwt.entity.QOrders;
import com.example.oauthjwt.entity.QTransaction;
import com.example.oauthjwt.entity.Transaction;
import com.example.oauthjwt.entity.type.TransactionStatus;
import com.example.oauthjwt.repository.custom.OrdersRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalTime;
import java.util.List;

@RequiredArgsConstructor
public class OrdersRepositoryImpl implements OrdersRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Orders> search(OrdersSearchCondition condition, Pageable pageable) {
        QOrders orders = QOrders.orders; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if(condition.getOrdersId() != null) {
            builder.and(orders.id.eq(condition.getOrdersId()));
        }
        if(condition.getImpUid() != null && !condition.getImpUid().isEmpty()) {
            builder.and(orders.impUid.containsIgnoreCase(condition.getImpUid()));
        }
        if(condition.getMerchantUid() != null && !condition.getMerchantUid().isEmpty()) {
            builder.and(orders.merchantUid.containsIgnoreCase(condition.getMerchantUid()));
        }
        if(condition.getEmail() != null && !condition.getEmail().isEmpty()) {
            builder.and(orders.email.containsIgnoreCase(condition.getEmail()));
        }
        if(condition.getPaymentItemName() != null && !condition.getPaymentItemName().isEmpty()) {
            builder.and(orders.paymentItemName.containsIgnoreCase(condition.getPaymentItemName()));
        }
        if(condition.getStartDate() != null) {
            builder.and(orders.createdAt.goe(condition.getStartDate().atStartOfDay()));
        }
        if(condition.getEndDate() != null) {
            builder.and(orders.createdAt.loe(condition.getEndDate().atTime(LocalTime.MAX)));
        }
        // 실제 데이터 쿼리
        List<Orders> result = queryFactory
                .selectFrom(orders)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        // 전체 개수 쿼리
        long total = queryFactory
                .selectFrom(orders)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
