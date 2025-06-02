package com.example.oauthjwt.repository.custom.impl;


import com.example.oauthjwt.dto.condition.DonationHistorySearchCondition;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.QDonationHistory;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.custom.DonationHistoryRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalTime;
import java.util.List;

@RequiredArgsConstructor
public class DonationHistoryRepositoryImpl implements DonationHistoryRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<DonationHistory> search(DonationHistorySearchCondition condition, Pageable pageable) {
        QDonationHistory donationHistory = QDonationHistory.donationHistory; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if(condition.getDonationHistoryId() != null){
            builder.and(donationHistory.id.eq(condition.getDonationHistoryId()));
        }
        if(condition.getDonationId() != null) {
            builder.and(donationHistory.donation.id.eq(condition.getDonationId()));
        }
        if(condition.getDonatorId() != null) {
            builder.and(donationHistory.donator.id.eq(condition.getDonatorId()));
        }
        if(condition.getStartDate() != null) {
            builder.and(donationHistory.createdAt.goe(condition.getStartDate().atStartOfDay()));
        }
        if(condition.getEndDate() != null) {
            builder.and(donationHistory.createdAt.loe(condition.getEndDate().atTime(LocalTime.MAX)));
        }
        // 실제 데이터 쿼리
        List<DonationHistory> result = queryFactory
                .selectFrom(donationHistory)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        // 전체 개수 쿼리
        long total = queryFactory
                .selectFrom(donationHistory)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
