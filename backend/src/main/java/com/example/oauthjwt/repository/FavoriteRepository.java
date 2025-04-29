package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.Favorite;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndProduct(User user, Product product);

    List<Favorite> findByUserAndStatus(User user, boolean status);
}
