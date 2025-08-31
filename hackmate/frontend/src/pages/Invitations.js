import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  UserGroupIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [filter, setFilter] = useState('all'); // all, pending, accepted, declined

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/invitations');
      setInvitations(response.data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId, action) => {
    if (processingIds.has(invitationId)) return;

    try {
      setProcessingIds(prev => new Set([...prev, invitationId]));
      
      await axios.post(`/invitations/${invitationId}/${action}`);
      
      const actionText = action === 'accept' ? 'accepted' : 'declined';
      toast.success(`Invitation ${actionText} successfully!`);
      
      // Update the invitation status locally
      setInvitations(prev => prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' }
          : inv
      ));
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} invitation`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-discord-yellow text-white text-xs rounded-full">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-1 bg-discord-green text-white text-xs rounded-full">Accepted</span>;
      case 'DECLINED':
        return <span className="px-2 py-1 bg-discord-red text-white text-xs rounded-full">Declined</span>;
      case 'EXPIRED':
        return <span className="px-2 py-1 bg-discord-text-muted text-white text-xs rounded-full">Expired</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredInvitations = invitations.filter(invitation => {
    if (filter === 'all') return true;
    return invitation.status.toLowerCase() === filter;
  });

  const getFilterCounts = () => {
    return {
      all: invitations.length,
      pending: invitations.filter(inv => inv.status === 'PENDING').length,
      accepted: invitations.filter(inv => inv.status === 'ACCEPTED').length,
      declined: invitations.filter(inv => inv.status === 'DECLINED').length
    };
  };

  const filterCounts = getFilterCounts();

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
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Team Invitations</h1>
        <p className="text-discord-text-muted">
          Manage your team invitations and join requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-discord-dark-primary rounded-lg p-1">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', count: filterCounts.all },
            { key: 'pending', label: 'Pending', count: filterCounts.pending },
            { key: 'accepted', label: 'Accepted', count: filterCounts.accepted },
            { key: 'declined', label: 'Declined', count: filterCounts.declined }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-discord-blurple text-white'
                  : 'text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary'
              }`}
            >
              {label} {count > 0 && <span className="ml-1">({count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      {filteredInvitations.length > 0 ? (
        <div className="space-y-4">
          {filteredInvitations.map((invitation) => {
            const isProcessing = processingIds.has(invitation.id);
            const isPending = invitation.status === 'PENDING';
            
            return (
              <div key={invitation.id} className="bg-discord-dark-primary rounded-lg p-6 hover:bg-discord-dark-secondary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Team Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-discord-blurple rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {invitation.team.name}
                        </h3>
                        <p className="text-discord-text-muted text-sm">
                          {invitation.team.projectDomain}
                        </p>
                      </div>
                      {getStatusBadge(invitation.status)}
                    </div>

                    {/* Team Description */}
                    {invitation.team.description && (
                      <p className="text-discord-text-normal text-sm mb-4 line-clamp-2">
                        {invitation.team.description}
                      </p>
                    )}

                    {/* Team Stats */}
                    <div className="flex items-center space-x-6 text-sm text-discord-text-muted mb-4">
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{invitation.team.members?.length || 0}/{invitation.team.maxMembers} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Invited {formatDate(invitation.createdAt)}</span>
                      </div>
                      {invitation.team.createdBy && (
                        <div className="flex items-center space-x-1">
                          <span>by {invitation.team.createdBy.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Required Skills */}
                    {invitation.team.requiredSkills && invitation.team.requiredSkills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-discord-text-muted text-xs mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {invitation.team.requiredSkills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-normal text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {invitation.team.requiredSkills.length > 5 && (
                            <span className="px-2 py-1 bg-discord-dark-tertiary text-discord-text-muted text-xs rounded">
                              +{invitation.team.requiredSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Invitation Message */}
                    {invitation.message && (
                      <div className="bg-discord-dark-tertiary rounded-lg p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <InformationCircleIcon className="w-4 h-4 text-discord-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-discord-text-muted text-xs mb-1">Message from team leader:</p>
                            <p className="text-discord-text-normal text-sm">{invitation.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/teams/${invitation.team.id}/preview`}
                        className="discord-button-secondary"
                      >
                        View Team Details
                      </Link>
                      
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                            disabled={isProcessing}
                            className="discord-button-primary flex items-center space-x-2"
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                            <span>Accept</span>
                          </button>
                          
                          <button
                            onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-discord-red hover:bg-discord-red-dark disabled:bg-discord-dark-tertiary disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <XMarkIcon className="w-4 h-4" />
                            )}
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                      
                      {invitation.status === 'ACCEPTED' && (
                        <Link
                          to={`/chat/${invitation.team.id}`}
                          className="discord-button-primary"
                        >
                          Go to Team Chat
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-discord-dark-primary rounded-lg p-12 text-center">
          <EnvelopeIcon className="w-16 h-16 text-discord-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter === 'all' ? 'No invitations yet' : `No ${filter} invitations`}
          </h3>
          <p className="text-discord-text-muted mb-6">
            {filter === 'all'
              ? 'Team invitations will appear here when you receive them'
              : `You don't have any ${filter} invitations at the moment`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/discover"
              className="discord-button-primary"
            >
              Discover Teams
            </Link>
            <Link
              to="/teams/create"
              className="discord-button-secondary"
            >
              Create Team
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitations;