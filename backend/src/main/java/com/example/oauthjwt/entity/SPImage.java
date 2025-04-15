package com.example.oauthjwt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SPImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ImgUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_product_id", nullable = false)
    private ServiceProduct serviceProduct;
}
