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
         WHERE p.lat  BETWEEN :swLat AND :neLat
           AND p.lng  BETWEEN :swLng AND :neLng
           AND p.startedAt <= NOW()      -- (선택) 노출 기간 필터
           AND p.endAt     >= NOW()
        """,
            nativeQuery = true
    )
    List<Product> findAllWithPosition(
            @Param("swLat") double swLat,
            @Param("swLng") double swLng,
            @Param("neLat") double neLat,
            @Param("neLng") double neLng
    );

    Page<Product> findByOwnerId(Long ownerId, Pageable pageable);
}
