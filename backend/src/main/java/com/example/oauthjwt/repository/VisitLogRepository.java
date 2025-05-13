package com.example.oauthjwt.repository;

import com.example.oauthjwt.dto.response.VisitLogResponse;
import com.example.oauthjwt.entity.VisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {

    /**
     * 일별 방문 수 집계 (예: "2025-05-13")
     */
    @Query("""
      SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
        FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d'),
        COUNT(v)
      )
      FROM VisitLog v
      WHERE v.visitTime >= :from
      GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d')
      ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d')
    """)
    List<VisitLogResponse> countByDay(@Param("from") LocalDateTime from);

    /**
     * 주별 방문 수 집계 (예: "2025-W20")
     */
    @Query("""
      SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
        FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v'),
        COUNT(v)
      )
      FROM VisitLog v
      WHERE v.visitTime >= :from
      GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v')
      ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v')
    """)
    List<VisitLogResponse> countByWeek(@Param("from") LocalDateTime from);

    /**
     * 월별 방문 수 집계 (예: "2025-05")
     */
    @Query("""
      SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
        FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m'),
        COUNT(v)
      )
      FROM VisitLog v
      WHERE v.visitTime >= :from
      GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m')
      ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m')
    """)
    List<VisitLogResponse> countByMonth(@Param("from") LocalDateTime from);

    /**
     * 연별 방문 수 집계 (예: "2025")
     */
    @Query("""
      SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
        FUNCTION('DATE_FORMAT', v.visitTime, '%Y'),
        COUNT(v)
      )
      FROM VisitLog v
      WHERE v.visitTime >= :from
      GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y')
      ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y')
    """)
    List<VisitLogResponse> countByYear(@Param("from") LocalDateTime from);

}
