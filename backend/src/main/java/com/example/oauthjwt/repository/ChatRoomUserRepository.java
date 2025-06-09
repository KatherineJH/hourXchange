package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;
import com.example.oauthjwt.entity.ChatRoom;
import com.example.oauthjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oauthjwt.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.Query;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

  Optional<ChatRoomUser> findByChatRoomAndUser(ChatRoom chatRoom, User user);
}