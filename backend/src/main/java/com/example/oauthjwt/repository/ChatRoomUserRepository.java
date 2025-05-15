package com.example.oauthjwt.repository;

import java.util.List;

import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.Query;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

    List<ChatRoomUser> findByChatRoom(ChatRoom chatRoom);

    List<ChatRoomUser> findByUser(User user);

    @Query("SELECT cru FROM ChatRoomUser cru WHERE cru.chatRoom.id = :chatRoomId AND cru.user.id = :userId")
    ChatRoomUser findByChatRoomIdAndUserId(Long chatRoomId, Long userId);

}
