package com.hackmate.controller;

import com.hackmate.dto.TeamDiscoveryDTO;
import com.hackmate.entity.Team;
import com.hackmate.entity.User;
import com.hackmate.service.TeamMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamMatchingController {

    @Autowired
    private TeamMatchingService teamMatchingService;

    /**
     * Get personalized team recommendations for the current user
     */
    @GetMapping("/teams/recommended")
    public ResponseEntity<List<TeamDiscoveryDTO>> getRecommendedTeams(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        
        Long userId = Long.parseLong(authentication.getName());
        List<Team> recommendedTeams = teamMatchingService.findMatchingTeams(userId, limit);
        
        List<TeamDiscoveryDTO> teamDTOs = recommendedTeams.stream()
                .map(TeamDiscoveryDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(teamDTOs);
    }

    /**
     * Get user recommendations for a specific team
     */
    @GetMapping("/users/recommended/{teamId}")
    public ResponseEntity<List<User>> getRecommendedUsers(
            @PathVariable Long teamId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<User> recommendedUsers = teamMatchingService.findMatchingUsers(teamId, limit);
        return ResponseEntity.ok(recommendedUsers);
    }

    /**
     * Discover teams with filtering and sorting options
     */
    @GetMapping("/teams/discover")
    public ResponseEntity<Page<TeamDiscoveryDTO>> discoverTeams(
            Authentication authentication,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Long userId = Long.parseLong(authentication.getName());
        
        // Create sort object
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Team> teams = teamMatchingService.getRecommendedTeams(userId, domain, skills, sortBy, pageable);
        Page<TeamDiscoveryDTO> teamDTOs = teams.map(TeamDiscoveryDTO::new);
        
        return ResponseEntity.ok(teamDTOs);
    }

    /**
     * Get trending project domains
     */
    @GetMapping("/trending/domains")
    public ResponseEntity<List<String>> getTrendingDomains(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<String> trendingDomains = teamMatchingService.getTrendingDomains(limit);
        return ResponseEntity.ok(trendingDomains);
    }

    /**
     * Get popular skills across teams
     */
    @GetMapping("/popular/skills")
    public ResponseEntity<List<String>> getPopularSkills(
            @RequestParam(defaultValue = "15") int limit) {
        
        List<String> popularSkills = teamMatchingService.getPopularSkills(limit);
        return ResponseEntity.ok(popularSkills);
    }

    /**
     * Get matching statistics for a user
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMatchingStats(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        
        // Get basic matching stats
        List<Team> recommendedTeams = teamMatchingService.findMatchingTeams(userId, 50);
        List<String> trendingDomains = teamMatchingService.getTrendingDomains(5);
        List<String> popularSkills = teamMatchingService.getPopularSkills(10);
        
        Map<String, Object> stats = Map.of(
            "totalRecommendedTeams", recommendedTeams.size(),
            "trendingDomains", trendingDomains,
            "popularSkills", popularSkills,
            "hasRecommendations", !recommendedTeams.isEmpty()
        );
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Get team discovery filters (domains and skills available)
     */
    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getDiscoveryFilters() {
        List<String> availableDomains = teamMatchingService.getTrendingDomains(20);
        List<String> availableSkills = teamMatchingService.getPopularSkills(30);
        
        Map<String, Object> filters = Map.of(
            "domains", availableDomains,
            "skills", availableSkills
        );
        
        return ResponseEntity.ok(filters);
    }
}