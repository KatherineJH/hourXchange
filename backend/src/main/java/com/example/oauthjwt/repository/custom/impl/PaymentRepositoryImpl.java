package com.example.oauthjwt.repository.custom.impl;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.PaymentSearchCondition;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.entity.QPayment;
import com.example.oauthjwt.repository.custom.PaymentRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PaymentRepositoryImpl implements PaymentRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Payment> search(PaymentSearchCondition condition, Pageable pageable) {
        QPayment payment = QPayment.payment; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if (condition.getPaymentId() != null) {
            builder.and(payment.id.eq(condition.getPaymentId()));
        }
        if (condition.getUserId() != null) {
            builder.and(payment.userId.eq(condition.getUserId()));
        }
        if (condition.getPaymentItemId() != null) {
            builder.and(payment.paymentItemId.eq(condition.getPaymentItemId()));
        }
        if (condition.getImpUid() != null && !condition.getImpUid().isEmpty()) {
            builder.and(payment.impUid.containsIgnoreCase(condition.getImpUid()));
        }
        if (condition.getMerchantUid() != null && !condition.getMerchantUid().isEmpty()) {
            builder.and(payment.merchantUid.containsIgnoreCase(condition.getMerchantUid()));
        }
        if (condition.getStatus() != null && !condition.getStatus().isEmpty()) {
            builder.and(payment.status.eq(condition.getStatus()));
        }
        if (condition.getPayMethod() != null && !condition.getPayMethod().isEmpty()) {
            builder.and(payment.payMethod.containsIgnoreCase(condition.getPayMethod()));
        }
        if (condition.getPgProvider() != null && !condition.getPgProvider().isEmpty()) {
            builder.and(payment.pgProvider.containsIgnoreCase(condition.getPgProvider()));
        }
        if (condition.getPgTid() != null && !condition.getPgTid().isEmpty()) {
            builder.and(payment.pgTid.containsIgnoreCase(condition.getPgTid()));
        }
        if (condition.getReceiptUrl() != null && !condition.getReceiptUrl().isEmpty()) {
            builder.and(payment.receiptUrl.containsIgnoreCase(condition.getReceiptUrl()));
        }

        if (condition.getStartDate() != null) {
            builder.and(payment.paidAt.goe(condition.getStartDate().atStartOfDay()));
        }
        if (condition.getEndDate() != null) {
            builder.and(payment.paidAt.loe(condition.getEndDate().atTime(LocalTime.MAX)));
        }
        // 실제 데이터 쿼리
        List<Payment> result = queryFactory.selectFrom(payment).where(builder).offset(pageable.getOffset())
                .limit(pageable.getPageSize()).fetch();
        // 전체 개수 쿼리
        long total = queryFactory.selectFrom(payment).where(builder).fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
