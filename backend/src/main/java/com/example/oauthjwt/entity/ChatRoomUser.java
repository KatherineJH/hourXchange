package com.example.oauthjwt.entity;

import com.example.oauthjwt.entity.type.ChatRoomUserStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "chat_room_users")
public class ChatRoomUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ChatRoomUserStatus chatRoomUserStatus;

    public static ChatRoomUser of(User user, ChatRoom chatRoom) {
        return ChatRoomUser.builder().chatRoom(chatRoom).user(user).chatRoomUserStatus(ChatRoomUserStatus.JOIN).build();
    }
}
