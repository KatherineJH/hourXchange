// src/main/java/com/example/oauthjwt/repository/PaymentRepository.java
package com.example.oauthjwt.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.dto.response.PaymentItemRatioResponse;
import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.entity.Payment;
import com.example.oauthjwt.repository.custom.PaymentRepositoryCustom;

public interface PaymentRepository extends JpaRepository<Payment, Long>, PaymentRepositoryCustom {

    /**
     * 일별 결제 건수 집계 (예: "2025-05-13")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d'),
                COUNT(p)
              )
              FROM Payment p
              WHERE p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')
            """)
    List<PaymentLogResponse> countByDay(@Param("from") LocalDateTime from);

    /**
     * 주별 결제 건수 집계 (예: "2025-W20")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v'),
                COUNT(p)
              )
              FROM Payment p
              WHERE p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v')
            """)
    List<PaymentLogResponse> countByWeek(@Param("from") LocalDateTime from);

    /**
     * 월별 결제 건수 집계 (예: "2025-05")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m'),
                COUNT(p)
              )
              FROM Payment p
              WHERE p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m')
            """)
    List<PaymentLogResponse> countByMonth(@Param("from") LocalDateTime from);

    /**
     * 연별 결제 건수 집계 (예: "2025")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y'),
                COUNT(p)
              )
              FROM Payment p
              WHERE p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y')
            """)
    List<PaymentLogResponse> countByYear(@Param("from") LocalDateTime from);

    /**
     * 일별 결제 금액 합계 (예: "2025-05-13", 금액 합계를 count 필드로 반환)
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d'),
                SUM(p.amount)
              )
              FROM Payment p
              WHERE p.status = 'paid' AND p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')
            """)
    List<PaymentLogResponse> sumAmountByDay(@Param("from") LocalDateTime from);

    /**
     * 주별 결제 금액 합계 (예: "2025-W20")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v'),
                SUM(p.amount)
              )
              FROM Payment p
              WHERE p.status = 'paid' AND p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%x-W%v')
            """)
    List<PaymentLogResponse> sumAmountByWeek(@Param("from") LocalDateTime from);

    /**
     * 월별 결제 금액 합계 (예: "2025-05")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m'),
                SUM(p.amount)
              )
              FROM Payment p
              WHERE p.status = 'paid' AND p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m')
            """)
    List<PaymentLogResponse> sumAmountByMonth(@Param("from") LocalDateTime from);

    /**
     * 연별 결제 금액 합계 (예: "2025")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse(
                FUNCTION('DATE_FORMAT', p.paidAt, '%Y'),
                SUM(p.amount)
              )
              FROM Payment p
              WHERE p.status = 'paid' AND p.paidAt >= :from
              GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y')
              ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y')
            """)
    List<PaymentLogResponse> sumAmountByYear(@Param("from") LocalDateTime from);

    /**
     * 결제된 item 별 비율 (원형 차트용)
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.PaymentItemRatioResponse(
                pi.name,
                COUNT(p)
              )
              FROM Payment p, PaymentItem pi
              WHERE p.paymentItemId = pi.id
                AND p.status = 'paid'
              GROUP BY pi.name
              ORDER BY COUNT(p) DESC
            """)
    List<PaymentItemRatioResponse> ratioByItem();

    // 고객 등급 분류
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.userId = :userId AND p.status = 'paid'")
    int countPaymentsByUserId(@Param("userId") Long userId);
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.userId = :userId AND p.status = 'paid'")
    Integer sumPaymentsByUserId(@Param("userId") Long userId);

    // 기간 별 판매 개수 로드
    @Query("SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse("
            + "FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d'), COUNT(p)) " + "FROM Payment p "
            + "WHERE p.paidAt BETWEEN :from AND :to " + "GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d') "
            + "ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')")
    List<PaymentLogResponse> countByRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
    // 기간 별 판매 금액 로드
    @Query("SELECT new com.example.oauthjwt.dto.response.PaymentLogResponse("
            + "FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d'), SUM(p.amount)) " + "FROM Payment p "
            + "WHERE p.paidAt BETWEEN :from AND :to " + "AND p.status = 'paid' "
            + "GROUP BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d') "
            + "ORDER BY FUNCTION('DATE_FORMAT', p.paidAt, '%Y-%m-%d')")
    List<PaymentLogResponse> sumAmountByRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

}
