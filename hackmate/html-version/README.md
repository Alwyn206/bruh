# 🚀 HackMate - HTML/CSS/JS Version

A pure HTML, CSS, and JavaScript implementation of HackMate - the ultimate platform for finding hackathon teammates.

## ✨ Features

### 🔐 Authentication System
- **Sign Up/Login**: Create accounts with email and password
- **Local Storage**: User data persisted in browser storage
- **Session Management**: Stay logged in across browser sessions
- **User Profiles**: Customizable profiles with skills and bio

### 👥 Team Management
- **Create Teams**: Start new hackathon teams with descriptions
- **Join Teams**: Browse and join existing teams
- **Team Discovery**: Find teams based on skills and interests
- **Member Management**: View team members and capacity

### 💬 Real-time Chat
- **Team Chat**: Communicate with your team members
- **Message History**: All messages saved locally
- **User Avatars**: Visual identification for team members
- **Timestamps**: Track when messages were sent

### 🎨 Modern UI/UX
- **Discord-inspired Design**: Dark theme with modern aesthetics
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects
- **Intuitive Navigation**: Easy-to-use interface

## 🚀 Quick Start

### Option 1: Direct File Opening
1. **Download/Clone** the files to your computer
2. **Open** `index.html` in any modern web browser
3. **Start using** HackMate immediately!

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📱 How to Use

### 1. Getting Started
- Click **"Sign Up"** to create a new account
- Or click **"Login"** if you already have an account
- Fill in your details and start exploring!

### 2. Creating Your Profile
- Go to the **"Profile"** section
- Add your skills by clicking **"Add Skill"**
- Update your bio to tell others about yourself
- Upload a new avatar (generates random colored avatar)

### 3. Finding Teams
- Visit the **"Teams"** section
- Browse available teams
- Click **"Join Team"** to become a member
- Or click **"Create Team"** to start your own

### 4. Team Communication
- Go to the **"Chat"** section
- Select a team you're a member of
- Start chatting with your teammates
- All messages are saved automatically

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons and visual elements

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### File Structure
```
html-version/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎯 Key Features Implemented

### ✅ Authentication
- [x] User registration and login
- [x] Session persistence with localStorage
- [x] User profile management
- [x] Logout functionality

### ✅ Team Management
- [x] Create new teams
- [x] Join existing teams
- [x] Leave teams
- [x] View team details and members
- [x] Skills-based team discovery

### ✅ Chat System
- [x] Real-time messaging interface
- [x] Message history
- [x] Team-based chat rooms
- [x] User avatars and timestamps

### ✅ Responsive Design
- [x] Mobile-friendly layout
- [x] Tablet optimization
- [x] Desktop experience
- [x] Touch-friendly interactions

## 🎨 Design Features

### Color Scheme
- **Primary**: `#7289da` (Discord Blurple)
- **Success**: `#43b581` (Green)
- **Danger**: `#f04747` (Red)
- **Background**: Dark gradient theme
- **Text**: White and light gray

### Animations
- Smooth hover transitions
- Button press effects
- Modal slide-ins
- Typing animation on hero section
- Notification slide-ins

## 📊 Mock Data

The application comes with pre-loaded demo data:
- **3 Sample Teams** with different skills and members
- **Sample Messages** in each team chat
- **Realistic User Profiles** for testing

## 🔧 Customization

### Adding New Features
1. **HTML**: Add new elements in `index.html`
2. **CSS**: Style them in `styles.css`
3. **JavaScript**: Add functionality in `script.js`

### Changing Colors
Update CSS custom properties in `styles.css`:
```css
:root {
  --primary-color: #7289da;
  --success-color: #43b581;
  --danger-color: #f04747;
}
```

### Adding New Sections
1. Add HTML section with unique ID
2. Add navigation link
3. Implement section logic in JavaScript

## 🚀 Deployment Options

### Static Hosting (Free)
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Direct from repository
- **Surge.sh**: Command-line deployment

### CDN Deployment
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**

## 🔒 Data Storage

### Local Storage Keys
- `hackmate_user`: Current user data
- `hackmate_teams`: All teams data
- `hackmate_messages`: Chat messages

### Data Persistence
- All data is stored in browser's localStorage
- Data persists across browser sessions
- No server required for basic functionality

## 🎯 Next Steps

### Potential Enhancements
- [ ] Real backend integration
- [ ] WebSocket for live chat
- [ ] File upload functionality
- [ ] Push notifications
- [ ] Advanced team matching algorithms
- [ ] Video chat integration
- [ ] Project showcase features

## 🤝 Contributing

This is a standalone HTML/CSS/JS implementation. To contribute:
1. Fork the project
2. Make your changes
3. Test in multiple browsers
4. Submit a pull request

## 📄 License

MIT License - Feel free to use this code for your own projects!

---

**Built with ❤️ using pure HTML, CSS, and JavaScript**

*No frameworks, no build tools, no dependencies - just clean, modern web development!*