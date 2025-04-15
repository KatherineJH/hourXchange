package com.example.oauthjwt.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String categoryName;

    // single category can have multiple products
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<ServiceProduct> products = new ArrayList<>();
}
