package com.hackmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {
    
    @NotBlank
    @Size(max = 1000)
    private String content;
    
    // Constructors
    public ChatMessageRequest() {}
    
    public ChatMessageRequest(String content) {
        this.content = content;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}