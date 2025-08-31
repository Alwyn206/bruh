import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Discover = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterSkills, setFilterSkills] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [domains, setDomains] = useState([]);
  const [joinRequests, setJoinRequests] = useState(new Set());

  useEffect(() => {
    fetchTeams();
    fetchFilters();
  }, [searchTerm, selectedDomain, selectedSkills, sortBy, currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '12',
        sortBy,
        sortDir: 'desc'
      });

      if (selectedDomain && selectedDomain !== 'all') params.append('domain', selectedDomain);
      if (selectedSkills.length > 0) {
        selectedSkills.forEach(skill => params.append('skills', skill));
      }

      const response = await fetch(`/api/matching/teams/discover?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
         const data = await response.json();
         setTeams(data.content || []);
         setTotalPages(data.totalPages || 0);
       }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/matching/filters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
         const data = await response.json();
         setAvailableDomains(data.domains || []);
         setAvailableSkills(data.skills || []);
       }
    } catch (error) {
      console.error('Error fetching filters:', error);
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

    // Apply domain filter
    if (filterDomain !== 'all') {
      filtered = filtered.filter(team => team.projectDomain === filterDomain);
    }

    // Apply skills filter
    if (filterSkills) {
      const skillsArray = filterSkills.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(team =>
        team.requiredSkills?.some(skill =>
          skillsArray.some(filterSkill => skill.toLowerCase().includes(filterSkill))
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0);
        case 'slots':
          return (b.maxMembers - (b.members?.length || 0)) - (a.maxMembers - (a.members?.length || 0));
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredTeams(filtered);
  };

  const handleJoinRequest = async (teamId) => {
    if (joinRequests.has(teamId)) return;

    try {
      setJoinRequests(prev => new Set([...prev, teamId]));
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Join request sent successfully!');
        fetchTeams(); // Refresh to update team status
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error(error.message || 'Failed to send join request');
      setJoinRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
    }
  };

  const getAvailableSlots = (team) => {
    return team.maxMembers - (team.members?.length || 0);
  };

  const getTeamStatusBadge = (team) => {
    const availableSlots = getAvailableSlots(team);
    
    if (availableSlots === 0) {
      return <span className="px-2 py-1 bg-discord-red text-white text-xs rounded-full">Full</span>;
    }
    if (availableSlots <= 2) {
      return <span className="px-2 py-1 bg-discord-yellow text-white text-xs rounded-full">Almost Full</span>;
    }
    return <span className="px-2 py-1 bg-discord-green text-white text-xs rounded-full">Open</span>;
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
          <h1 className="text-2xl font-bold text-white">Discover Teams</h1>
          <p className="text-discord-text-muted">Find and join teams that match your interests</p>
        </div>
        <Link
          to="/teams/create"
          className="discord-button-primary w-fit"
        >
          Create Your Own Team
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-discord-dark-primary rounded-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-text-muted" />
              <input
                type="text"
                placeholder="Search teams by name, description, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="discord-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="discord-input w-full"
            >
              <option value="all">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="discord-input w-full"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="members">Most Members</option>
              <option value="slots">Most Slots Available</option>
            </select>
          </div>
        </div>

        {/* Skills Filter */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Filter by skills (comma-separated, e.g., React, Python, Design)..."
            value={filterSkills}
            onChange={(e) => setFilterSkills(e.target.value)}
            className="discord-input w-full"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-discord-text-muted text-sm">
        {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const availableSlots = getAvailableSlots(team);
            const isRequestPending = joinRequests.has(team.id);
            
            return (
              <div key={team.id} className="bg-discord-dark-primary rounded-lg p-6 hover:bg-discord-dark-secondary transition-colors">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                      {getTeamStatusBadge(team)}
                    </div>
                    <p className="text-discord-text-muted text-sm flex items-center space-x-1">
                      <MapPinIcon className="w-3 h-3" />
                      <span>{team.projectDomain}</span>
                    </p>
                  </div>
                </div>

                {/* Team Description */}
                {team.description && (
                  <p className="text-discord-text-normal text-sm mb-4 line-clamp-3">
                    {team.description}
                  </p>
                )}

                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm text-discord-text-muted mb-4">
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>{team.members?.length || 0}/{team.maxMembers}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{availableSlots} slot{availableSlots !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1 col-span-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Required Skills */}
                {team.requiredSkills && team.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-discord-text-muted text-xs mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {team.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-normal text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {team.requiredSkills.length > 4 && (
                        <span className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-muted text-xs rounded">
                          +{team.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Team Leader */}
                {team.createdBy && (
                  <div className="mb-4 p-3 bg-discord-dark-tertiary rounded-lg">
                    <p className="text-discord-text-muted text-xs mb-1">Team Leader:</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-discord-blurple rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {team.createdBy.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-discord-text-normal text-sm">{team.createdBy.name}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/teams/${team.id}/preview`}
                    className="flex-1 discord-button-secondary text-center"
                  >
                    View Details
                  </Link>
                  {availableSlots > 0 ? (
                    <button
                      onClick={() => handleJoinRequest(team.id)}
                      disabled={isRequestPending}
                      className="px-4 py-2 bg-discord-green hover:bg-discord-green-dark disabled:bg-discord-dark-tertiary disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center space-x-1"
                    >
                      {isRequestPending ? (
                        <>
                          <LoadingSpinner size="small" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Join</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-discord-dark-tertiary cursor-not-allowed text-discord-text-muted text-sm rounded-lg flex items-center space-x-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Full</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-discord-dark-primary rounded-lg p-12 text-center">
          <MagnifyingGlassIcon className="w-16 h-16 text-discord-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterDomain !== 'all' || filterSkills ? 'No teams found' : 'No teams available'}
          </h3>
          <p className="text-discord-text-muted mb-6">
            {searchTerm || filterDomain !== 'all' || filterSkills
              ? 'Try adjusting your search filters to find more teams'
              : 'Be the first to create a team and start building something amazing'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/teams/create"
              className="discord-button-primary"
            >
              Create Team
            </Link>
            {(searchTerm || filterDomain !== 'all' || filterSkills) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDomain('all');
                  setFilterSkills('');
                }}
                className="discord-button-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;