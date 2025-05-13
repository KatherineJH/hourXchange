package com.example.oauthjwt.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = """
            SELECT *
              FROM Product p
             WHERE p.lat BETWEEN :lat - 0.01 AND :lat + 0.01
               AND p.lng BETWEEN :lng - 0.01 AND :lng + 0.01
            """, nativeQuery = true)
    List<Product> findNearby1Km(@Param("lat") double lat, @Param("lng") double lng);

    Page<Product> findByIdIn(List<Long> ids, Pageable pageable);

    Page<Product> findByOwnerId(Long ownerId, Pageable pageable);
}
