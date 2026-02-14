package com.covoiturage.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id; // userId of the other person
    private String firstName;
    private String lastName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private int unreadCount;
}
