package com.example.oauthjwt.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.UserStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // 고객 등급 분류
    @Query("SELECT u.createdAt FROM User u WHERE u.id = :userId")
    LocalDateTime findCreatedAtById(@Param("userId") Long userId);
    @Query("SELECT u.address.roadAddress FROM User u WHERE u.id = :userId")
    String findRegionByUserId(@Param("userId") Long userId);
}
