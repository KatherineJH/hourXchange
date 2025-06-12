package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.Address;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByUser(User user);
}
