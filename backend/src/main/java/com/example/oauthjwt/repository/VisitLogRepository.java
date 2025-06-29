package com.example.oauthjwt.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.dto.response.VisitLogResponse;
import com.example.oauthjwt.entity.VisitLog;

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

    /**
     * 일별 고유 방문자 수(UV) 집계 (예: "2025-05-13")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
                FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d'),
                COUNT(DISTINCT v.userId)
              )
              FROM VisitLog v
              WHERE v.visitTime >= :from
              GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d')
              ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m-%d')
            """)
    List<VisitLogResponse> countUniqueUsersByDay(@Param("from") LocalDateTime from);

    /**
     * 주별 고유 방문자 수(UV) 집계 (예: "2025-W20")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
                FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v'),
                COUNT(DISTINCT v.userId)
              )
              FROM VisitLog v
              WHERE v.visitTime >= :from
              GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v')
              ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%x-W%v')
            """)
    List<VisitLogResponse> countUniqueUsersByWeek(@Param("from") LocalDateTime from);

    /**
     * 월별 고유 방문자 수(UV) 집계 (예: "2025-05")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
                FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m'),
                COUNT(DISTINCT v.userId)
              )
              FROM VisitLog v
              WHERE v.visitTime >= :from
              GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m')
              ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y-%m')
            """)
    List<VisitLogResponse> countUniqueUsersByMonth(@Param("from") LocalDateTime from);

    /**
     * 연별 고유 방문자 수(UV) 집계 (예: "2025")
     */
    @Query("""
              SELECT new com.example.oauthjwt.dto.response.VisitLogResponse(
                FUNCTION('DATE_FORMAT', v.visitTime, '%Y'),
                COUNT(DISTINCT v.userId)
              )
              FROM VisitLog v
              WHERE v.visitTime >= :from
              GROUP BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y')
              ORDER BY FUNCTION('DATE_FORMAT', v.visitTime, '%Y')
            """)
    List<VisitLogResponse> countUniqueUsersByYear(@Param("from") LocalDateTime from);

    // 고객 등급 분류
    @Query("SELECT MAX(v.visitTime) FROM VisitLog v WHERE v.userId = :userId")
    LocalDateTime findLastVisitTime(@Param("userId") Long userId);

    // 요일별 집계
    @Query(value = """
            SELECT weekday, COUNT(*) AS count
            FROM (
              SELECT DAYNAME(v.visitTime) AS weekday
              FROM VisitLog v
              WHERE v.userId = :userId
                AND v.visitTime IS NOT NULL
            ) AS derived
            GROUP BY weekday
            ORDER BY FIELD(weekday, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
            """, nativeQuery = true)
    List<Object[]> countByWeekdayForUser(@Param("userId") Long userId);

}
