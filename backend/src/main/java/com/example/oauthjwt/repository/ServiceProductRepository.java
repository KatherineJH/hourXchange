package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ServiceProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceProductRepository extends JpaRepository<ServiceProduct, Long> {
}
