package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, optional = true)
    @JoinColumn(name = "service_product_id", nullable = false)
    private ServiceProduct serviceProduct;

    // Helper method to get participants
    public List<User> getParticipants() {
        Set<User> participants = new HashSet<>();
        for (ChatRoomUser cru : chatRoomUsers) {
            if (cru.getUser1() != null) participants.add(cru.getUser1());
            if (cru.getUser2() != null) participants.add(cru.getUser2());
        }
        return new ArrayList<>(participants);
    }

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
