package com.example.oauthjwt.repository.custom;

import com.example.oauthjwt.dto.condition.UserSearchCondition;
import com.example.oauthjwt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepositoryCustom {
    Page<User> search(UserSearchCondition condition, Pageable pageable);
}
