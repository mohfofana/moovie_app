import { useState } from 'react';
import { m } from 'framer-motion';
import { HiCamera, HiPencil, HiCheck, HiX } from 'react-icons/hi';
import { useAuth } from '@/context/authContext';
import { cn } from '@/utils/helper';

const Profile = () => {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      await updateUser(formData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400 text-sm mb-12">Manage your account settings and preferences</p>
        </m.div>

        {/* Profile Card */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="dark-glass rounded-2xl p-8 mb-6"
        >
          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="relative group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan to-blue-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white/10">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button
                className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Change avatar"
              >
                <HiCamera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
              <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
              <p className="text-gray-500 text-xs">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <HiPencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-white/5 border border-white/10',
                  'text-white placeholder-gray-500',
                  'transition-all duration-200',
                  isEditing
                    ? 'focus:outline-none focus:border-white/25 focus:bg-white/8'
                    : 'cursor-not-allowed opacity-60'
                )}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-white/5 border border-white/10',
                  'text-white placeholder-gray-500',
                  'transition-all duration-200',
                  isEditing
                    ? 'focus:outline-none focus:border-white/25 focus:bg-white/8'
                    : 'cursor-not-allowed opacity-60'
                )}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={cn(
                    'flex-1 py-3 rounded-lg font-semibold',
                    'bg-white text-black',
                    'hover:bg-gray-100',
                    'transition-all duration-200',
                    'flex items-center justify-center gap-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <HiCheck size={20} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <HiX size={20} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </m.div>

        {/* Preferences Section */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="dark-glass rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>

          <div className="space-y-4">
            {/* Language Preference */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium text-sm">Language</p>
                <p className="text-gray-400 text-xs mt-1">Choose your preferred language</p>
              </div>
              <select className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/25">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Adult Content */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium text-sm">Adult Content</p>
                <p className="text-gray-400 text-xs mt-1">Include adult content in search results</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium text-sm">Email Notifications</p>
                <p className="text-gray-400 text-xs mt-1">Receive updates about new releases</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default Profile;
