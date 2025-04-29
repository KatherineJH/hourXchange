package com.example.oauthjwt.repository;

import com.example.oauthjwt.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cru.chatRoom FROM ChatRoomUser cru WHERE cru.user1.id = :userId OR cru.user2.id = :userId")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT cr FROM ChatRoom cr JOIN cr.chatRoomUsers cru WHERE cr.product.id = :productId AND ( 
    (cru.user1.id = :user1Id AND cru.user2.id = :user2Id) OR (cru.user1.id = :user2Id AND cru.user2.id = :user1Id))""")
    Optional<ChatRoom> findByProductAndUsers(@Param("productId") Long productId,
                                             @Param("user1Id") Long user1Id,
                                             @Param("user2Id") Long user2Id);

}