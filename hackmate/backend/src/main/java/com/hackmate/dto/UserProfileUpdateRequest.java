package com.hackmate.dto;

import jakarta.validation.constraints.Size;

import java.util.Set;

public class UserProfileUpdateRequest {
    
    @Size(max = 100)
    private String fullName;
    
    @Size(max = 500)
    private String bio;
    
    @Size(max = 20)
    private String phoneNumber;
    
    @Size(max = 255)
    private String profileImageUrl;
    
    private Set<String> skills;
    
    private Set<String> interests;
    
    // Constructors
    public UserProfileUpdateRequest() {}
    
    // Getters and Setters
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public Set<String> getSkills() {
        return skills;
    }
    
    public void setSkills(Set<String> skills) {
        this.skills = skills;
    }
    
    public Set<String> getInterests() {
        return interests;
    }
    
    public void setInterests(Set<String> interests) {
        this.interests = interests;
    }
}