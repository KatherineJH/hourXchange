package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Address;
import com.example.oauthjwt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
