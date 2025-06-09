package com.example.oauthjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
