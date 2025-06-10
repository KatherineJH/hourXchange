package com.example.oauthjwt.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.custom.UserRepositoryCustom;

public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // 고객 등급 분류
    @Query("SELECT u.createdAt FROM User u WHERE u.id = :userId")
    LocalDateTime findCreatedAtById(@Param("userId") Long userId);
    @Query("SELECT u.address.roadAddress FROM User u WHERE u.id = :userId")
    String findRegionByUserId(@Param("userId") Long userId);

    /**
     * 유저 Features 추출 user_id |username |age |days_since_signup |visit_count
     * |distinct_url_count |payment_count |total_payment_amount | donation_count
     * |total_donation_amount |transaction_count |review_count |avg_stars_given
     * |region
     */
    @Query(value = """
                SELECT
                    TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
                    DATEDIFF(CURDATE(), u.createdAt) AS days_since_signup,

                    -- visitlog
                    COALESCE(v.visit_count, 0) AS visit_count,
                    COALESCE(v.distinct_url_count, 0) AS distinct_url_count,

                    -- payment
                    COALESCE(p.payment_count, 0) AS payment_count,
                    COALESCE(p.total_payment_amount, 0) AS total_payment_amount,

                    -- donationhistory: 기부 횟수, 기부 금액 합계
                    COALESCE(d.donation_count, 0) AS donation_count,
                    COALESCE(d.total_donation_amount, 0) AS total_donation_amount,

                    -- transaction
                    COALESCE(t.transaction_count, 0) AS transaction_count,

                    -- review
                    COALESCE(r.review_count, 0) AS review_count,
                    COALESCE(r.avg_stars_given, 0) AS avg_stars_given,

                    -- region (jibunAddress 앞 두 글자)
                    COALESCE(SUBSTRING(a.jibunAddress, 1, 2), '기타') AS region

                FROM `User` u
                LEFT JOIN Address a ON u.id = a.user_id

                LEFT JOIN (
                    SELECT userId,
                           COUNT(*) AS visit_count,
                           COUNT(DISTINCT url) AS distinct_url_count
                    FROM VisitLog
                    WHERE userId IS NOT NULL
                    GROUP BY userId
                ) v ON u.id = v.userId

                LEFT JOIN (
                    SELECT userId,
                           COUNT(*) AS payment_count,
                           SUM(amount) AS total_payment_amount
                    FROM Payment
                    WHERE status = 'paid'
                    GROUP BY userId
                ) p ON u.id = p.userId

                LEFT JOIN (
                    SELECT user_id,
                           COUNT(*) AS donation_count,
                           -SUM(amount) AS total_donation_amount
                    FROM DonationHistory
                    GROUP BY user_id
                ) d ON u.id = d.user_id

                LEFT JOIN (
                    SELECT user_id,
                           COUNT(*) AS transaction_count
                    FROM Transaction
                    WHERE status = 'COMPLETED'
                    GROUP BY user_id
                ) t ON u.id = t.user_id

                LEFT JOIN (
                    SELECT reviewer_id,
                           COUNT(*) AS review_count,
                           AVG(stars) AS avg_stars_given
                    FROM Review
                    GROUP BY reviewer_id
                ) r ON u.id = r.reviewer_id

                WHERE u.id = :userId
            """, nativeQuery = true)
    List<Object[]> getUserFeatureRawByUserId(@Param("userId") Long userId);
}
