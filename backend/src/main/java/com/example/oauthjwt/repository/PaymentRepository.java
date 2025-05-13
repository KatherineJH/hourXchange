// src/main/java/com/example/oauthjwt/repository/PaymentRepository.java
package com.example.oauthjwt.repository;

import com.example.oauthjwt.dto.response.PaymentLogResponse;
import com.example.oauthjwt.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

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
}
