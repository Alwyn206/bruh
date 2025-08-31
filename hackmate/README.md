# HackMate - Smart Team-Matching WebApp

A full-stack web application designed to help students and developers form project teams for hackathons, college projects, and personal projects.

## Features

- **Authentication**: Google OAuth2 + JWT with Spring Security
- **User Profiles**: Skills, interests, and project preferences
- **Team Creation**: Create and manage project teams
- **Team Matching**: Discover and join teams based on skills
- **Real-time Chat**: WebSocket-based team communication
- **Friend Invites**: Invite via email/phone
- **Modern UI**: Discord-inspired theme with React + TailwindCSS

## Tech Stack

### Backend
- Java Spring Boot
- Spring Security (OAuth2 + JWT)
- Spring Data JPA
- Spring WebSocket
- MySQL/PostgreSQL
- Maven

### Frontend
- React
- TailwindCSS
- WebSocket client

## Project Structure

```
hackmate/
├── backend/          # Spring Boot application
├── frontend/         # React application
├── docker-compose.yml
└── README.md
```

## Getting Started

1. Clone the repository
2. Set up the backend (see backend/README.md)
3. Set up the frontend (see frontend/README.md)
4. Run with Docker Compose

```bash
docker-compose up
```

## License

MIT License