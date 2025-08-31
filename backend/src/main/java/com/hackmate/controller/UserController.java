package com.hackmate.controller;

import com.hackmate.dto.ApiResponse;
import com.hackmate.dto.UserProfileUpdateRequest;
import com.hackmate.model.User;
import com.hackmate.repository.UserRepository;
import com.hackmate.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@Valid @RequestBody UserProfileUpdateRequest updateRequest,
                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user profile
        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if (updateRequest.getSkills() != null) {
            user.setSkills(updateRequest.getSkills());
        }
        if (updateRequest.getInterests() != null) {
            user.setInterests(updateRequest.getInterests());
        }
        if (updateRequest.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateRequest.getProfileImageUrl());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String name,
                                                  @RequestParam(required = false) Set<String> skills,
                                                  @RequestParam(required = false) Set<String> interests) {
        List<User> users;
        
        if (name != null && !name.trim().isEmpty()) {
            users = userRepository.findByFullNameContaining(name.trim());
        } else if (skills != null && !skills.isEmpty() && interests != null && !interests.isEmpty()) {
            users = userRepository.findBySkillsAndInterests(skills, interests);
        } else if (skills != null && !skills.isEmpty()) {
            users = userRepository.findBySkillsIn(skills);
        } else if (interests != null && !interests.isEmpty()) {
            users = userRepository.findByInterestsIn(interests);
        } else {
            users = userRepository.findAll();
        }
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
        return ResponseEntity.ok(new ApiResponse(true, "User account deleted successfully"));
    }
}