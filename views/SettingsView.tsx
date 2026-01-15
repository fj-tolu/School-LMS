import React, { useState } from 'react';
import { User, Save, Camera } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsViewProps {
  user: UserType;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>

      <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
        
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700">
              <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                value="user@educa8.com" 
                disabled
                className="w-full p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 cursor-not-allowed dark:text-gray-500"
              />
              <p className="text-xs text-orange-500 mt-1">Email cannot be changed. Contact support.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div className="pt-4 flex justify-end">
             <button 
               onClick={handleSave}
               className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${saved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20'}`}
             >
               {saved ? <span className="flex items-center gap-2">Saved!</span> : <><Save size={18} /> Save Changes</>}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;