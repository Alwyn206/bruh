package com.hackmate.repository;

import com.hackmate.model.Team;
import com.hackmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    List<Team> findByCreator(User creator);
    
    List<Team> findByIsOpenTrue();
    
    List<Team> findByProjectDomain(String projectDomain);
    
    @Query("SELECT t FROM Team t WHERE t.name LIKE %:name%")
    List<Team> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT t FROM Team t JOIN t.requiredSkills s WHERE s IN :skills AND t.isOpen = true")
    List<Team> findOpenTeamsByRequiredSkills(@Param("skills") Set<String> skills);
    
    @Query("SELECT t FROM Team t WHERE t.projectDomain = :domain AND t.isOpen = true")
    List<Team> findOpenTeamsByProjectDomain(@Param("domain") String domain);
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m = :user")
    List<Team> findTeamsByMember(@Param("user") User user);
    
    @Query("SELECT t FROM Team t WHERE SIZE(t.members) < t.maxMembers AND t.isOpen = true")
    List<Team> findAvailableTeams();
    
    @Query("SELECT DISTINCT t FROM Team t JOIN t.requiredSkills rs WHERE rs IN :skills AND t.projectDomain = :domain AND t.isOpen = true AND SIZE(t.members) < t.maxMembers")
    List<Team> findMatchingTeams(@Param("skills") Set<String> skills, @Param("domain") String domain);
    
    @Query("SELECT t FROM Team t WHERE t.description LIKE %:keyword% OR t.name LIKE %:keyword% OR t.projectDomain LIKE %:keyword%")
    List<Team> searchTeams(@Param("keyword") String keyword);
    
    @Query("SELECT t FROM Team t WHERE t.status = 'ACTIVE' AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    List<Team> findActiveTeamsNotMemberOf(@Param("userId") Long userId);

    // Team matching and discovery methods
    @Query("SELECT t FROM Team t WHERE t.status = 'ACTIVE' AND SIZE(t.members) < t.maxMembers AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    List<Team> findOpenTeamsNotMemberOf(@Param("userId") Long userId);

    @Query("SELECT t FROM Team t WHERE t.status = 'ACTIVE' AND SIZE(t.members) < t.maxMembers AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    Page<Team> findOpenTeamsNotMemberOf(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Team t WHERE t.status = 'ACTIVE' AND SIZE(t.members) < t.maxMembers AND t.projectDomain = :domain AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    Page<Team> findOpenTeamsByDomain(@Param("domain") String domain, @Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT t FROM Team t JOIN t.requiredSkills rs WHERE t.status = 'ACTIVE' AND SIZE(t.members) < t.maxMembers AND rs.skillName IN :skills AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    Page<Team> findOpenTeamsBySkills(@Param("skills") List<String> skills, @Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT t FROM Team t JOIN t.requiredSkills rs WHERE t.status = 'ACTIVE' AND SIZE(t.members) < t.maxMembers AND t.projectDomain = :domain AND rs.skillName IN :skills AND t.id NOT IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.user.id = :userId)")
    Page<Team> findOpenTeamsByDomainAndSkills(@Param("domain") String domain, @Param("skills") List<String> skills, @Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t.projectDomain, COUNT(t) FROM Team t WHERE t.createdAt >= :since GROUP BY t.projectDomain ORDER BY COUNT(t) DESC")
    List<Object[]> findTrendingDomains(@Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT t.projectDomain, COUNT(t) FROM Team t WHERE t.createdAt >= CURRENT_DATE - 30 GROUP BY t.projectDomain ORDER BY COUNT(t) DESC")
    List<Object[]> findTrendingDomains(Pageable pageable);

    @Query("SELECT rs.skillName, COUNT(rs) FROM Team t JOIN t.requiredSkills rs GROUP BY rs.skillName ORDER BY COUNT(rs) DESC")
    List<Object[]> findPopularSkills(Pageable pageable);
}