package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
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
public class ServiceProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String imgUrl;

    @Column(nullable = false)
    private int hours;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // single category can have multiple service products
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // 서비스 카테고리

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderType providerType; // SP 글쓴이 타입

    @OneToMany(mappedBy = "serviceProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SPImage> images = new ArrayList<>();

    // single transaction can have multiple service products
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    @OneToOne(mappedBy = "serviceProduct")
    private ChatRoom chatRoom;

    //    @PrePersist
    //    @PreUpdate
    //    public void calculateHours() {
    //        if (startedAt != null && endAt != null) {
    //            this.hours = (int) java.time.Duration.between(startedAt, endAt).toHours();
    //        }
    //    }
}
