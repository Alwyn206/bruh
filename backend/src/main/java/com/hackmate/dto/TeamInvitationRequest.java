package com.hackmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class TeamInvitationRequest {
    
    @NotNull
    private Long teamId;
    
    private Long inviteeId; // For direct user invitation
    
    @Email
    private String inviteeEmail; // For email invitation
    
    private String inviteePhone; // For phone invitation
    
    // Constructors
    public TeamInvitationRequest() {}
    
    public TeamInvitationRequest(Long teamId, Long inviteeId) {
        this.teamId = teamId;
        this.inviteeId = inviteeId;
    }
    
    public TeamInvitationRequest(Long teamId, String inviteeEmail, String inviteePhone) {
        this.teamId = teamId;
        this.inviteeEmail = inviteeEmail;
        this.inviteePhone = inviteePhone;
    }
    
    // Getters and Setters
    public Long getTeamId() {
        return teamId;
    }
    
    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
    
    public Long getInviteeId() {
        return inviteeId;
    }
    
    public void setInviteeId(Long inviteeId) {
        this.inviteeId = inviteeId;
    }
    
    public String getInviteeEmail() {
        return inviteeEmail;
    }
    
    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }
    
    public String getInviteePhone() {
        return inviteePhone;
    }
    
    public void setInviteePhone(String inviteePhone) {
        this.inviteePhone = inviteePhone;
    }
}