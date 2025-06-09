package com.example.oauthjwt.repository.custom.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.UserSearchCondition;
import com.example.oauthjwt.entity.QUser;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.custom.UserRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<User> search(UserSearchCondition condition, Pageable pageable) {
        QUser user = QUser.user; // QueryDSL이 생성한 클래스

        BooleanBuilder builder = new BooleanBuilder();
        // 동적 조건 where 조건
        if (condition.getUserId() != null) {
            builder.and(user.id.eq(condition.getUserId()));
        }
        if (condition.getEmail() != null && !condition.getEmail().isBlank()) {
            builder.and(user.email.containsIgnoreCase(condition.getEmail()));
        }
        if (condition.getName() != null && !condition.getName().isBlank()) {
            builder.and(user.name.containsIgnoreCase(condition.getName()));
        }
        if (condition.getUsername() != null && !condition.getUsername().isBlank()) {
            builder.and(user.username.containsIgnoreCase(condition.getUsername()));
        }
        if (condition.getRole() != null && !condition.getRole().isBlank()) {
            builder.and(user.role.eq(UserRole.valueOf(condition.getRole())));
        }
        if (condition.getStatus() != null && !condition.getStatus().isBlank()) {
            builder.and(user.status.eq(UserStatus.valueOf(condition.getStatus())));
        }
        // 실제 데이터 쿼리
        List<User> result = queryFactory.selectFrom(user).where(builder).offset(pageable.getOffset())
                .limit(pageable.getPageSize()).fetch();
        // 전체 개수 쿼리
        long total = queryFactory.selectFrom(user).where(builder).fetchCount();

        return new PageImpl<>(result, pageable, total);
    }
}
