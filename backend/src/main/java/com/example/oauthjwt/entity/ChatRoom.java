package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

//    @OneToOne(cascade = CascadeType.ALL, optional = true)
    @OneToOne
    @JoinColumn(name = "service_product_id", nullable = false)
    private ServiceProduct serviceProduct;

    public List<User> getParticipants() {
        return chatRoomUsers.stream().map(ChatRoomUser::getUser).toList();
    }

    // Helper to add a user
    public void addUser(User user, ChatRoomUserStatus status) {
        ChatRoomUser chatRoomUser = new ChatRoomUser();
        chatRoomUser.setChatRoom(this);
        chatRoomUser.setUser(user);
        chatRoomUser.setStatus(status);
        chatRoomUsers.add(chatRoomUser);
    }
}
