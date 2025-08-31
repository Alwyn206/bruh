import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [activeTeams, setActiveTeams] = useState(new Set());
  const subscriptionsRef = useRef(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      if (!token) return;

      const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/ws`);
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket:', frame);
        setConnected(true);
        
        // Subscribe to user's personal notifications
        stompClient.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          handleNotification(notification);
        });
      };

      stompClient.onDisconnect = () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      };

      stompClient.onStompError = (frame) => {
        console.error('STOMP Error:', frame);
        toast.error('Connection error occurred');
      };

      stompClient.activate();
      setClient(stompClient);

      return () => {
        if (stompClient.active) {
          stompClient.deactivate();
        }
      };
    }
  }, [isAuthenticated, user]);

  // Clean up subscriptions when component unmounts
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();
    };
  }, []);

  const handleNotification = (notification) => {
    switch (notification.type) {
      case 'TEAM_INVITATION':
        toast.success(`New team invitation: ${notification.message}`);
        break;
      case 'TEAM_JOIN':
        toast.success(`${notification.message}`);
        break;
      case 'TEAM_LEAVE':
        toast.info(`${notification.message}`);
        break;
      default:
        toast.info(notification.message);
    }
  };

  const joinTeamChat = (teamId) => {
    if (!client || !connected) {
      console.warn('WebSocket not connected');
      return;
    }

    if (activeTeams.has(teamId)) {
      console.log(`Already subscribed to team ${teamId}`);
      return;
    }

    try {
      // Subscribe to team chat messages
      const subscription = client.subscribe(`/topic/team/${teamId}/chat`, (message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages(prev => ({
          ...prev,
          [teamId]: [...(prev[teamId] || []), chatMessage]
        }));
      });

      subscriptionsRef.current.set(teamId, subscription);
      setActiveTeams(prev => new Set([...prev, teamId]));

      // Send join notification
      client.publish({
        destination: `/app/chat/${teamId}/join`,
        body: JSON.stringify({
          userId: user.id,
          username: user.username
        })
      });

      console.log(`Joined team chat: ${teamId}`);
    } catch (error) {
      console.error('Error joining team chat:', error);
      toast.error('Failed to join team chat');
    }
  };

  const leaveTeamChat = (teamId) => {
    if (!client || !connected) return;

    try {
      // Unsubscribe from team chat
      const subscription = subscriptionsRef.current.get(teamId);
      if (subscription) {
        subscription.unsubscribe();
        subscriptionsRef.current.delete(teamId);
      }

      setActiveTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });

      // Send leave notification
      client.publish({
        destination: `/app/chat/${teamId}/leave`,
        body: JSON.stringify({
          userId: user.id,
          username: user.username
        })
      });

      console.log(`Left team chat: ${teamId}`);
    } catch (error) {
      console.error('Error leaving team chat:', error);
    }
  };

  const sendMessage = (teamId, content) => {
    if (!client || !connected) {
      toast.error('Not connected to chat server');
      return false;
    }

    if (!content.trim()) {
      return false;
    }

    try {
      client.publish({
        destination: `/app/chat/${teamId}/send`,
        body: JSON.stringify({
          content: content.trim(),
          teamId: teamId
        })
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  const getTeamMessages = (teamId) => {
    return messages[teamId] || [];
  };

  const clearTeamMessages = (teamId) => {
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[teamId];
      return newMessages;
    });
  };

  const value = {
    client,
    connected,
    messages,
    activeTeams,
    joinTeamChat,
    leaveTeamChat,
    sendMessage,
    getTeamMessages,
    clearTeamMessages
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};