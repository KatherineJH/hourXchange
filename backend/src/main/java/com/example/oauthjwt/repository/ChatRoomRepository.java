package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cru.chatRoom FROM ChatRoomUser cru WHERE cru.user1.id = :userId OR cru.user2.id = :userId")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);
}