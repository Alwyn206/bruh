import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    phone: ''
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    teamInvitations: true,
    chatMessages: true,
    projectUpdates: true,
    weeklyDigest: false
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowTeamInvitations: true
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        phone: user.phone || ''
      });
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const [notificationRes, privacyRes] = await Promise.all([
        axios.get('/user/settings/notifications'),
        axios.get('/user/settings/privacy')
      ]);
      
      setNotificationSettings(notificationRes.data);
      setPrivacySettings(privacyRes.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (setting, value) => {
    try {
      const updatedSettings = { ...notificationSettings, [setting]: value };
      setNotificationSettings(updatedSettings);
      
      await axios.put('/user/settings/notifications', updatedSettings);
      toast.success('Notification settings updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification settings');
      // Revert on error
      setNotificationSettings(prev => ({ ...prev, [setting]: !value }));
    }
  };

  const handlePrivacyUpdate = async (setting, value) => {
    try {
      const updatedSettings = { ...privacySettings, [setting]: value };
      setPrivacySettings(updatedSettings);
      
      await axios.put('/user/settings/privacy', updatedSettings);
      toast.success('Privacy settings updated!');
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast.error('Failed to update privacy settings');
      // Revert on error
      setPrivacySettings(prev => ({ ...prev, [setting]: prev[setting] }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      await axios.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete('/user/account');
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: KeyIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-discord-text-muted">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="bg-discord-dark-primary rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-discord-blurple text-white'
                      : 'text-discord-text-muted hover:text-white hover:bg-discord-dark-tertiary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-discord-dark-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-discord-text-normal mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="discord-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-discord-text-normal mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      className="discord-input w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="discord-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="discord-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="discord-input w-full resize-none"
                    placeholder="Tell others about yourself..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="discord-button-primary flex items-center space-x-2"
                >
                  {loading ? <LoadingSpinner size="small" /> : null}
                  <span>Update Profile</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-discord-dark-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'teamInvitations', label: 'Team Invitations', description: 'Get notified when you receive team invitations' },
                  { key: 'chatMessages', label: 'Chat Messages', description: 'Receive notifications for new chat messages' },
                  { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified about project milestones and updates' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your team activities' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-discord-dark-secondary rounded-lg">
                    <div>
                      <h3 className="text-discord-text-normal font-medium">{label}</h3>
                      <p className="text-discord-text-muted text-sm">{description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key]}
                        onChange={(e) => handleNotificationUpdate(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-discord-dark-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord-blurple"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-discord-dark-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyUpdate('profileVisibility', e.target.value)}
                    className="discord-input w-full"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="teams">Teams Only - Only team members can see your profile</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
                
                {[
                  { key: 'showEmail', label: 'Show Email Address', description: 'Allow others to see your email address' },
                  { key: 'showPhone', label: 'Show Phone Number', description: 'Allow others to see your phone number' },
                  { key: 'allowTeamInvitations', label: 'Allow Team Invitations', description: 'Let team leaders send you invitations' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-discord-dark-secondary rounded-lg">
                    <div>
                      <h3 className="text-discord-text-normal font-medium">{label}</h3>
                      <p className="text-discord-text-muted text-sm">{description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings[key]}
                        onChange={(e) => handlePrivacyUpdate(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-discord-dark-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord-blurple"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-discord-dark-primary rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-discord-text-normal mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="discord-input w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted hover:text-white"
                      >
                        {showPasswords.current ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-discord-text-normal mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="discord-input w-full pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted hover:text-white"
                      >
                        {showPasswords.new ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-discord-text-normal mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="discord-input w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted hover:text-white"
                      >
                        {showPasswords.confirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="discord-button-primary flex items-center space-x-2"
                  >
                    {loading ? <LoadingSpinner size="small" /> : null}
                    <span>Change Password</span>
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div className="bg-discord-dark-primary rounded-lg p-6 border border-discord-red">
                <h2 className="text-xl font-semibold text-discord-red mb-4 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>Danger Zone</span>
                </h2>
                
                <p className="text-discord-text-muted mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-discord-red hover:bg-discord-red-dark text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-discord-text-normal mb-2">
                        Type "DELETE" to confirm:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="discord-input w-full"
                        placeholder="DELETE"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                        className="discord-button-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || deleteConfirmText !== 'DELETE'}
                        className="px-4 py-2 bg-discord-red hover:bg-discord-red-dark disabled:bg-discord-dark-tertiary disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {loading ? <LoadingSpinner size="small" /> : <TrashIcon className="w-4 h-4" />}
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;