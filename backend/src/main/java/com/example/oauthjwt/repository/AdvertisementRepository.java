package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Advertisement;
import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    boolean existsByTitle(String title);
    List<Advertisement> findAllByOwnerId(Long ownerId);
}
