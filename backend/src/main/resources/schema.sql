-- HackMate Database Schema
-- MySQL Database Setup Script

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hackmate_db;
USE hackmate_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(255),
    provider ENUM('LOCAL', 'GOOGLE') DEFAULT 'LOCAL',
    provider_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_provider (provider)
);

-- User skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id BIGINT NOT NULL,
    skill VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_skill (skill)
);

-- User interests table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_interests (
    user_id BIGINT NOT NULL,
    interest VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, interest),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_interest (interest)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    project_domain VARCHAR(50),
    max_members INT DEFAULT 5,
    is_open BOOLEAN DEFAULT TRUE,
    creator_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creator (creator_id),
    INDEX idx_domain (project_domain),
    INDEX idx_open (is_open),
    INDEX idx_created_at (created_at)
);

-- Team required skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS team_required_skills (
    team_id BIGINT NOT NULL,
    skill VARCHAR(50) NOT NULL,
    PRIMARY KEY (team_id, skill),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    INDEX idx_skill (skill)
);

-- Team members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS team_members (
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_team (team_id),
    INDEX idx_user (user_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    type ENUM('CHAT', 'JOIN', 'LEAVE', 'SYSTEM') DEFAULT 'CHAT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    INDEX idx_team_created (team_id, created_at),
    INDEX idx_sender (sender_id),
    INDEX idx_type (type)
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    inviter_id BIGINT NOT NULL,
    invitee_id BIGINT,
    invitee_email VARCHAR(100),
    invitee_phone VARCHAR(20),
    status ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED') DEFAULT 'PENDING',
    type ENUM('EMAIL', 'PHONE', 'DIRECT') NOT NULL,
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invitee_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_team (team_id),
    INDEX idx_inviter (inviter_id),
    INDEX idx_invitee (invitee_id),
    INDEX idx_token (invitation_token),
    INDEX idx_status (status),
    INDEX idx_expires (expires_at)
);

-- Insert some sample data for testing
-- Sample users
INSERT IGNORE INTO users (username, email, full_name, provider) VALUES
('john_doe', 'john@example.com', 'John Doe', 'LOCAL'),
('jane_smith', 'jane@example.com', 'Jane Smith', 'LOCAL'),
('mike_wilson', 'mike@example.com', 'Mike Wilson', 'LOCAL');

-- Sample skills
INSERT IGNORE INTO user_skills (user_id, skill) VALUES
(1, 'JavaScript'),
(1, 'React'),
(1, 'Node.js'),
(2, 'Python'),
(2, 'Django'),
(2, 'Machine Learning'),
(3, 'Java'),
(3, 'Spring Boot'),
(3, 'MySQL');

-- Sample interests
INSERT IGNORE INTO user_interests (user_id, interest) VALUES
(1, 'Web Development'),
(1, 'Mobile Apps'),
(2, 'AI/ML'),
(2, 'Data Science'),
(3, 'Backend Development'),
(3, 'DevOps');

-- Sample teams
INSERT IGNORE INTO teams (name, description, project_domain, creator_id) VALUES
('AI Chatbot Team', 'Building an intelligent chatbot for customer service', 'Artificial Intelligence', 2),
('E-commerce Platform', 'Creating a modern e-commerce solution', 'Web Development', 1),
('Mobile Game Dev', 'Developing a multiplayer mobile game', 'Game Development', 3);

-- Sample team members
INSERT IGNORE INTO team_members (team_id, user_id) VALUES
(1, 2), -- Creator is automatically a member
(1, 3),
(2, 1), -- Creator is automatically a member
(2, 3),
(3, 3); -- Creator is automatically a member

-- Sample required skills for teams
INSERT IGNORE INTO team_required_skills (team_id, skill) VALUES
(1, 'Python'),
(1, 'Machine Learning'),
(1, 'NLP'),
(2, 'JavaScript'),
(2, 'React'),
(2, 'Node.js'),
(3, 'Unity'),
(3, 'C#'),
(3, 'Game Design');

COMMIT;