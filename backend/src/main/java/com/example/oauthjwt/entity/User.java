package com.example.oauthjwt.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.OAuth2Response;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // 비밀번호는 일반 로그인 사용자의 경우만 필요
    private String password;

    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    private LocalDate birthdate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Wallet wallet;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Address address; // 서비스 카테고리

    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Donation> donationHistory = new ArrayList<>();

    @OneToMany(mappedBy = "donator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationHistory> donationHistoryList = new ArrayList<>();

    public static User of(UserRequest userRequest) {
        return User.builder().email(userRequest.getEmail()).name(userRequest.getName())
                .username(userRequest.getUsername()).birthdate(userRequest.getBirthdate()).role(UserRole.ROLE_USER) // 일반유저
                .status(UserStatus.ACTIVE) // 활성화
                .createdAt(LocalDateTime.now()) // 현재시간
                .build();
    }

    public static User of(OAuth2Response oAuth2Response) {
        return User.builder().email(oAuth2Response.getEmail()) // 이메일
                .name(oAuth2Response.getProvider() + UUID.randomUUID())
                .username(oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId()) // 유저네임
                .name(oAuth2Response.getName()).createdAt(LocalDateTime.now()).role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE).createdAt(LocalDateTime.now()).build();
    }

    public void addCredit(int credit) {
        this.wallet.addCredit(credit);
    }

    public void subtractCredit(int credit) {
        this.wallet.subtractCredit(credit);
    }

    public User setUpdateValue(UserRequest userRequest) {
        this.username = userRequest.getUsername();
        this.birthdate = userRequest.getBirthdate();
        return this;
    }
}
