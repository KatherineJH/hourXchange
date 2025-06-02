package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Advertisement;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    boolean existsByTitle(String title);

    Page<Advertisement> findByOwner(User owner, Pageable pageable);

}
