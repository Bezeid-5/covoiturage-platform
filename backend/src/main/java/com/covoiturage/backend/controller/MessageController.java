package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.MessageDTO;
import com.covoiturage.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4100")
public class MessageController {
    
    private final MessageService messageService;
    
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody Map<String, Object> request) {
        Long senderId = Long.valueOf(request.get("senderId").toString());
        Long receiverId = Long.valueOf(request.get("receiverId").toString());
        String content = request.get("content").toString();
        
        MessageDTO message = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable Long userId,
            @RequestParam Long currentUserId) {
        List<MessageDTO> messages = messageService.getConversation(currentUserId, userId);
        return ResponseEntity.ok(messages);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages(@PathVariable Long userId) {
        List<MessageDTO> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<List<com.covoiturage.backend.dto.ConversationDTO>> getUserConversations(@RequestParam Long userId) {
        List<com.covoiturage.backend.dto.ConversationDTO> conversations = messageService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }
}
