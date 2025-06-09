package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 동일한 서비스에 여러 문의자가 존재 -> OneToOne 에서 ManyToOne 으로 변경.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Builder.Default
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    public static ChatRoom of(Product product) {
        return ChatRoom.builder().name(product.getTitle() + "채팅방").product(product).createdAt(LocalDateTime.now())
                .build();
    }
}
