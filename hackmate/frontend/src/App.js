import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import CreateTeam from './pages/CreateTeam';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Invitations from './pages/Invitations';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/Layout/Layout';

function App() {
  return (
    <div className="App min-h-screen bg-discord-dark-tertiary">
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* OAuth2 Redirect */}
              <Route path="/oauth2/redirect" element={<div>Processing...</div>} />
              
              {/* Protected Routes */}
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/teams/create" element={<CreateTeam />} />
                        <Route path="/teams/:id" element={<TeamDetail />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/chat/:teamId" element={<Chat />} />
                        <Route path="/invitations" element={<Invitations />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2f3136',
                color: '#ffffff',
                border: '1px solid #4f545c',
              },
              success: {
                iconTheme: {
                  primary: '#3ba55d',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ed4245',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </WebSocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;