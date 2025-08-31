package com.hackmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teams")
public class Team {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 1000)
    private String description;
    
    @NotBlank
    @Size(max = 100)
    private String projectDomain;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "team_required_skills", joinColumns = @JoinColumn(name = "team_id"))
    @Column(name = "skill")
    private Set<String> requiredSkills = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "team_members",
        joinColumns = @JoinColumn(name = "team_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ChatMessage> chatMessages = new HashSet<>();
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TeamInvitation> invitations = new HashSet<>();
    
    private int maxMembers = 10;
    
    private boolean isOpen = true;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public Team() {}
    
    public Team(String name, String description, String projectDomain, User creator) {
        this.name = name;
        this.description = description;
        this.projectDomain = projectDomain;
        this.creator = creator;
        this.members.add(creator);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getProjectDomain() {
        return projectDomain;
    }
    
    public void setProjectDomain(String projectDomain) {
        this.projectDomain = projectDomain;
    }
    
    public Set<String> getRequiredSkills() {
        return requiredSkills;
    }
    
    public void setRequiredSkills(Set<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
    
    public User getCreator() {
        return creator;
    }
    
    public void setCreator(User creator) {
        this.creator = creator;
    }
    
    public Set<User> getMembers() {
        return members;
    }
    
    public void setMembers(Set<User> members) {
        this.members = members;
    }
    
    public Set<ChatMessage> getChatMessages() {
        return chatMessages;
    }
    
    public void setChatMessages(Set<ChatMessage> chatMessages) {
        this.chatMessages = chatMessages;
    }
    
    public Set<TeamInvitation> getInvitations() {
        return invitations;
    }
    
    public void setInvitations(Set<TeamInvitation> invitations) {
        this.invitations = invitations;
    }
    
    public int getMaxMembers() {
        return maxMembers;
    }
    
    public void setMaxMembers(int maxMembers) {
        this.maxMembers = maxMembers;
    }
    
    public boolean isOpen() {
        return isOpen;
    }
    
    public void setOpen(boolean open) {
        isOpen = open;
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
    public boolean isFull() {
        return members.size() >= maxMembers;
    }
    
    public boolean isMember(User user) {
        return members.contains(user);
    }
    
    public void addMember(User user) {
        if (!isFull() && !isMember(user)) {
            members.add(user);
            user.getTeams().add(this);
        }
    }
    
    public void removeMember(User user) {
        members.remove(user);
        user.getTeams().remove(this);
    }
}