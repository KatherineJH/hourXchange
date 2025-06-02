package com.example.oauthjwt.repository.custom.impl;

import com.example.oauthjwt.dto.condition.TransactionSearchCondition;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.QDonation;
import com.example.oauthjwt.entity.QTransaction;
import com.example.oauthjwt.entity.Transaction;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.entity.type.TransactionStatus;
import com.example.oauthjwt.repository.custom.TransactionRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalTime;
import java.util.List;

@RequiredArgsConstructor
public class TransactionRepositoryImpl implements TransactionRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Transaction> search(TransactionSearchCondition condition, Pageable pageable) {
        QTransaction transaction = QTransaction.transaction; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if(condition.getTransactionId() != null) {
            builder.and(transaction.id.eq(condition.getTransactionId()));
        }
        if(condition.getUserId() != null) {
            builder.and(transaction.user.id.eq(condition.getUserId()));
        }
        if(condition.getProductId() != null) {
            builder.and(transaction.product.id.eq(condition.getProductId()));
        }
        if(condition.getStatus() != null && !condition.getStatus().isBlank()) {
            builder.and(transaction.status.eq(TransactionStatus.valueOf(condition.getStatus())));
        }
        if(condition.getStartDate() != null) {
            builder.and(transaction.createdAt.goe(condition.getStartDate().atStartOfDay()));
        }
        if(condition.getEndDate() != null) {
            builder.and(transaction.createdAt.loe(condition.getEndDate().atTime(LocalTime.MAX)));
        }
        // 실제 데이터 쿼리
        List<Transaction> result = queryFactory
                .selectFrom(transaction)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        // 전체 개수 쿼리
        long total = queryFactory
                .selectFrom(transaction)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
