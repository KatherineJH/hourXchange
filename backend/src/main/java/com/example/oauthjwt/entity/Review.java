package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.dto.request.ReviewRequest;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String content;

    @Column(name = "rating", nullable = false)
    private int rates;

    @Column(name = "stars", nullable = false)
    private Integer stars;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewTag> tags = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public static Review of(ReviewRequest request, int rating, User reviewer, Product product) {
        return Review.builder().content(request.getText()).createdAt(LocalDateTime.now()).rates(rating)
                .reviewer(reviewer).product(product).stars(request.getStars()).build();
    }
}
