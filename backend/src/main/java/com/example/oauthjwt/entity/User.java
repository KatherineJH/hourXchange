package com.example.oauthjwt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class User {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;

//    private String password;
//
//    private String email;
//
//    private String role;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private USER_TYPE role;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    private Date birthdate;

//    @Column(nullable = false)
//    private LocalDateTime createdAt;
//
//    @Column(nullable = false)
//    private int credit;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    // single user can have multiple reviews, but each review belongs to a single user
    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    // Helper method to get chat rooms
    public List<ChatRoom> getChatRooms() {
        return chatRoomUsers.stream()
                .map(ChatRoomUser::getChatRoom)
                .toList();
    }
}
