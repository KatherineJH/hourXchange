package com.example.oauthjwt.repository;

import java.util.List;
import java.util.Optional;

import com.example.oauthjwt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oauthjwt.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
  
@Query("""
    SELECT DISTINCT cr FROM ChatRoom cr
    JOIN cr.chatRoomUsers cru
    WHERE cru.user.id = :userId
""")
List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

@Query("""
    SELECT cr FROM ChatRoom cr
    JOIN cr.chatRoomUsers cru1
    JOIN cr.chatRoomUsers cru2
    WHERE cr.product.id = :productId
      AND cru1.user.id = :user1Id
      AND cru2.user.id = :user2Id
""")
Optional<ChatRoom> findByProductAndUsers(@Param("productId") Long productId,
                                         @Param("user1Id") Long user1Id,
                                         @Param("user2Id") Long user2Id);

    int countByProduct(Product product);

//    List<ChatRoom> findByProduct(Product product);

    /**
     * productId에 연결된 ChatRoom 중에
     * ownerId 와 requesterId 가 모두 참가자로 등록된 방이 있는지 조회
     */
    @Query("""
      select cr
      from ChatRoom cr
      join cr.chatRoomUsers cru1
      join cr.chatRoomUsers cru2
      where cr.product.id      = :productId
        and cru1.user.id        = :ownerId
        and cru2.user.id        = :requesterId
      """)
    Optional<ChatRoom> findByProductAndParticipants(
            @Param("productId") Long productId,
            @Param("ownerId")   Long ownerId,
            @Param("requesterId")Long requesterId
    );
}
