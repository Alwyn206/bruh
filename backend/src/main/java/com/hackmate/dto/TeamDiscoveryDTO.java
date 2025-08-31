package com.hackmate.dto;

import com.hackmate.entity.Team;
import com.hackmate.entity.TeamMember;
import com.hackmate.entity.TeamSkill;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TeamDiscoveryDTO {
    private Long id;
    private String name;
    private String description;
    private String projectDomain;
    private int maxMembers;
    private int currentMembers;
    private LocalDateTime createdAt;
    private String leaderName;
    private String leaderUsername;
    private List<String> requiredSkills;
    private List<TeamMemberDTO> members;
    private String status;
    private double matchScore; // For personalized recommendations

    // Default constructor
    public TeamDiscoveryDTO() {}

    // Constructor from Team entity
    public TeamDiscoveryDTO(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.description = team.getDescription();
        this.projectDomain = team.getProjectDomain();
        this.maxMembers = team.getMaxMembers();
        this.currentMembers = team.getMembers().size();
        this.createdAt = team.getCreatedAt();
        this.status = team.getStatus().toString();
        
        // Get leader information
        TeamMember leader = team.getMembers().stream()
                .filter(member -> "LEADER".equals(member.getRole()))
                .findFirst()
                .orElse(null);
        
        if (leader != null) {
            this.leaderName = leader.getUser().getFullName();
            this.leaderUsername = leader.getUser().getUsername();
        }
        
        // Get required skills
        this.requiredSkills = team.getRequiredSkills().stream()
                .map(TeamSkill::getSkillName)
                .collect(Collectors.toList());
        
        // Get member information
        this.members = team.getMembers().stream()
                .map(TeamMemberDTO::new)
                .collect(Collectors.toList());
    }

    // Constructor with match score
    public TeamDiscoveryDTO(Team team, double matchScore) {
        this(team);
        this.matchScore = matchScore;
    }

    // Getters and setters
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

    public int getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(int maxMembers) {
        this.maxMembers = maxMembers;
    }

    public int getCurrentMembers() {
        return currentMembers;
    }

    public void setCurrentMembers(int currentMembers) {
        this.currentMembers = currentMembers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public String getLeaderUsername() {
        return leaderUsername;
    }

    public void setLeaderUsername(String leaderUsername) {
        this.leaderUsername = leaderUsername;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<TeamMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberDTO> members) {
        this.members = members;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    // Helper method to check if team has available slots
    public boolean hasAvailableSlots() {
        return currentMembers < maxMembers;
    }

    // Helper method to get available slots count
    public int getAvailableSlots() {
        return maxMembers - currentMembers;
    }

    // Helper method to get match percentage (for display)
    public int getMatchPercentage() {
        return (int) Math.round(matchScore * 100);
    }
}