package com.example.oauthjwt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String streetAddress; // 도로명 주소

    @Column(nullable = false)
    private String city; // 고양시

    @Column(nullable = false)
    private String state; // 경기도

    @Column(nullable = false)
    private String postalCode; // 우편번호

    @Column(nullable = false)
    private String country; // 국가명

    // single user to one address
    @OneToOne(mappedBy = "address", cascade = CascadeType.ALL)
    private User user;
}
