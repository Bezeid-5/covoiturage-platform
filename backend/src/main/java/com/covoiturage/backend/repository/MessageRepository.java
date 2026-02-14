package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Message;
import com.covoiturage.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("user1") User user1, @Param("user2") User user2);
    
    List<Message> findByReceiverAndIsReadFalse(User receiver);
    
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user UNION SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user")
    List<User> findConversationPartners(@Param("user") User user);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.receiver = :receiver AND m.isRead = false")
    int countUnreadMessages(@Param("sender") User sender, @Param("receiver") User receiver);
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp DESC LIMIT 1")
    Message findLastMessage(@Param("user1") User user1, @Param("user2") User user2);
}
