package com.hackmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_invitations")
public class TeamInvitation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_id")
    private User invitee;
    
    @Email
    private String inviteeEmail;
    
    private String inviteePhone;
    
    @Enumerated(EnumType.STRING)
    private InvitationStatus status = InvitationStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    private InvitationType type = InvitationType.EMAIL;
    
    private String invitationToken;
    
    private LocalDateTime expiresAt;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public TeamInvitation() {}
    
    public TeamInvitation(Team team, User inviter, String inviteeEmail) {
        this.team = team;
        this.inviter = inviter;
        this.inviteeEmail = inviteeEmail;
        this.type = InvitationType.EMAIL;
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }
    
    public TeamInvitation(Team team, User inviter, User invitee) {
        this.team = team;
        this.inviter = inviter;
        this.invitee = invitee;
        this.type = InvitationType.DIRECT;
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Team getTeam() {
        return team;
    }
    
    public void setTeam(Team team) {
        this.team = team;
    }
    
    public User getInviter() {
        return inviter;
    }
    
    public void setInviter(User inviter) {
        this.inviter = inviter;
    }
    
    public User getInvitee() {
        return invitee;
    }
    
    public void setInvitee(User invitee) {
        this.invitee = invitee;
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
    
    public InvitationStatus getStatus() {
        return status;
    }
    
    public void setStatus(InvitationStatus status) {
        this.status = status;
    }
    
    public InvitationType getType() {
        return type;
    }
    
    public void setType(InvitationType type) {
        this.type = type;
    }
    
    public String getInvitationToken() {
        return invitationToken;
    }
    
    public void setInvitationToken(String invitationToken) {
        this.invitationToken = invitationToken;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public enum InvitationStatus {
        PENDING,
        ACCEPTED,
        DECLINED,
        EXPIRED
    }
    
    public enum InvitationType {
        EMAIL,
        PHONE,
        DIRECT
    }
}