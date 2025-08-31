import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectDomain: '',
    maxMembers: 4,
    isOpen: true,
    requiredSkills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});

  const projectDomains = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Blockchain',
    'Game Development',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Backend Development',
    'Frontend Development',
    'Full Stack Development',
    'Cloud Computing',
    'IoT',
    'AR/VR',
    'Desktop Applications',
    'API Development',
    'Database Design',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill = newSkill.trim();
    if (formData.requiredSkills.includes(skill)) {
      toast.error('Skill already added');
      return;
    }
    
    if (formData.requiredSkills.length >= 10) {
      toast.error('Maximum 10 skills allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, skill]
    }));
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Team name must be less than 50 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (!formData.projectDomain) {
      newErrors.projectDomain = 'Project domain is required';
    }
    
    if (formData.maxMembers < 2) {
      newErrors.maxMembers = 'Team must have at least 2 members';
    } else if (formData.maxMembers > 20) {
      newErrors.maxMembers = 'Team cannot have more than 20 members';
    }
    
    if (formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'At least one skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/teams', formData);
      toast.success('Team created successfully!');
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-discord-blurple rounded-full flex items-center justify-center mx-auto mb-4">
          <UserGroupIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Create a New Team</h1>
        <p className="text-discord-text-muted">
          Start building something amazing with like-minded developers
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-discord-dark-primary rounded-lg p-6 space-y-6">
        {/* Team Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-discord-text-normal mb-2">
            Team Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your team name"
            className={`discord-input w-full ${errors.name ? 'border-discord-red' : ''}`}
            maxLength={50}
          />
          {errors.name && (
            <p className="text-discord-red text-sm mt-1">{errors.name}</p>
          )}
          <p className="text-discord-text-muted text-xs mt-1">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-discord-text-normal mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project and what you're looking to build"
            rows={4}
            className={`discord-input w-full resize-none ${errors.description ? 'border-discord-red' : ''}`}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-discord-red text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-discord-text-muted text-xs mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Project Domain */}
        <div>
          <label htmlFor="projectDomain" className="block text-sm font-medium text-discord-text-normal mb-2">
            Project Domain *
          </label>
          <select
            id="projectDomain"
            name="projectDomain"
            value={formData.projectDomain}
            onChange={handleInputChange}
            className={`discord-input w-full ${errors.projectDomain ? 'border-discord-red' : ''}`}
          >
            <option value="">Select a domain</option>
            {projectDomains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
          {errors.projectDomain && (
            <p className="text-discord-red text-sm mt-1">{errors.projectDomain}</p>
          )}
        </div>

        {/* Max Members */}
        <div>
          <label htmlFor="maxMembers" className="block text-sm font-medium text-discord-text-normal mb-2">
            Maximum Team Size *
          </label>
          <input
            type="number"
            id="maxMembers"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleInputChange}
            min={2}
            max={20}
            className={`discord-input w-full ${errors.maxMembers ? 'border-discord-red' : ''}`}
          />
          {errors.maxMembers && (
            <p className="text-discord-red text-sm mt-1">{errors.maxMembers}</p>
          )}
          <p className="text-discord-text-muted text-xs mt-1">
            Including yourself (2-20 members)
          </p>
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-discord-text-normal mb-2">
            Required Skills *
          </label>
          
          {/* Add Skill Input */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Add a required skill (e.g., React, Python, Design)"
              className="discord-input flex-1"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addSkill}
              className="discord-button-secondary px-4"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Skills List */}
          {formData.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center space-x-1 px-3 py-1 bg-discord-blurple text-white text-sm rounded-full"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-discord-blurple-dark rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {errors.requiredSkills && (
            <p className="text-discord-red text-sm mt-1">{errors.requiredSkills}</p>
          )}
          
          <div className="flex items-start space-x-2 mt-2">
            <InformationCircleIcon className="w-4 h-4 text-discord-text-muted mt-0.5 flex-shrink-0" />
            <p className="text-discord-text-muted text-xs">
              Add skills that team members should have. This helps others find your team and ensures you get the right people.
            </p>
          </div>
        </div>

        {/* Team Visibility */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isOpen"
              checked={formData.isOpen}
              onChange={handleInputChange}
              className="w-4 h-4 text-discord-blurple bg-discord-dark-tertiary border-discord-dark-tertiary rounded focus:ring-discord-blurple focus:ring-2"
            />
            <div>
              <span className="text-sm font-medium text-discord-text-normal">
                Make team discoverable
              </span>
              <p className="text-discord-text-muted text-xs">
                Allow others to find and request to join your team
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="flex-1 discord-button-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 discord-button-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <UserGroupIcon className="w-4 h-4" />
                <span>Create Team</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;