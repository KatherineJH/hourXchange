package com.example.oauthjwt.entity;

import java.time.LocalDateTime;

import com.example.oauthjwt.entity.type.ChatMessageType;
import com.example.oauthjwt.entity.type.ChatRoomUserStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private ChatMessageType chatMessageType; // 채팅 메시지 타입

    @Column(name = "sent_at", nullable = false, updatable = false)
    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }

    public static ChatMessage of(ChatRoom chatRoom, User sender, String content, ChatMessageType chatMessageType) {
        return ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(content)
                .chatMessageType(chatMessageType)
                .build();
    }
}
