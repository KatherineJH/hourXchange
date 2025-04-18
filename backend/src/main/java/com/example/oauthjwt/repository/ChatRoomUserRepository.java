package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

    Optional<ChatRoomUser> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
}
