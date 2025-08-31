package com.hackmate.controller;

import com.hackmate.dto.ApiResponse;
import com.hackmate.dto.TeamInvitationRequest;
import com.hackmate.model.*;
import com.hackmate.repository.TeamInvitationRepository;
import com.hackmate.repository.TeamRepository;
import com.hackmate.repository.UserRepository;
import com.hackmate.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/invitations")
public class TeamInvitationController {
    
    @Autowired
    private TeamInvitationRepository invitationRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> sendInvitation(@Valid @RequestBody TeamInvitationRequest invitationRequest,
                                           @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Team team = teamRepository.findById(invitationRequest.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User inviter = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is a member of the team
        if (!team.getMembers().contains(inviter)) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Only team members can send invitations"));
        }
        
        // Check if team is full
        if (team.getMembers().size() >= team.getMaxMembers()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team is full"));
        }
        
        TeamInvitation invitation = new TeamInvitation();
        invitation.setTeam(team);
        invitation.setInviter(inviter);
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setInvitationToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7)); // Expires in 7 days
        invitation.setCreatedAt(LocalDateTime.now());
        invitation.setUpdatedAt(LocalDateTime.now());
        
        // Handle different invitation types
        if (invitationRequest.getInviteeId() != null) {
            // Direct invitation to existing user
            User invitee = userRepository.findById(invitationRequest.getInviteeId())
                    .orElseThrow(() -> new RuntimeException("Invitee not found"));
            
            // Check if user is already a member
            if (team.getMembers().contains(invitee)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "User is already a member of this team"));
            }
            
            // Check if there's already a pending invitation
            if (invitationRepository.existsPendingInvitationByTeamAndUser(team.getId(), invitee.getId())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Invitation already sent to this user"));
            }
            
            invitation.setInvitee(invitee);
            invitation.setType(InvitationType.DIRECT);
            
        } else if (invitationRequest.getInviteeEmail() != null) {
            // Email invitation
            // Check if there's already a pending invitation for this email
            if (invitationRepository.existsPendingInvitationByTeamAndEmail(team.getId(), invitationRequest.getInviteeEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Invitation already sent to this email"));
            }
            
            invitation.setInviteeEmail(invitationRequest.getInviteeEmail());
            invitation.setType(InvitationType.EMAIL);
            
        } else if (invitationRequest.getInviteePhone() != null) {
            // Phone invitation
            invitation.setInviteePhone(invitationRequest.getInviteePhone());
            invitation.setType(InvitationType.PHONE);
            
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Must provide invitee ID, email, or phone number"));
        }
        
        TeamInvitation savedInvitation = invitationRepository.save(invitation);
        
        // TODO: Send actual email/SMS notification here
        
        return ResponseEntity.ok(new ApiResponse(true, "Invitation sent successfully"));
    }
    
    @GetMapping("/received")
    public ResponseEntity<List<TeamInvitation>> getReceivedInvitations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        List<TeamInvitation> invitations = invitationRepository.findByInviteeId(userPrincipal.getId());
        return ResponseEntity.ok(invitations);
    }
    
    @GetMapping("/sent")
    public ResponseEntity<List<TeamInvitation>> getSentInvitations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        List<TeamInvitation> invitations = invitationRepository.findByInviterId(userPrincipal.getId());
        return ResponseEntity.ok(invitations);
    }
    
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<List<TeamInvitation>> getTeamInvitations(
            @PathVariable Long teamId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Check if user is a member of the team
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!team.getMembers().contains(user)) {
            return ResponseEntity.status(403).build();
        }
        
        List<TeamInvitation> invitations = invitationRepository.findByTeamId(teamId);
        return ResponseEntity.ok(invitations);
    }
    
    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable Long invitationId,
                                             @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        TeamInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // Check if invitation is for the current user
        if (invitation.getInvitee() == null || !invitation.getInvitee().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "This invitation is not for you"));
        }
        
        // Check if invitation is still pending
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invitation is no longer pending"));
        }
        
        // Check if invitation is expired
        if (invitation.isExpired()) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invitation has expired"));
        }
        
        Team team = invitation.getTeam();
        User user = invitation.getInvitee();
        
        // Check if team is full
        if (team.getMembers().size() >= team.getMaxMembers()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team is full"));
        }
        
        // Check if user is already a member
        if (team.getMembers().contains(user)) {
            invitation.setStatus(InvitationStatus.ACCEPTED);
            invitation.setUpdatedAt(LocalDateTime.now());
            invitationRepository.save(invitation);
            return ResponseEntity.ok(new ApiResponse(true, "You are already a member of this team"));
        }
        
        // Add user to team
        team.addMember(user);
        teamRepository.save(team);
        
        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setUpdatedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        
        return ResponseEntity.ok(new ApiResponse(true, "Invitation accepted successfully"));
    }
    
    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<?> declineInvitation(@PathVariable Long invitationId,
                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        TeamInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        // Check if invitation is for the current user
        if (invitation.getInvitee() == null || !invitation.getInvitee().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "This invitation is not for you"));
        }
        
        // Check if invitation is still pending
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invitation is no longer pending"));
        }
        
        // Update invitation status
        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setUpdatedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        
        return ResponseEntity.ok(new ApiResponse(true, "Invitation declined"));
    }
    
    @GetMapping("/token/{token}")
    public ResponseEntity<TeamInvitation> getInvitationByToken(@PathVariable String token) {
        Optional<TeamInvitation> invitation = invitationRepository.findByInvitationToken(token);
        return invitation.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/token/{token}/accept")
    public ResponseEntity<?> acceptInvitationByToken(@PathVariable String token,
                                                    @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        TeamInvitation invitation = invitationRepository.findByInvitationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));
        
        // Check if invitation is still pending
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invitation is no longer pending"));
        }
        
        // Check if invitation is expired
        if (invitation.isExpired()) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invitation has expired"));
        }
        
        Team team = invitation.getTeam();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if team is full
        if (team.getMembers().size() >= team.getMaxMembers()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team is full"));
        }
        
        // Check if user is already a member
        if (team.getMembers().contains(user)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "You are already a member of this team"));
        }
        
        // For email/phone invitations, set the invitee
        if (invitation.getInvitee() == null) {
            invitation.setInvitee(user);
        }
        
        // Add user to team
        team.addMember(user);
        teamRepository.save(team);
        
        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setUpdatedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        
        return ResponseEntity.ok(new ApiResponse(true, "Invitation accepted successfully"));
    }
}