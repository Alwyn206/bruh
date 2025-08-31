package com.hackmate.controller;

import com.hackmate.dto.ApiResponse;
import com.hackmate.dto.TeamCreateRequest;
import com.hackmate.dto.TeamUpdateRequest;
import com.hackmate.model.Team;
import com.hackmate.model.User;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> createTeam(@Valid @RequestBody TeamCreateRequest teamRequest,
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User creator = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setDescription(teamRequest.getDescription());
        team.setProjectDomain(teamRequest.getProjectDomain());
        team.setRequiredSkills(teamRequest.getRequiredSkills());
        team.setMaxMembers(teamRequest.getMaxMembers());
        team.setOpen(teamRequest.isOpen());
        team.setCreator(creator);
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        
        // Add creator as first member
        team.addMember(creator);
        
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.ok(savedTeam);
    }
    
    @GetMapping
    public ResponseEntity<Page<Team>> getAllTeams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Boolean isOpen) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Team> teams;
        
        if (domain != null && isOpen != null) {
            teams = teamRepository.findByProjectDomainAndIsOpen(domain, isOpen, pageable);
        } else if (domain != null) {
            teams = teamRepository.findByProjectDomain(domain, pageable);
        } else if (isOpen != null) {
            teams = teamRepository.findByIsOpen(isOpen, pageable);
        } else {
            teams = teamRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Team>> searchTeams(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> teams = teamRepository.searchTeamsByKeyword(keyword, pageable);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/available")
    public ResponseEntity<Page<Team>> getAvailableTeams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> teams = teamRepository.findAvailableTeams(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/my-teams")
    public ResponseEntity<List<Team>> getMyTeams(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Team> teams = teamRepository.findByMembersId(userPrincipal.getId());
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/created")
    public ResponseEntity<List<Team>> getCreatedTeams(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Team> teams = teamRepository.findByCreatorId(userPrincipal.getId());
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        Optional<Team> team = teamRepository.findById(id);
        return team.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id,
                                       @Valid @RequestBody TeamUpdateRequest teamRequest,
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (!optionalTeam.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Team team = optionalTeam.get();
        
        // Check if user is the creator
        if (!team.getCreator().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Only team creator can update team details"));
        }
        
        // Update team details
        if (teamRequest.getName() != null) {
            team.setName(teamRequest.getName());
        }
        if (teamRequest.getDescription() != null) {
            team.setDescription(teamRequest.getDescription());
        }
        if (teamRequest.getProjectDomain() != null) {
            team.setProjectDomain(teamRequest.getProjectDomain());
        }
        if (teamRequest.getRequiredSkills() != null) {
            team.setRequiredSkills(teamRequest.getRequiredSkills());
        }
        if (teamRequest.getMaxMembers() != null) {
            team.setMaxMembers(teamRequest.getMaxMembers());
        }
        if (teamRequest.getOpen() != null) {
            team.setOpen(teamRequest.getOpen());
        }
        
        team.setUpdatedAt(LocalDateTime.now());
        Team updatedTeam = teamRepository.save(team);
        
        return ResponseEntity.ok(updatedTeam);
    }
    
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinTeam(@PathVariable Long id,
                                     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (!optionalTeam.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Team team = optionalTeam.get();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if team is open for joining
        if (!team.isOpen()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team is not open for new members"));
        }
        
        // Check if user is already a member
        if (team.getMembers().contains(user)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "You are already a member of this team"));
        }
        
        // Check if team is full
        if (team.getMembers().size() >= team.getMaxMembers()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team is full"));
        }
        
        team.addMember(user);
        teamRepository.save(team);
        
        return ResponseEntity.ok(new ApiResponse(true, "Successfully joined the team"));
    }
    
    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveTeam(@PathVariable Long id,
                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (!optionalTeam.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Team team = optionalTeam.get();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is a member
        if (!team.getMembers().contains(user)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "You are not a member of this team"));
        }
        
        // Creator cannot leave their own team
        if (team.getCreator().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Team creator cannot leave the team. Delete the team instead."));
        }
        
        team.removeMember(user);
        teamRepository.save(team);
        
        return ResponseEntity.ok(new ApiResponse(true, "Successfully left the team"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (!optionalTeam.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Team team = optionalTeam.get();
        
        // Check if user is the creator
        if (!team.getCreator().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, "Only team creator can delete the team"));
        }
        
        teamRepository.delete(team);
        return ResponseEntity.ok(new ApiResponse(true, "Team deleted successfully"));
    }
    
    @GetMapping("/by-skills")
    public ResponseEntity<Page<Team>> getTeamsBySkills(
            @RequestParam Set<String> skills,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> teams = teamRepository.findByRequiredSkillsIn(skills, pageable);
        return ResponseEntity.ok(teams);
    }
}