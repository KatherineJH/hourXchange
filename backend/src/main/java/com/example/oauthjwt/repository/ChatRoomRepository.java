package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatRoomUsers cru1 JOIN cr.chatRoomUsers cru2 " +
            "WHERE cr.serviceProduct.id = :serviceProductId " +
            "AND cru1.user.id = :userId1 AND cru2.user.id = :userId2")
    Optional<ChatRoom> findByServiceProductIdAndParticipants(Long serviceProductId, Long userId1, Long userId2);
}
