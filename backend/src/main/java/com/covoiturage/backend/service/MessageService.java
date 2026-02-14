package com.covoiturage.backend.service;

import com.covoiturage.backend.dto.MessageDTO;
import com.covoiturage.backend.entity.Message;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.repository.MessageRepository;
import com.covoiturage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public MessageDTO sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setIsRead(false);
        
        Message saved = messageRepository.save(message);
        return convertToDTO(saved);
    }
    
    public List<MessageDTO> getConversation(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Message> messages = messageRepository.findConversation(user1, user2);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    public List<MessageDTO> getUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Message> messages = messageRepository.findByReceiverAndIsReadFalse(user);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<com.covoiturage.backend.dto.ConversationDTO> getUserConversations(Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        List<User> partners = messageRepository.findConversationPartners(currentUser);
        
        return partners.stream().map(partner -> {
            Message lastMsg = messageRepository.findLastMessage(currentUser, partner);
            int unread = messageRepository.countUnreadMessages(partner, currentUser);
            
            return com.covoiturage.backend.dto.ConversationDTO.builder()
                    .id(partner.getId())
                    .firstName(partner.getFirstName())
                    .lastName(partner.getLastName())
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : "")
                    .lastMessageTime(lastMsg != null ? lastMsg.getTimestamp() : null)
                    .unreadCount(unread)
                    .build();
        }).sorted((c1, c2) -> {
            if (c1.getLastMessageTime() == null) return 1;
            if (c2.getLastMessageTime() == null) return -1;
            return c2.getLastMessageTime().compareTo(c1.getLastMessageTime());
        }).collect(Collectors.toList());
    }
    
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setIsRead(message.getIsRead());
        return dto;
    }
}
