package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ServiceProduct;

public interface ServiceProductRepository extends JpaRepository<ServiceProduct, Long> {}
