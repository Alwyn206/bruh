package com.hackmate.repository;

import com.hackmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.email = :email OR u.username = :username")
    Optional<User> findByEmailOrUsername(@Param("email") String email, @Param("username") String username);
    
    @Query("SELECT u FROM User u WHERE u.id NOT IN (SELECT tm.user.id FROM TeamMember tm WHERE tm.team.id = :teamId)")
    List<User> findUsersNotInTeam(@Param("teamId") Long teamId);
    
    @Query("SELECT u FROM User u JOIN u.skills s WHERE s IN :skills")
    List<User> findBySkillsIn(@Param("skills") Set<String> skills);
    
    @Query("SELECT u FROM User u JOIN u.interests i WHERE i IN :interests")
    List<User> findByInterestsIn(@Param("interests") Set<String> interests);
    
    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:name%")
    List<User> findByFullNameContaining(@Param("name") String name);
    
    @Query("SELECT DISTINCT u FROM User u JOIN u.skills s JOIN u.interests i WHERE s IN :skills AND i IN :interests")
    List<User> findBySkillsAndInterests(@Param("skills") Set<String> skills, @Param("interests") Set<String> interests);
}