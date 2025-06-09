package com.example.oauthjwt.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Advertisement;
import com.example.oauthjwt.entity.User;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    boolean existsByTitle(String title);

    Page<Advertisement> findByOwner(User owner, Pageable pageable);

}
