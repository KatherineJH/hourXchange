package com.example.oauthjwt.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.UserSearchCondition;
import com.example.oauthjwt.entity.User;

public interface UserRepositoryCustom {
    Page<User> search(UserSearchCondition condition, Pageable pageable);
}
