package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    Optional<User> findByName(String UserName);

    Optional<User> findByEmail(String email);

    List<User> findByStatus(UserStatus status);

    boolean existsByEmail(String email);

    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    Optional<User> findByEmailAndUsername(String email,String username);
}
