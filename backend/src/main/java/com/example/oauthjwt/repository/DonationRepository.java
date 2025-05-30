package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.custom.DonationRepositoryCustom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long>, DonationRepositoryCustom {
    /**
     * 1) 목표 대비 모집 진행률이 높은 순으로 limit 개수를 반환
     */
    @Query("""
      SELECT d
      FROM Donation d
      WHERE d.status = :status
        AND :today BETWEEN d.startDate AND d.endDate
      ORDER BY (d.currentAmount * 1.0 / d.targetAmount) DESC
      """)
    List<Donation> findTopByProgress(
            DonationStatus status,
            LocalDate today,
            Pageable limit
    );

    /**
     * 2) 조회수(viewCount)가 높은 순으로 limit 개수를 반환
     */
    @Query("""
      SELECT d
      FROM Donation d
      WHERE d.status = :status
        AND :today BETWEEN d.startDate AND d.endDate
      ORDER BY d.viewCount DESC
      """)
    List<Donation> findTopByViewCount(
            DonationStatus status,
            LocalDate today,
            Pageable limit
    );

    /**
     * 3) 생성일(createdAt)이 최신 순으로 limit 개수를 반환
     */
    @Query("""
      SELECT d
      FROM Donation d
      WHERE d.status = :status
        AND :today BETWEEN d.startDate AND d.endDate
      ORDER BY d.createdAt DESC
      """)
    List<Donation> findTopByCreatedAt(
            DonationStatus status,
            LocalDate today,
            Pageable limit
    );
}
