import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    pendingInvitations: 0,
    completedProjects: 0
  });
  const [recentTeams, setRecentTeams] = useState([]);
  const [recentInvitations, setRecentInvitations] = useState([]);
  const [recommendedTeams, setRecommendedTeams] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, teamsResponse, invitationsResponse, recommendedResponse] = await Promise.all([
        fetch('/api/users/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/teams/recent', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/invitations/recent', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/matching/teams/recommended?limit=3', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setRecentTeams(teamsData);
      }

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setRecentInvitations(invitationsData);
      }

      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json();
        setRecommendedTeams(recommendedData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await axios.post(`/invitations/${invitationId}/accept`);
      toast.success('Invitation accepted!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation');
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await axios.post(`/invitations/${invitationId}/decline`);
      toast.success('Invitation declined');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-discord-dark-primary rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-discord-text-muted">
              Ready to collaborate and build amazing projects?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-discord-blurple rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-discord-blurple rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-discord-text-muted text-sm">Total Teams</p>
              <p className="text-2xl font-bold text-white">{stats.totalTeams}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-discord-green rounded-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-discord-text-muted text-sm">Active Teams</p>
              <p className="text-2xl font-bold text-white">{stats.activeTeams}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-discord-yellow rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-discord-text-muted text-sm">Pending Invites</p>
              <p className="text-2xl font-bold text-white">{stats.pendingInvitations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-discord-purple rounded-lg">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-discord-text-muted text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-discord-dark-primary rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/teams/create"
            className="flex items-center p-4 bg-discord-dark-secondary rounded-lg hover:bg-discord-dark-tertiary transition-colors group"
          >
            <div className="p-2 bg-discord-green rounded-lg group-hover:bg-discord-green-dark">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">Create Team</p>
              <p className="text-discord-text-muted text-sm">Start a new project</p>
            </div>
          </Link>
          
          <Link
            to="/discover"
            className="flex items-center p-4 bg-discord-dark-secondary rounded-lg hover:bg-discord-dark-tertiary transition-colors group"
          >
            <div className="p-2 bg-discord-blurple rounded-lg group-hover:bg-discord-blurple-dark">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">Discover Teams</p>
              <p className="text-discord-text-muted text-sm">Find teams to join</p>
            </div>
          </Link>
          
          <Link
            to="/invitations"
            className="flex items-center p-4 bg-discord-dark-secondary rounded-lg hover:bg-discord-dark-tertiary transition-colors group"
          >
            <div className="p-2 bg-discord-yellow rounded-lg group-hover:bg-discord-yellow-dark">
              <EnvelopeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">View Invitations</p>
              <p className="text-discord-text-muted text-sm">Manage team invites</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recommended Teams */}
      {recommendedTeams.length > 0 && (
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
            <Link
              to="/discover"
              className="text-discord-link hover:underline text-sm"
            >
              Discover more
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 bg-discord-dark-secondary rounded-lg hover:bg-discord-dark-tertiary transition-colors"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-discord-blurple rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-white font-medium">{team.name}</p>
                    <p className="text-discord-text-muted text-xs">
                      {team.matchScore}% match
                    </p>
                  </div>
                </div>
                <p className="text-discord-text-muted text-sm mb-3">
                  {team.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-discord-text-muted">
                    {team.projectDomain}
                  </span>
                  <Link
                    to={`/teams/${team.id}`}
                    className="text-discord-link hover:underline text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teams */}
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Teams</h2>
            <Link
              to="/teams"
              className="text-discord-link hover:underline text-sm"
            >
              View all
            </Link>
          </div>
          
          {recentTeams.length > 0 ? (
            <div className="space-y-3">
              {recentTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="flex items-center p-3 bg-discord-dark-secondary rounded-lg hover:bg-discord-dark-tertiary transition-colors"
                >
                  <div className="w-10 h-10 bg-discord-blurple rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-white font-medium">{team.name}</p>
                    <p className="text-discord-text-muted text-sm">
                      {team.projectDomain} • {team.members?.length || 0} members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-discord-text-muted" />
                    <UsersIcon className="w-4 h-4 text-discord-text-muted" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserGroupIcon className="w-12 h-12 text-discord-text-muted mx-auto mb-3" />
              <p className="text-discord-text-muted">No teams yet</p>
              <Link
                to="/teams/create"
                className="text-discord-link hover:underline text-sm"
              >
                Create your first team
              </Link>
            </div>
          )}
        </div>

        {/* Recent Invitations */}
        <div className="bg-discord-dark-primary rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Pending Invitations</h2>
            <Link
              to="/invitations"
              className="text-discord-link hover:underline text-sm"
            >
              View all
            </Link>
          </div>
          
          {recentInvitations.length > 0 ? (
            <div className="space-y-3">
              {recentInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="p-3 bg-discord-dark-secondary rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{invitation.team?.name}</p>
                    <span className="text-xs text-discord-text-muted">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-discord-text-muted text-sm mb-3">
                    Invited by {invitation.inviter?.name}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      className="flex-1 bg-discord-green hover:bg-discord-green-dark text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      className="flex-1 bg-discord-red hover:bg-discord-red-dark text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <EnvelopeIcon className="w-12 h-12 text-discord-text-muted mx-auto mb-3" />
              <p className="text-discord-text-muted">No pending invitations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;