package com.example.oauthjwt.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.User;
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

    // 유저 Features 추출
    @Query(value = """
        SELECT 
            TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
            DATEDIFF(CURDATE(), u.createdAt) AS days_since_signup,

            COALESCE((SELECT COUNT(*) FROM visitlog v WHERE v.userId = :userId), 0) AS visit_count,
            COALESCE((SELECT COUNT(DISTINCT v.url) FROM visitlog v WHERE v.userId = :userId), 0) AS distinct_url_count,

            COALESCE((SELECT COUNT(*) FROM payment p WHERE p.userId = :userId AND p.status = 'paid'), 0) AS payment_count,
            COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.userId = :userId AND p.status = 'paid'), 0) AS total_payment_amount,

            COALESCE((SELECT COUNT(*) FROM transaction t WHERE t.user_id = :userId AND t.status = 'COMPLETED'), 0) AS transaction_count,

            COALESCE((SELECT COUNT(*) FROM review r WHERE r.reviewer_id = :userId), 0) AS review_count,
            COALESCE((SELECT AVG(r.stars) FROM review r WHERE r.reviewer_id = :userId), 0) AS avg_stars_given
        FROM user u
        WHERE u.id = :userId
    """, nativeQuery = true)
    List<Object[]> getUserFeatureRawByUserId(@Param("userId") Long userId);
}
