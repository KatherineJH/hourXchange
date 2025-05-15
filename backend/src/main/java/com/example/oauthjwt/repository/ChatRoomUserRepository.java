package com.example.oauthjwt.repository;

import java.util.Optional;

import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ChatRoomUser;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

//    Optional<ChatRoomUser> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    Optional<ChatRoomUser> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatRoomUser> findByChatRoomAndUser(ChatRoom chatRoom, User user);
}
