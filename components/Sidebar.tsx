
import React from 'react';
import { LayoutDashboard, BookOpen, MessageSquare, Settings, LogOut, Video, Users, ShieldAlert, Moon, Sun, X, UserPlus, CheckSquare, Building, Briefcase, PlusCircle, BookCopy } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  pendingCount?: number;
  pendingFlagsCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole, 
  activeView, 
  onNavigate, 
  isDarkMode, 
  toggleDarkMode,
  isOpen,
  onClose,
  onLogout,
  pendingCount,
  pendingFlagsCount
}) => {

  const getMenuItems = () => {
    switch(currentRole) {
      case UserRole.SUPER_ADMIN:
        return {
          title: 'Platform',
          items: [
            { id: 'sa-dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'sa-onboard', label: 'Onboard School', icon: PlusCircle },
            { id: 'sa-schools', label: 'Manage Schools', icon: Building },
            { id: 'sa-subscriptions', label: 'Subscriptions', icon: Briefcase },
            { id: 'settings', label: 'System Settings', icon: Settings },
          ]
        };
      case UserRole.SCHOOL_ADMIN:
        return {
          title: 'Administration',
          items: [
            { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'admin-academics', label: 'Academic Setup', icon: BookCopy },
            { id: 'admin-register', label: 'Register User', icon: UserPlus },
            { id: 'admin-users', label: 'User Management', icon: Users },
            { id: 'admin-approvals', label: 'Video Approvals', icon: CheckSquare },
            { id: 'admin-content', label: 'Content Moderation', icon: ShieldAlert },
            { id: 'settings', label: 'School Settings', icon: Settings },
          ]
        };
      case UserRole.SUBJECT_TEACHER:
         return {
          title: 'Creator Portal',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'videos', label: 'My Lessons', icon: Video },
            { id: 'qa', label: 'The Bridge', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ]
        };
      case UserRole.CLASSROOM_TEACHER:
        return {
          title: 'Facilitator Tools',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'curriculum', label: 'All Courses', icon: BookOpen },
            { id: 'videos', label: 'Lesson Library', icon: Video },
            { id: 'qa', label: 'The Bridge (Q&A)', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ]
        };
      default:
        return { title: '', items: [] };
    }
  };

  const { title: menuTitle, items: menuItems } = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              E
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Educa-8</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">
            {menuTitle}
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const hasPendingAdmin = item.id === 'admin-approvals' && pendingCount && pendingCount > 0;
            const hasPendingTeacher = item.id === 'qa' && currentRole === UserRole.SUBJECT_TEACHER && pendingFlagsCount && pendingFlagsCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                } ${hasPendingAdmin ? 'glowing-notification' : ''} ${hasPendingTeacher ? 'glowing-notification-red' : ''}`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'} />
                <span className="font-medium">{item.label}</span>
                {hasPendingAdmin && (
                  <span className="ml-auto bg-orange-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
                 {hasPendingTeacher && (
                  <span className="ml-auto bg-red-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {pendingFlagsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-50 dark:border-dark-border space-y-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-8 h-4 bg-gray-300 dark:bg-blue-600 rounded-full relative transition-colors`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: isDarkMode ? '18px' : '2px' }}></div>
            </div>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;