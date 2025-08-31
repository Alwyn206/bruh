import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PaperAirplaneIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  FaceSmileIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chat = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const { messages, sendMessage, joinTeamChat, leaveTeamChat, isConnected } = useWebSocket();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
      joinTeamChat(teamId);
    }

    return () => {
      if (teamId) {
        leaveTeamChat(teamId);
      }
    };
  }, [teamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/teams/${teamId}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending || !isConnected) return;

    try {
      setSending(true);
      await sendMessage(teamId, message.trim());
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="w-16 h-16 text-discord-text-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Team not found</h3>
        <p className="text-discord-text-muted mb-6">The team you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/teams" className="discord-button-primary">
          Back to Teams
        </Link>
      </div>
    );
  }

  const teamMessages = messages[teamId] || [];
  const groupedMessages = groupMessagesByDate(teamMessages);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-discord-dark-primary border-b border-discord-dark-tertiary p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/teams"
              className="p-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary rounded-lg transition-colors lg:hidden"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-discord-blurple rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{team.name}</h2>
                <p className="text-sm text-discord-text-muted">
                  {team.members?.length || 0} members
                  {!isConnected && <span className="ml-2 text-discord-red">• Disconnected</span>}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to={`/teams/${teamId}`}
              className="p-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary rounded-lg transition-colors"
              title="Team Settings"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-discord-dark-tertiary px-3 py-1 rounded-full">
                  <span className="text-xs text-discord-text-muted font-medium">
                    {formatDateHeader(date)}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {msgs.map((msg, index) => {
                const isOwnMessage = msg.senderId === user?.id;
                const showAvatar = index === 0 || msgs[index - 1].senderId !== msg.senderId;
                const showTimestamp = index === msgs.length - 1 || 
                  msgs[index + 1].senderId !== msg.senderId ||
                  new Date(msgs[index + 1].timestamp) - new Date(msg.timestamp) > 5 * 60 * 1000;

                return (
                  <div key={msg.id} className={`flex items-start space-x-3 group hover:bg-discord-dark-secondary/30 px-2 py-1 rounded ${!showAvatar ? 'ml-11' : ''}`}>
                    {showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {showAvatar && (
                        <div className="flex items-baseline space-x-2 mb-1">
                          <span className={`font-medium text-sm ${
                            isOwnMessage ? 'text-discord-green' : 'text-white'
                          }`}>
                            {msg.senderName || 'Unknown User'}
                          </span>
                          <span className="text-xs text-discord-text-muted">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className="text-discord-text-normal break-words">
                        {msg.content}
                      </div>
                      {showTimestamp && !showAvatar && (
                        <div className="text-xs text-discord-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatMessageTime(msg.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-discord-dark-tertiary rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-discord-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Welcome to #{team.name}</h3>
            <p className="text-discord-text-muted mb-4 max-w-md">
              This is the beginning of your team's conversation. Start by saying hello!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-discord-dark-primary border-t border-discord-dark-tertiary p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message #${team.name}`}
                disabled={!isConnected || sending}
                className="discord-input pr-20 resize-none"
                maxLength={2000}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  className="p-1 text-discord-text-muted hover:text-white transition-colors"
                  title="Add emoji"
                >
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-discord-text-muted hover:text-white transition-colors"
                  title="Attach file"
                >
                  <PaperClipIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            {!isConnected && (
              <p className="text-discord-red text-xs mt-1">
                Connection lost. Trying to reconnect...
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim() || !isConnected || sending}
            className="p-3 bg-discord-blurple hover:bg-discord-blurple-dark disabled:bg-discord-dark-tertiary disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {sending ? (
              <LoadingSpinner size="small" />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;