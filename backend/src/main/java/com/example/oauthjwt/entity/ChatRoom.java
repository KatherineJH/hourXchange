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

    @Builder.Default
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    // 동일한 서비스에 여러 문의자가 존재 -> OneToOne 에서 ManyToOne 으로 변경.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public List<User> getParticipants() {
        Set<User> participants = new HashSet<>();
        for (ChatRoomUser cru : chatRoomUsers) {
            if (cru.getUser() != null) {
                participants.add(cru.getUser());
            }
        }
        return new ArrayList<>(participants);
    }

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static ChatRoom of(Product product, User user) {
        return ChatRoom.builder()
                .name(product.getTitle() + "채팅방")
                .product(product)
                .createdAt(LocalDateTime.now())
                .build();
    }
}