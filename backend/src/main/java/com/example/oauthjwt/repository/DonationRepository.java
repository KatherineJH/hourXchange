package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Long> {
}
