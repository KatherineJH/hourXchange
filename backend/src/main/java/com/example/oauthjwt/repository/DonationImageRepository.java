package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.DonationImage;

public interface DonationImageRepository extends JpaRepository<DonationImage, Long> {
    boolean existsByImgUrl(String url);

    @Modifying
    @Query("DELETE FROM DonationImage di WHERE di.donation.id = :donationId")
    void deleteByDonationId(@Param("donationId") Long donationId);
}
