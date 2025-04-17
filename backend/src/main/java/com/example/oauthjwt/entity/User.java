package com.example.oauthjwt.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false, unique = true)
    private String username;

    // 비밀번호는 일반 로그인 사용자의 경우만 필요
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    private LocalDate birthdate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int credit;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE; // nullabe=false로 지정했기때문에 기본값으로 ACTIVE 설정.

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Address address;

    // single user can have multiple reviews, but each review belongs to a single user
    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();
//    public List<ChatRoom> getChatRooms() {
//        return chatRoomUsers.stream().map(ChatRoomUser::getChatRoom).toList();
//    }
}
