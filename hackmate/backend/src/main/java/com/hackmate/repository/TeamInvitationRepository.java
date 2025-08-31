package com.hackmate.repository;

import com.hackmate.model.Team;
import com.hackmate.model.TeamInvitation;
import com.hackmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, Long> {
    
    List<TeamInvitation> findByInvitee(User invitee);
    
    List<TeamInvitation> findByInviter(User inviter);
    
    List<TeamInvitation> findByTeam(Team team);
    
    Optional<TeamInvitation> findByInvitationToken(String token);
    
    List<TeamInvitation> findByInviteeEmail(String email);
    
    @Query("SELECT ti FROM TeamInvitation ti WHERE ti.invitee = :user AND ti.status = :status")
    List<TeamInvitation> findByInviteeAndStatus(@Param("user") User user, @Param("status") TeamInvitation.InvitationStatus status);
    
    @Query("SELECT ti FROM TeamInvitation ti WHERE ti.team = :team AND ti.status = :status")
    List<TeamInvitation> findByTeamAndStatus(@Param("team") Team team, @Param("status") TeamInvitation.InvitationStatus status);
    
    @Query("SELECT ti FROM TeamInvitation ti WHERE ti.expiresAt < :now AND ti.status = 'PENDING'")
    List<TeamInvitation> findExpiredInvitations(@Param("now") LocalDateTime now);
    
    @Query("SELECT ti FROM TeamInvitation ti WHERE ti.team = :team AND ti.inviteeEmail = :email AND ti.status = 'PENDING'")
    Optional<TeamInvitation> findPendingInvitationByTeamAndEmail(@Param("team") Team team, @Param("email") String email);
    
    @Query("SELECT ti FROM TeamInvitation ti WHERE ti.team = :team AND ti.invitee = :user AND ti.status = 'PENDING'")
    Optional<TeamInvitation> findPendingInvitationByTeamAndUser(@Param("team") Team team, @Param("user") User user);
    
    Boolean existsByTeamAndInviteeEmailAndStatus(Team team, String email, TeamInvitation.InvitationStatus status);
    
    Boolean existsByTeamAndInviteeAndStatus(Team team, User invitee, TeamInvitation.InvitationStatus status);
}