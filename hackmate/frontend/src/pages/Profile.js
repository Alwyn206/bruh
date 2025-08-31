import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PencilIcon,
  CameraIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
    profileImageUrl: '',
    skills: [],
    interests: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        bio: user.bio || '',
        phoneNumber: user.phoneNumber || '',
        profileImageUrl: user.profileImageUrl || '',
        skills: user.skills || [],
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.name || '',
      bio: user.bio || '',
      phoneNumber: user.phoneNumber || '',
      profileImageUrl: user.profileImageUrl || '',
      skills: user.skills || [],
      interests: user.interests || []
    });
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-discord-dark-primary rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="discord-button-secondary flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-discord-blurple rounded-full flex items-center justify-center overflow-hidden">
              {formData.profileImageUrl ? (
                <img 
                  src={formData.profileImageUrl} 
                  alt={formData.fullName}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {formData.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 p-2 bg-discord-blurple rounded-full text-white hover:bg-discord-blurple-dark">
                <CameraIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="discord-input w-full"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="discord-input w-full"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-discord-text-normal mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="discord-input w-full"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="discord-button-primary flex items-center space-x-2"
                  >
                    {loading ? <LoadingSpinner size="small" /> : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="discord-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                  <p className="text-discord-text-muted">@{user?.username}</p>
                </div>
                
                {user?.bio && (
                  <p className="text-discord-text-normal">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-discord-text-muted">
                  <span>{user?.email}</span>
                  {user?.phoneNumber && (
                    <span>{user.phoneNumber}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-discord-dark-primary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
        
        {editing && (
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="discord-input flex-1"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="discord-button-primary px-3"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-discord-blurple text-white text-sm rounded-full"
            >
              {skill}
              {editing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-white hover:text-discord-red"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-discord-text-muted">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Interests Section */}
      <div className="bg-discord-dark-primary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Interests</h3>
        
        {editing && (
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="discord-input flex-1"
                placeholder="Add an interest..."
              />
              <button
                type="button"
                onClick={addInterest}
                className="discord-button-primary px-3"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {formData.interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-discord-green text-white text-sm rounded-full"
            >
              {interest}
              {editing && (
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-white hover:text-discord-red"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {formData.interests.length === 0 && (
            <p className="text-discord-text-muted">No interests added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;