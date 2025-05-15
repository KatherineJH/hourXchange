package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT DISTINCT cr FROM ChatRoom cr JOIN cr.chatRoomUsers cru WHERE cru.user.id = :userId")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT cr FROM ChatRoom cr JOIN cr.chatRoomUsers cru1 JOIN cr.chatRoomUsers cru2
    WHERE cr.product.id = :productId AND cru1.user.id = :user1Id AND cru2.user.id = :user2Id
    """)
    Optional<ChatRoom> findByProductAndUsers(@Param("productId") Long productId, @Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    int countByProduct(Product product);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.product.id = :productId")
    Optional<ChatRoom> findByProductId(@Param("productId") Long productId);
}
