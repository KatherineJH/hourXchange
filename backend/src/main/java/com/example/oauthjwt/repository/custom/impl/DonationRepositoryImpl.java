package com.example.oauthjwt.repository.custom.impl;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.QDonation;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.custom.DonationRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class DonationRepositoryImpl implements DonationRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Donation> search(DonationSearchCondition condition, Pageable pageable) {
        QDonation donation = QDonation.donation; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if(condition.getDonationId() != null) {
            builder.and(donation.id.eq(condition.getDonationId()));
        }
        if(condition.getTitle() != null && !condition.getTitle().isBlank()) {
            builder.and(donation.title.containsIgnoreCase(condition.getTitle()));
        }
        if(condition.getDescription() != null && !condition.getDescription().isBlank()) {
            builder.and(donation.description.containsIgnoreCase(condition.getDescription()));
        }
        if(condition.getStatus() != null && !condition.getStatus().isBlank()) {
            builder.and(donation.status.eq(DonationStatus.valueOf(condition.getStatus())));
        }
        if(condition.getStartDate() != null) {
            builder.and(donation.startDate.after(condition.getStartDate()));
        }
        if(condition.getEndDate() != null) {
            builder.and(donation.endDate.before(condition.getEndDate()));
        }
        // 실제 데이터 쿼리
        List<Donation> result = queryFactory
                .selectFrom(donation)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
        // 전체 개수 쿼리
        long total = queryFactory
                .selectFrom(donation)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
