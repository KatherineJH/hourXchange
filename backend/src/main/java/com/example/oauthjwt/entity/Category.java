package com.example.oauthjwt.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String categoryName;

    @Column(nullable = false)
    private boolean status;

    // single category can have multiple products
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();

    // single category can have multiple boards
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    public static Category of(String categoryName) {
        return Category.builder().categoryName(categoryName).status(true).build();
    }

    public void updateCategory(String categoryName) {
        this.categoryName = categoryName;
    }

    public void deleteCategory() {
        this.status = false;
    }
}
