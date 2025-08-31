package com.hackmate.service;

import com.hackmate.entity.Team;
import com.hackmate.entity.User;
import com.hackmate.entity.UserSkill;
import com.hackmate.repository.TeamRepository;
import com.hackmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamMatchingService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Find teams that match user's skills and interests
     */
    public List<Team> findMatchingTeams(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user's skills
        Set<String> userSkills = user.getSkills().stream()
                .map(UserSkill::getSkillName)
                .collect(Collectors.toSet());

        // Get user's interests
        Set<String> userInterests = user.getInterests().stream()
                .map(interest -> interest.getInterestName())
                .collect(Collectors.toSet());

        // Find all open teams that user is not already a member of
        List<Team> availableTeams = teamRepository.findOpenTeamsNotMemberOf(userId);

        // Calculate match scores and sort
        List<TeamMatchScore> matchScores = availableTeams.stream()
                .map(team -> new TeamMatchScore(team, calculateMatchScore(team, userSkills, userInterests)))
                .filter(score -> score.getScore() > 0) // Only include teams with some match
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());

        return matchScores.stream()
                .map(TeamMatchScore::getTeam)
                .collect(Collectors.toList());
    }

    /**
     * Find users that would be good matches for a team
     */
    public List<User> findMatchingUsers(Long teamId, int limit) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Get team's required skills
        Set<String> requiredSkills = team.getRequiredSkills().stream()
                .map(skill -> skill.getSkillName())
                .collect(Collectors.toSet());

        // Get current team member IDs
        Set<Long> currentMemberIds = team.getMembers().stream()
                .map(member -> member.getUser().getId())
                .collect(Collectors.toSet());

        // Find all users not in the team
        List<User> availableUsers = userRepository.findUsersNotInTeam(teamId);

        // Calculate match scores and sort
        List<UserMatchScore> matchScores = availableUsers.stream()
                .map(user -> new UserMatchScore(user, calculateUserMatchScore(user, requiredSkills, team.getProjectDomain())))
                .filter(score -> score.getScore() > 0)
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());

        return matchScores.stream()
                .map(UserMatchScore::getUser)
                .collect(Collectors.toList());
    }

    /**
     * Get recommended teams for discovery page with filtering
     */
    public Page<Team> getRecommendedTeams(Long userId, String domain, List<String> skills, 
                                         String sortBy, Pageable pageable) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        // Build dynamic query based on filters
        if (domain != null && !domain.isEmpty() && skills != null && !skills.isEmpty()) {
            return teamRepository.findOpenTeamsByDomainAndSkills(domain, skills, userId, pageable);
        } else if (domain != null && !domain.isEmpty()) {
            return teamRepository.findOpenTeamsByDomain(domain, userId, pageable);
        } else if (skills != null && !skills.isEmpty()) {
            return teamRepository.findOpenTeamsBySkills(skills, userId, pageable);
        } else {
            return teamRepository.findOpenTeamsNotMemberOf(userId, pageable);
        }
    }

    /**
     * Calculate match score between a team and user's skills/interests
     */
    private double calculateMatchScore(Team team, Set<String> userSkills, Set<String> userInterests) {
        double score = 0.0;

        // Get team's required skills
        Set<String> requiredSkills = team.getRequiredSkills().stream()
                .map(skill -> skill.getSkillName())
                .collect(Collectors.toSet());

        // Skill match score (70% weight)
        if (!requiredSkills.isEmpty()) {
            long matchingSkills = requiredSkills.stream()
                    .mapToLong(skill -> userSkills.contains(skill) ? 1 : 0)
                    .sum();
            double skillMatchRatio = (double) matchingSkills / requiredSkills.size();
            score += skillMatchRatio * 0.7;
        }

        // Domain/Interest match score (20% weight)
        if (team.getProjectDomain() != null && userInterests.contains(team.getProjectDomain())) {
            score += 0.2;
        }

        // Team activity and availability score (10% weight)
        double availabilityScore = calculateAvailabilityScore(team);
        score += availabilityScore * 0.1;

        return score;
    }

    /**
     * Calculate match score for a user against team requirements
     */
    private double calculateUserMatchScore(User user, Set<String> requiredSkills, String projectDomain) {
        double score = 0.0;

        // Get user's skills
        Set<String> userSkills = user.getSkills().stream()
                .map(UserSkill::getSkillName)
                .collect(Collectors.toSet());

        // Skill match score (80% weight)
        if (!requiredSkills.isEmpty()) {
            long matchingSkills = requiredSkills.stream()
                    .mapToLong(skill -> userSkills.contains(skill) ? 1 : 0)
                    .sum();
            double skillMatchRatio = (double) matchingSkills / requiredSkills.size();
            score += skillMatchRatio * 0.8;
        }

        // Interest match score (20% weight)
        Set<String> userInterests = user.getInterests().stream()
                .map(interest -> interest.getInterestName())
                .collect(Collectors.toSet());
        
        if (projectDomain != null && userInterests.contains(projectDomain)) {
            score += 0.2;
        }

        return score;
    }

    /**
     * Calculate team availability score based on open slots and activity
     */
    private double calculateAvailabilityScore(Team team) {
        int currentMembers = team.getMembers().size();
        int maxMembers = team.getMaxMembers();
        
        if (currentMembers >= maxMembers) {
            return 0.0; // Team is full
        }
        
        // Higher score for teams with more available slots
        double availabilityRatio = (double) (maxMembers - currentMembers) / maxMembers;
        
        // Bonus for newer teams (more likely to be active)
        long daysSinceCreation = java.time.Duration.between(
            team.getCreatedAt().toInstant(),
            java.time.Instant.now()
        ).toDays();
        
        double recencyBonus = Math.max(0, 1.0 - (daysSinceCreation / 30.0)); // Decay over 30 days
        
        return (availabilityRatio * 0.7) + (recencyBonus * 0.3);
    }

    /**
     * Get trending domains based on recent team creation activity
     */
    public List<String> getTrendingDomains(int limit) {
        return teamRepository.findTrendingDomains(PageRequest.of(0, limit))
                .stream()
                .map(result -> (String) result[0])
                .collect(Collectors.toList());
    }

    /**
     * Get popular skills based on team requirements
     */
    public List<String> getPopularSkills(int limit) {
        return teamRepository.findPopularSkills(PageRequest.of(0, limit))
                .stream()
                .map(result -> (String) result[0])
                .collect(Collectors.toList());
    }

    // Helper classes for scoring
    private static class TeamMatchScore {
        private final Team team;
        private final double score;

        public TeamMatchScore(Team team, double score) {
            this.team = team;
            this.score = score;
        }

        public Team getTeam() { return team; }
        public double getScore() { return score; }
    }

    private static class UserMatchScore {
        private final User user;
        private final double score;

        public UserMatchScore(User user, double score) {
            this.user = user;
            this.score = score;
        }

        public User getUser() { return user; }
        public double getScore() { return score; }
    }
}