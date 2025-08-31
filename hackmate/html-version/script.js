// HackMate JavaScript - Vanilla JS Implementation

// Global State Management
const AppState = {
    currentUser: null,
    teams: [],
    messages: {},
    activeSection: 'home',
    activeChatTeam: null,
    init() {
        this.loadFromStorage();
        this.initializeMockData();
    },
    
    loadFromStorage() {
        const user = localStorage.getItem('hackmate_user');
        const teams = localStorage.getItem('hackmate_teams');
        const messages = localStorage.getItem('hackmate_messages');
        
        if (user) this.currentUser = JSON.parse(user);
        if (teams) this.teams = JSON.parse(teams);
        if (messages) this.messages = JSON.parse(messages);
    },
    
    saveToStorage() {
        if (this.currentUser) {
            localStorage.setItem('hackmate_user', JSON.stringify(this.currentUser));
        }
        localStorage.setItem('hackmate_teams', JSON.stringify(this.teams));
        localStorage.setItem('hackmate_messages', JSON.stringify(this.messages));
    },
    
    initializeMockData() {
        if (this.teams.length === 0) {
            this.teams = [
                {
                    id: 1,
                    name: "Web Warriors",
                    description: "Building the next generation of web applications",
                    skills: ["JavaScript", "React", "Node.js", "CSS"],
                    members: [
                        { name: "Alice Johnson", role: "Frontend Developer", avatar: "A", avatarColor: "#7289da" },
                        { name: "Bob Smith", role: "Backend Developer", avatar: "B", avatarColor: "#43b581" },
                        { name: "Carol Davis", role: "UI/UX Designer", avatar: "C", avatarColor: "#f04747" }
                    ],
                    maxSize: 5,
                    createdBy: "Alice Johnson"
                },
                {
                    id: 2,
                    name: "AI Innovators",
                    description: "Exploring the frontiers of artificial intelligence",
                    skills: ["Python", "TensorFlow", "Machine Learning", "Data Science"],
                    members: [
                        { name: "David Wilson", role: "ML Engineer", avatar: "D", avatarColor: "#faa61a" },
                        { name: "Eva Brown", role: "Data Scientist", avatar: "E", avatarColor: "#99aab5" }
                    ],
                    maxSize: 4,
                    createdBy: "David Wilson"
                },
                {
                    id: 3,
                    name: "Mobile First Team",
                    description: "Creating beautiful, performant mobile applications that solve real-world problems.",
                    skills: ["React Native", "Flutter", "Firebase", "UI/UX"],
                    members: ["Frank Miller"],
                    maxSize: 6,
                    createdBy: "Frank Miller"
                }
            ];
        }
        
        if (Object.keys(this.messages).length === 0) {
            this.messages = {
                1: [
                    {
                        id: 1,
                        author: "Alice Johnson",
                        text: "Welcome to the AI Innovation Squad! Let's build something amazing together.",
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        avatar: "A",
                        avatarColor: "#7289da"
                    },
                    {
                        id: 2,
                        author: "Bob Smith",
                        text: "Excited to work on this project! I've been experimenting with some new ML models.",
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                        avatar: "B",
                        avatarColor: "#43b581"
                    }
                ],
                2: [
                    {
                        id: 1,
                        author: "Charlie Brown",
                        text: "Hey team! I've set up the initial smart contract structure. Check it out!",
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        avatar: "C",
                        avatarColor: "#f04747"
                    }
                ],
                3: [
                    {
                        id: 1,
                        author: "Frank Miller",
                        text: "Looking for team members! We're going to build an amazing mobile app.",
                        timestamp: new Date(Date.now() - 900000).toISOString(),
                        avatar: "F",
                        avatarColor: "#faa61a"
                    }
                ]
            };
        }
        
        this.saveToStorage();
    }
};

// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    userMenu: document.getElementById('userMenu'),
    username: document.getElementById('username'),
    logoutBtn: document.getElementById('logoutBtn'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    
    // Modals
    loginModal: document.getElementById('loginModal'),
    signupModal: document.getElementById('signupModal'),
    createTeamModal: document.getElementById('createTeamModal'),
    closeLogin: document.getElementById('closeLogin'),
    closeSignup: document.getElementById('closeSignup'),
    closeCreateTeam: document.getElementById('closeCreateTeam'),
    
    // Forms
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    createTeamForm: document.getElementById('createTeamForm'),
    
    // Buttons
    getStartedBtn: document.getElementById('getStartedBtn'),
    learnMoreBtn: document.getElementById('learnMoreBtn'),
    createTeamBtn: document.getElementById('createTeamBtn'),
    switchToSignup: document.getElementById('switchToSignup'),
    switchToLogin: document.getElementById('switchToLogin'),
    
    // Teams
    teamsGrid: document.getElementById('teamsGrid'),
    
    // Profile
    profileName: document.getElementById('profileName'),
    profileTitle: document.getElementById('profileTitle'),
    profileImage: document.getElementById('profileImage'),
    profileBio: document.getElementById('profileBio'),
    skillsContainer: document.getElementById('skillsContainer'),
    addSkillBtn: document.getElementById('addSkillBtn'),
    saveBioBtn: document.getElementById('saveBioBtn'),
    uploadBtn: document.getElementById('uploadBtn'),
    
    // Chat
    chatTeams: document.getElementById('chatTeams'),
    chatTitle: document.getElementById('chatTitle'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn')
};

// Navigation System
class Navigation {
    static init() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
        
        elements.hamburger.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
        });
    }
    
    static showSection(sectionName) {
        // Update active nav link
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('active');
            }
        });
        
        // Update active section
        elements.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionName) {
                section.classList.add('active');
            }
        });
        
        AppState.activeSection = sectionName;
        
        // Load section-specific data
        if (sectionName === 'teams') {
            TeamsManager.render();
        } else if (sectionName === 'profile') {
            ProfileManager.render();
        } else if (sectionName === 'chat') {
            ChatManager.render();
        }
    }
}

// Authentication System
class AuthManager {
    static init() {
        // Modal controls
        elements.loginBtn.addEventListener('click', () => this.showModal('login'));
        elements.signupBtn.addEventListener('click', () => this.showModal('signup'));
        elements.closeLogin.addEventListener('click', () => this.hideModal('login'));
        elements.closeSignup.addEventListener('click', () => this.hideModal('signup'));
        elements.switchToSignup.addEventListener('click', () => {
            this.hideModal('login');
            this.showModal('signup');
        });
        elements.switchToLogin.addEventListener('click', () => {
            this.hideModal('signup');
            this.showModal('login');
        });
        
        // Form submissions
        elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        elements.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal('login');
                this.hideModal('signup');
            }
        });
        
        // Check if user is already logged in
        this.updateAuthUI();
    }
    
    static showModal(type) {
        if (type === 'login') {
            elements.loginModal.style.display = 'block';
        } else if (type === 'signup') {
            elements.signupModal.style.display = 'block';
        }
    }
    
    static hideModal(type) {
        if (type === 'login') {
            elements.loginModal.style.display = 'none';
        } else if (type === 'signup') {
            elements.signupModal.style.display = 'none';
        }
    }
    
    static handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
        
        // Mock authentication
        const user = {
            id: Date.now(),
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            email: email,
            title: "Full Stack Developer",
            bio: "Passionate developer with experience in web technologies and mobile apps. Love working on innovative projects that solve real-world problems.",
            skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
            avatar: email[0].toUpperCase(),
            avatarColor: '#7289da'
        };
        
        AppState.currentUser = user;
        AppState.saveToStorage();
        this.updateAuthUI();
        this.hideModal('login');
        
        // Show success message
        this.showNotification('Welcome back!', 'success');
    }
    
    static handleSignup(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }
        
        // Mock user creation
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            title: "Developer",
            bio: "New to HackMate! Excited to join amazing teams and build cool projects.",
            skills: [],
            avatar: name[0].toUpperCase(),
            avatarColor: '#43b581'
        };
        
        AppState.currentUser = user;
        AppState.saveToStorage();
        this.updateAuthUI();
        this.hideModal('signup');
        
        // Show success message
        this.showNotification('Account created successfully!', 'success');
    }
    
    static handleLogout() {
        AppState.currentUser = null;
        localStorage.removeItem('hackmate_user');
        this.updateAuthUI();
        Navigation.showSection('home');
        this.showNotification('Logged out successfully!', 'info');
    }
    
    static updateAuthUI() {
        if (AppState.currentUser) {
            elements.loginBtn.style.display = 'none';
            elements.signupBtn.style.display = 'none';
            elements.userMenu.style.display = 'flex';
            elements.username.textContent = AppState.currentUser.name;
            
            const navAvatar = document.getElementById('navUserAvatar');
            if (navAvatar) {
                navAvatar.textContent = AppState.currentUser.avatar;
                navAvatar.style.background = AppState.currentUser.avatarColor || '#7289da';
            }
        } else {
            elements.loginBtn.style.display = 'block';
            elements.signupBtn.style.display = 'block';
            elements.userMenu.style.display = 'none';
        }
    }
    
    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#43b581' : type === 'error' ? '#f04747' : '#7289da'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Teams Management
class TeamsManager {
    static init() {
        elements.createTeamBtn.addEventListener('click', () => this.showCreateModal());
        elements.closeCreateTeam.addEventListener('click', () => this.hideCreateModal());
        elements.createTeamForm.addEventListener('submit', (e) => this.handleCreateTeam(e));
        
        // Get started button
        elements.getStartedBtn.addEventListener('click', () => {
            if (AppState.currentUser) {
                Navigation.showSection('teams');
            } else {
                AuthManager.showModal('signup');
            }
        });
        
        elements.learnMoreBtn.addEventListener('click', () => {
            Navigation.showSection('teams');
        });
    }
    
    static showCreateModal() {
        if (!AppState.currentUser) {
            AuthManager.showModal('login');
            return;
        }
        elements.createTeamModal.style.display = 'block';
    }
    
    static hideCreateModal() {
        elements.createTeamModal.style.display = 'none';
    }
    
    static handleCreateTeam(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input, textarea');
        const name = inputs[0].value;
        const description = inputs[1].value;
        const skills = inputs[2].value.split(',').map(s => s.trim()).filter(s => s);
        const maxSize = parseInt(inputs[3].value);
        
        const newTeam = {
            id: Date.now(),
            name: name,
            description: description,
            skills: skills,
            members: [AppState.currentUser.name],
            maxSize: maxSize,
            createdBy: AppState.currentUser.name
        };
        
        AppState.teams.push(newTeam);
        AppState.messages[newTeam.id] = [
            {
                id: 1,
                author: AppState.currentUser.name,
                text: `Welcome to ${name}! Let's build something amazing together.`,
                timestamp: new Date().toISOString(),
                avatar: AppState.currentUser.avatar,
                avatarColor: AppState.currentUser.avatarColor || '#7289da'
            }
        ];
        
        AppState.saveToStorage();
        this.render();
        this.hideCreateModal();
        e.target.reset();
        
        AuthManager.showNotification('Team created successfully!', 'success');
    }
    
    static render() {
        elements.teamsGrid.innerHTML = '';
        
        AppState.teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            const memberNames = Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object' 
                ? team.members.map(m => m.name) 
                : team.members || [];
            
            teamCard.innerHTML = `
                <div class="team-header">
                    <h3 class="team-name">${team.name}</h3>
                    <span class="team-members">${memberNames.length}/${team.maxSize}</span>
                </div>
                <p class="team-description">${team.description}</p>
                <div class="team-skills">
                    ${team.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="team-actions">
                    ${this.getTeamActions(team)}
                </div>
            `;
            
            elements.teamsGrid.appendChild(teamCard);
        });
    }
    
    static getTeamActions(team) {
        if (!AppState.currentUser) {
            return '<button class="btn-view" onclick="AuthManager.showModal(\'login\')">Login to Join</button>';
        }
        
        const memberNames = Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object' 
            ? team.members.map(m => m.name) 
            : team.members || [];
        const isMember = memberNames.includes(AppState.currentUser.name);
        const isFull = memberNames.length >= team.maxSize;
        
        if (isMember) {
            return `
                <button class="btn-view" onclick="Navigation.showSection('chat'); ChatManager.selectTeam(${team.id})">Open Chat</button>
                <button class="btn-join" style="background: #f04747;" onclick="TeamsManager.leaveTeam(${team.id})">Leave Team</button>
            `;
        } else if (isFull) {
            return '<button class="btn-view" disabled>Team Full</button>';
        } else {
            return `
                <button class="btn-view">View Details</button>
                <button class="btn-join" onclick="TeamsManager.joinTeam(${team.id})">Join Team</button>
            `;
        }
    }
    
    static joinTeam(teamId) {
        if (!AppState.currentUser) {
            AuthManager.showModal('login');
            return;
        }
        
        const team = AppState.teams.find(t => t.id === teamId);
        const memberNames = Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object' 
            ? team.members.map(m => m.name) 
            : team.members || [];
        
        if (team && !memberNames.includes(AppState.currentUser.name) && memberNames.length < team.maxSize) {
            // Add user as member object if team uses object structure, otherwise as string
            if (Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object') {
                team.members.push({
                    name: AppState.currentUser.name,
                    role: AppState.currentUser.title || 'Developer',
                    avatar: AppState.currentUser.avatar,
                    avatarColor: AppState.currentUser.avatarColor || '#7289da'
                });
            } else {
                team.members.push(AppState.currentUser.name);
            }
            
            // Add welcome message
            if (!AppState.messages[teamId]) {
                AppState.messages[teamId] = [];
            }
            AppState.messages[teamId].push({
                id: Date.now(),
                author: 'System',
                text: `${AppState.currentUser.name} joined the team!`,
                timestamp: new Date().toISOString(),
                avatar: 'S',
                avatarColor: '#99aab5'
            });
            
            AppState.saveToStorage();
            this.render();
            AuthManager.showNotification('Successfully joined the team!', 'success');
        }
    }
    
    static leaveTeam(teamId) {
        const team = AppState.teams.find(t => t.id === teamId);
        if (team) {
            // Filter members based on structure (object or string)
            if (Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object') {
                team.members = team.members.filter(member => member.name !== AppState.currentUser.name);
            } else {
                team.members = team.members.filter(member => member !== AppState.currentUser.name);
            }
            
            // Add leave message
            AppState.messages[teamId].push({
                id: Date.now(),
                author: 'System',
                text: `${AppState.currentUser.name} left the team.`,
                timestamp: new Date().toISOString(),
                avatar: 'S',
                avatarColor: '#99aab5'
            });
            
            AppState.saveToStorage();
            this.render();
            AuthManager.showNotification('Left the team successfully.', 'info');
        }
    }
}

// Profile Management
class ProfileManager {
    static init() {
        elements.addSkillBtn.addEventListener('click', () => this.addSkill());
        elements.saveBioBtn.addEventListener('click', () => this.saveBio());
        elements.uploadBtn.addEventListener('click', () => this.uploadAvatar());
    }
    
    static render() {
        if (!AppState.currentUser) {
            Navigation.showSection('home');
            AuthManager.showModal('login');
            return;
        }
        
        elements.profileName.textContent = AppState.currentUser.name;
        elements.profileTitle.textContent = AppState.currentUser.title;
        elements.profileImage.textContent = AppState.currentUser.avatar;
        elements.profileImage.style.background = AppState.currentUser.avatarColor || '#7289da';
        elements.profileBio.value = AppState.currentUser.bio;
        
        this.renderSkills();
    }
    
    static renderSkills() {
        elements.skillsContainer.innerHTML = '';
        
        AppState.currentUser.skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.innerHTML = `
                <span>${skill}</span>
                <button class="skill-remove" onclick="ProfileManager.removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            elements.skillsContainer.appendChild(skillElement);
        });
    }
    
    static addSkill() {
        const skill = prompt('Enter a new skill:');
        if (skill && skill.trim() && !AppState.currentUser.skills.includes(skill.trim())) {
            AppState.currentUser.skills.push(skill.trim());
            AppState.saveToStorage();
            this.renderSkills();
            AuthManager.showNotification('Skill added!', 'success');
        }
    }
    
    static removeSkill(skill) {
        AppState.currentUser.skills = AppState.currentUser.skills.filter(s => s !== skill);
        AppState.saveToStorage();
        this.renderSkills();
        AuthManager.showNotification('Skill removed!', 'info');
    }
    
    static saveBio() {
        AppState.currentUser.bio = elements.profileBio.value;
        AppState.saveToStorage();
        AuthManager.showNotification('Bio saved!', 'success');
    }
    
    static uploadAvatar() {
        // Mock avatar upload - in real app, this would handle file upload
        const colors = ['#7289da', '#43b581', '#f04747', '#faa61a', '#99aab5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        AppState.currentUser.avatarColor = randomColor;
        AppState.saveToStorage();
        elements.profileImage.style.background = randomColor;
        
        // Update nav avatar too
        const navAvatar = document.getElementById('navUserAvatar');
        if (navAvatar) {
            navAvatar.style.background = randomColor;
        }
        
        AuthManager.showNotification('Avatar updated!', 'success');
    }
}

// Chat System
class ChatManager {
    static init() {
        elements.sendBtn.addEventListener('click', () => this.sendMessage());
        elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    static render() {
        if (!AppState.currentUser) {
            Navigation.showSection('home');
            AuthManager.showModal('login');
            return;
        }
        
        this.renderTeamsList();
        
        if (AppState.activeChatTeam) {
            this.renderMessages();
        }
    }
    
    static renderTeamsList() {
        elements.chatTeams.innerHTML = '';
        
        const userTeams = AppState.teams.filter(team => {
            const memberNames = Array.isArray(team.members) && team.members.length > 0 && typeof team.members[0] === 'object' 
                ? team.members.map(m => m.name) 
                : team.members || [];
            return memberNames.includes(AppState.currentUser.name);
        });
        
        if (userTeams.length === 0) {
            elements.chatTeams.innerHTML = '<p style="color: #b9bbbe; text-align: center; padding: 1rem;">Join a team to start chatting!</p>';
            return;
        }
        
        userTeams.forEach(team => {
            const teamElement = document.createElement('div');
            teamElement.className = `chat-team ${AppState.activeChatTeam === team.id ? 'active' : ''}`;
            teamElement.innerHTML = `
                <div class="chat-team-name">${team.name}</div>
                <div class="chat-team-members">${team.members.length} members</div>
            `;
            teamElement.addEventListener('click', () => this.selectTeam(team.id));
            elements.chatTeams.appendChild(teamElement);
        });
    }
    
    static selectTeam(teamId) {
        AppState.activeChatTeam = teamId;
        const team = AppState.teams.find(t => t.id === teamId);
        
        if (team) {
            elements.chatTitle.textContent = team.name;
            elements.messageInput.disabled = false;
            elements.sendBtn.disabled = false;
            elements.messageInput.placeholder = `Message ${team.name}...`;
            
            this.renderTeamsList();
            this.renderMessages();
        }
    }
    
    static renderMessages() {
        if (!AppState.activeChatTeam) return;
        
        elements.chatMessages.innerHTML = '';
        const messages = AppState.messages[AppState.activeChatTeam] || [];
        
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <div class="message-avatar" style="background: ${message.avatarColor || '#7289da'}">${message.avatar}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${message.author}</span>
                        <span class="message-time">${this.formatTime(message.timestamp)}</span>
                    </div>
                    <div class="message-text">${message.text}</div>
                </div>
            `;
            elements.chatMessages.appendChild(messageElement);
        });
        
        // Scroll to bottom
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }
    
    static sendMessage() {
        if (!AppState.activeChatTeam || !elements.messageInput.value.trim()) return;
        
        const message = {
            id: Date.now(),
            author: AppState.currentUser.name,
            text: elements.messageInput.value.trim(),
            timestamp: new Date().toISOString(),
            avatar: AppState.currentUser.avatar,
            avatarColor: AppState.currentUser.avatarColor || '#7289da'
        };
        
        if (!AppState.messages[AppState.activeChatTeam]) {
            AppState.messages[AppState.activeChatTeam] = [];
        }
        
        AppState.messages[AppState.activeChatTeam].push(message);
        AppState.saveToStorage();
        
        elements.messageInput.value = '';
        this.renderMessages();
    }
    
    static formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app state
    AppState.init();
    
    // Initialize all managers
    Navigation.init();
    AuthManager.init();
    TeamsManager.init();
    ProfileManager.init();
    ChatManager.init();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 HackMate initialized successfully!');
});

// Global functions for onclick handlers
window.TeamsManager = TeamsManager;
window.AuthManager = AuthManager;
window.Navigation = Navigation;
window.ChatManager = ChatManager;
window.ProfileManager = ProfileManager;