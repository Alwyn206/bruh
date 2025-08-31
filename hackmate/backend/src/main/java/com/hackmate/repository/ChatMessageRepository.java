package com.hackmate.repository;

import com.hackmate.model.ChatMessage;
import com.hackmate.model.Team;
import com.hackmate.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByTeamOrderByCreatedAtAsc(Team team);
    
    Page<ChatMessage> findByTeamOrderByCreatedAtDesc(Team team, Pageable pageable);
    
    List<ChatMessage> findBySender(User sender);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.team = :team AND cm.createdAt >= :since ORDER BY cm.createdAt ASC")
    List<ChatMessage> findRecentMessages(@Param("team") Team team, @Param("since") LocalDateTime since);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.team = :team AND cm.content LIKE %:keyword%")
    List<ChatMessage> searchMessagesInTeam(@Param("team") Team team, @Param("keyword") String keyword);
    
    Long countByTeam(Team team);
    
    void deleteByTeam(Team team);
}