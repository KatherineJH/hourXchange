package com.example.oauthjwt.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique = true)
    private String username;

    // 비밀번호는 일반 로그인 사용자의 경우만 필요
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    private LocalDate birthdate;

    //    @Column(nullable = false)
    //    private LocalDateTime createdAt;
    //
    //    @Column(nullable = false)
    //    private int credit;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Address address;

    // single user can have multiple reviews, but each review belongs to a single user
    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    // Helper method to get chat rooms
    public List<ChatRoom> getChatRooms() {
        return chatRoomUsers.stream().map(ChatRoomUser::getChatRoom).toList();
    }
}
