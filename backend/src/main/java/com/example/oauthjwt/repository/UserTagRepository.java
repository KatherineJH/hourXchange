package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.UserTag;

public interface UserTagRepository extends JpaRepository<UserTag, Long> {

    Optional<UserTag> findByUserAndTag(User user, String tag);

    List<UserTag> findByUserIdOrderByCountDesc(Long userId);
}
