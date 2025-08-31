package com.hackmate.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class TeamUpdateRequest {
    
    @Size(max = 100)
    private String name;
    
    @Size(max = 1000)
    private String description;
    
    @Size(max = 50)
    private String projectDomain;
    
    private Set<String> requiredSkills;
    
    @Min(2)
    @Max(20)
    private Integer maxMembers;
    
    private Boolean isOpen;
    
    // Constructors
    public TeamUpdateRequest() {}
    
    // Getters and Setters
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
    
    public Integer getMaxMembers() {
        return maxMembers;
    }
    
    public void setMaxMembers(Integer maxMembers) {
        this.maxMembers = maxMembers;
    }
    
    public Boolean getOpen() {
        return isOpen;
    }
    
    public void setOpen(Boolean open) {
        isOpen = open;
    }
}