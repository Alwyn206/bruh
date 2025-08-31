package com.hackmate.controller;

import com.hackmate.dto.ChatMessageRequest;
import com.hackmate.model.ChatMessage;
import com.hackmate.model.MessageType;
import com.hackmate.model.Team;
import com.hackmate.model.User;
import com.hackmate.repository.ChatMessageRepository;
import com.hackmate.repository.TeamRepository;
import com.hackmate.repository.UserRepository;
import com.hackmate.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @GetMapping("/teams/{teamId}/messages")
    public ResponseEntity<Page<ChatMessage>> getTeamMessages(
            @PathVariable Long teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        // Check if user is a member of the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!team.getMembers().contains(user)) {
            return ResponseEntity.status(403).build();
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ChatMessage> messages = chatMessageRepository.findByTeamIdOrderByCreatedAtDesc(teamId, pageable);
        
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/teams/{teamId}/messages/recent")
    public ResponseEntity<List<ChatMessage>> getRecentMessages(
            @PathVariable Long teamId,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        // Check if user is a member of the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!team.getMembers().contains(user)) {
            return ResponseEntity.status(403).build();
        }
        
        List<ChatMessage> messages = chatMessageRepository.findRecentMessagesByTeam(teamId, limit);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/teams/{teamId}/messages/search")
    public ResponseEntity<Page<ChatMessage>> searchMessages(
            @PathVariable Long teamId,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        // Check if user is a member of the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!team.getMembers().contains(user)) {
            return ResponseEntity.status(403).build();
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ChatMessage> messages = chatMessageRepository.searchMessagesInTeam(teamId, query, pageable);
        
        return ResponseEntity.ok(messages);
    }
    
    @MessageMapping("/chat/{teamId}/send")
    public void sendMessage(@DestinationVariable Long teamId,
                           @Payload @Valid ChatMessageRequest messageRequest,
                           SimpMessageHeaderAccessor headerAccessor) {
        
        // Get user from session attributes (set during WebSocket connection)
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username == null) {
            return; // User not authenticated
        }
        
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Check if user is a member of the team
        if (!team.getMembers().contains(sender)) {
            return; // User not authorized
        }
        
        // Create and save the message
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(messageRequest.getContent());
        chatMessage.setSender(sender);
        chatMessage.setTeam(team);
        chatMessage.setType(MessageType.CHAT);
        chatMessage.setCreatedAt(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        
        // Broadcast the message to all team members
        messagingTemplate.convertAndSend("/topic/teams/" + teamId + "/messages", savedMessage);
    }
    
    @MessageMapping("/chat/{teamId}/join")
    public void addUser(@DestinationVariable Long teamId,
                       SimpMessageHeaderAccessor headerAccessor) {
        
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username == null) {
            return;
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Check if user is a member of the team
        if (!team.getMembers().contains(user)) {
            return;
        }
        
        // Create join message
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setContent(user.getFullName() + " joined the chat");
        joinMessage.setSender(user);
        joinMessage.setTeam(team);
        joinMessage.setType(MessageType.JOIN);
        joinMessage.setCreatedAt(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(joinMessage);
        
        // Broadcast join message
        messagingTemplate.convertAndSend("/topic/teams/" + teamId + "/messages", savedMessage);
    }
    
    @MessageMapping("/chat/{teamId}/leave")
    public void removeUser(@DestinationVariable Long teamId,
                          SimpMessageHeaderAccessor headerAccessor) {
        
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username == null) {
            return;
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Create leave message
        ChatMessage leaveMessage = new ChatMessage();
        leaveMessage.setContent(user.getFullName() + " left the chat");
        leaveMessage.setSender(user);
        leaveMessage.setTeam(team);
        leaveMessage.setType(MessageType.LEAVE);
        leaveMessage.setCreatedAt(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(leaveMessage);
        
        // Broadcast leave message
        messagingTemplate.convertAndSend("/topic/teams/" + teamId + "/messages", savedMessage);
    }
}