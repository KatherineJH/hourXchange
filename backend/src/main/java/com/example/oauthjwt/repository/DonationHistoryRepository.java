package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.DonationHistory;
import com.example.oauthjwt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    Page<DonationHistory> findByDonator(Pageable pageable, User donator);

    // 하나의 기부모집에 유저별로 그룹한 총 기부한 시간을 가져오는 쿼리
    @Query("""
        SELECT h.donator.id, SUM(h.amount)
        FROM DonationHistory h
        WHERE h.donation.id = :donationId
        GROUP BY h.donator.id
    """)
    List<Object[]> findUserIdAndTotalHoursByDonation(@Param("donationId") Long donationId);

    /**
     * 주어진 시점 이후의 기부 기록을 사용자별로 묶어,
     * 기부량 합계가 큰 순서대로 return합니다.
     * 반환 스펙: Object[]{ Long userId, Long totalDonatedHours }
     */
    @Query("""
      SELECT dh.donator, SUM(-dh.amount)
      FROM DonationHistory dh
      WHERE dh.createdAt >= :since
      GROUP BY dh.donator
      ORDER BY SUM(-dh.amount) DESC
      """)
    List<Object[]> findTopDonatorsSince(
            @Param("since") LocalDateTime since,
            Pageable pageable
    );
}
