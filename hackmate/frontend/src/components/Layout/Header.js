import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../../contexts/WebSocketContext';
import {
  Bars3Icon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const { connected } = useWebSocket();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-discord-dark-primary border-b border-discord-dark-secondary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-discord-text-muted hover:text-white p-2 rounded-lg"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          {/* Page title or breadcrumb could go here */}
          <div className="hidden lg:block">
            <h1 className="text-white text-xl font-semibold">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connected ? 'bg-discord-green' : 'bg-discord-red'
            }`} />
            <span className="text-discord-text-muted text-sm hidden sm:block">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Chat Status */}
          <Link
            to="/teams"
            className="text-discord-text-muted hover:text-white p-2 rounded-lg transition-colors"
            title="Teams & Chat"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-discord-text-muted hover:text-white p-2 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <BellIcon className="w-6 h-6" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-discord-red rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-discord-dark-secondary rounded-lg shadow-lg border border-discord-dark-tertiary z-50">
                <div className="p-4 border-b border-discord-dark-tertiary">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 text-center text-discord-text-muted">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-discord-text-muted hover:text-white p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-discord-blurple rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <span className="hidden sm:block font-medium">
                {user?.name || 'User'}
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-discord-dark-secondary rounded-lg shadow-lg border border-discord-dark-tertiary z-50">
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary transition-colors"
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-2 border-discord-dark-tertiary" />
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-discord-text-muted hover:text-white hover:bg-discord-red transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;