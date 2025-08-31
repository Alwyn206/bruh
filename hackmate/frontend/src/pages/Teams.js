import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UsersIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterAndSortTeams();
  }, [teams, searchTerm, filterStatus, sortBy]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/teams/user');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTeams = () => {
    let filtered = teams;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.projectDomain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(team => {
        switch (filterStatus) {
          case 'active':
            return team.status === 'ACTIVE';
          case 'completed':
            return team.status === 'COMPLETED';
          case 'recruiting':
            return team.isOpen && team.members?.length < team.maxMembers;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0);
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredTeams(filtered);
  };

  const getStatusBadge = (team) => {
    if (team.status === 'COMPLETED') {
      return <span className="px-2 py-1 bg-discord-green text-white text-xs rounded-full">Completed</span>;
    }
    if (team.isOpen && team.members?.length < team.maxMembers) {
      return <span className="px-2 py-1 bg-discord-yellow text-white text-xs rounded-full">Recruiting</span>;
    }
    return <span className="px-2 py-1 bg-discord-blurple text-white text-xs rounded-full">Active</span>;
  };

  const handleLeaveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to leave this team?')) {
      return;
    }

    try {
      await axios.post(`/teams/${teamId}/leave`);
      toast.success('Left team successfully');
      fetchTeams();
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">My Teams</h1>
          <p className="text-discord-text-muted">Manage your teams and projects</p>
        </div>
        <Link
          to="/teams/create"
          className="discord-button-primary flex items-center space-x-2 w-fit"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Team</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-discord-dark-primary rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-text-muted" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="discord-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-discord-text-muted" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="discord-input"
            >
              <option value="all">All Teams</option>
              <option value="active">Active</option>
              <option value="recruiting">Recruiting</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-discord-text-muted text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="discord-input"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="members">Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-discord-dark-primary rounded-lg p-6 hover:bg-discord-dark-secondary transition-colors">
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                    {getStatusBadge(team)}
                  </div>
                  <p className="text-discord-text-muted text-sm">{team.projectDomain}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    to={`/chat/${team.id}`}
                    className="p-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary rounded-lg transition-colors"
                    title="Team Chat"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/teams/${team.id}`}
                    className="p-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary rounded-lg transition-colors"
                    title="Team Settings"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Team Description */}
              {team.description && (
                <p className="text-discord-text-normal text-sm mb-4 line-clamp-2">
                  {team.description}
                </p>
              )}

              {/* Team Stats */}
              <div className="flex items-center justify-between text-sm text-discord-text-muted mb-4">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4" />
                  <span>{team.members?.length || 0}/{team.maxMembers} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Required Skills */}
              {team.requiredSkills && team.requiredSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-discord-text-muted text-xs mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {team.requiredSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-normal text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {team.requiredSkills.length > 3 && (
                      <span className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-muted text-xs rounded">
                        +{team.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/teams/${team.id}`}
                  className="flex-1 discord-button-secondary text-center"
                >
                  View Details
                </Link>
                {team.createdBy?.id !== team.currentUserId && (
                  <button
                    onClick={() => handleLeaveTeam(team.id)}
                    className="px-3 py-2 bg-discord-red hover:bg-discord-red-dark text-white text-sm rounded-lg transition-colors"
                  >
                    Leave
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-discord-dark-primary rounded-lg p-12 text-center">
          <UserGroupIcon className="w-16 h-16 text-discord-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No teams found' : 'No teams yet'}
          </h3>
          <p className="text-discord-text-muted mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first team or discover existing ones to join'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/teams/create"
              className="discord-button-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Team</span>
            </Link>
            <Link
              to="/discover"
              className="discord-button-secondary flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Discover Teams</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;