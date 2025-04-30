package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Advertisement;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
  boolean existsByTitle(String title);
}
