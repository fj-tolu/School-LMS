
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InstructorDashboard from './views/InstructorDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import SuperAdminDashboard from './views/SuperAdminDashboard';
import UserManagementView from './views/UserManagementView';
import ContentModerationView from './views/ContentModerationView';
import LoginView from './views/LoginView';
import SettingsView from './views/SettingsView';
import RegisterUserView from './views/RegisterUserView';
import VideoApprovalView from './views/VideoApprovalView';
import SchoolManagementView from './views/SchoolManagementView';
import SchoolOnboardingView from './views/SchoolOnboardingView';
import PlatformSettingsView from './views/PlatformSettingsView';
import AcademicSetupView from './views/AcademicSetupView';
import KnowledgeNebula from './views/KnowledgeNebula';
import { UserRole, User, VideoLesson, LessonFlag } from './types';
import { CLASSROOM_TEACHER_USER, SUBJECT_TEACHER_USER, SCHOOL_ADMIN_USER, SUPER_ADMIN_USER, INITIAL_LESSONS, MOCK_LESSON_FLAGS } from './services/mockData';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lessons, setLessons] = useState<VideoLesson[]>(INITIAL_LESSONS);
  const [flags, setFlags] = useState<LessonFlag[]>(MOCK_LESSON_FLAGS);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    const lowEmail = email.toLowerCase();
    if (lowEmail.includes('superadmin')) {
        setCurrentUser(SUPER_ADMIN_USER);
        setActiveView('sa-dashboard');
    } else if (lowEmail.includes('admin')) {
        setCurrentUser(SCHOOL_ADMIN_USER);
        setActiveView('admin-dashboard');
    } else if (lowEmail.includes('teacher')) {
        setCurrentUser(SUBJECT_TEACHER_USER);
        setActiveView('dashboard');
    } else if (lowEmail.includes('facilitator')) { 
        setCurrentUser(CLASSROOM_TEACHER_USER);
        setActiveView('dashboard');
    } else {
        setCurrentUser(CLASSROOM_TEACHER_USER);
        setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const pendingApprovalCount = lessons.filter(l => l.status === 'PENDING').length;
  const teacherLessons = currentUser ? lessons.filter(l => l.teacherId === currentUser.id) : [];
  const pendingFlagsCount = flags.filter(f => 
    f.status === 'PENDING' && teacherLessons.some(l => l.id === f.lessonId)
  ).length;

  const renderContent = () => {
    if (!currentUser) return null;

    let viewComponent;

    switch (currentUser.role) {
        case UserRole.SUPER_ADMIN:
            if (activeView === 'settings') { viewComponent = <PlatformSettingsView />; break; }
            switch (activeView) {
                case 'sa-dashboard': viewComponent = <SuperAdminDashboard user={currentUser} onNavigate={setActiveView} />; break;
                case 'sa-schools': viewComponent = <SchoolManagementView user={currentUser} onNavigate={setActiveView} />; break;
                case 'sa-onboard': viewComponent = <SchoolOnboardingView onNavigate={setActiveView} />; break;
                default: viewComponent = <SuperAdminDashboard user={currentUser} onNavigate={setActiveView} />; break;
            }
            break;
            
        case UserRole.SCHOOL_ADMIN:
             if (activeView === 'settings') { viewComponent = <SettingsView user={currentUser} />; break; }
            switch (activeView) {
                case 'admin-dashboard': viewComponent = <AdminDashboard onNavigate={setActiveView} />; break;
                case 'admin-academics': viewComponent = <AcademicSetupView onNavigate={setActiveView} />; break;
                case 'admin-register': viewComponent = <RegisterUserView onNavigate={setActiveView} />; break;
                case 'admin-users': viewComponent = <UserManagementView onNavigate={setActiveView} />; break;
                case 'admin-approvals': viewComponent = <VideoApprovalView lessons={lessons} setLessons={setLessons} onNavigate={setActiveView} />; break;
                case 'admin-content': viewComponent = <ContentModerationView onNavigate={setActiveView} />; break;
                default: viewComponent = <AdminDashboard onNavigate={setActiveView} />; break;
            }
            break;
        
        case UserRole.SUBJECT_TEACHER:
            if (activeView === 'settings') { viewComponent = <SettingsView user={currentUser} />; break; }
            viewComponent = <TeacherDashboard 
                user={currentUser} 
                currentView={activeView} 
                onNavigate={setActiveView} 
                lessons={lessons} 
                setLessons={setLessons}
                flags={flags}
                setFlags={setFlags}
            />;
            break;

        case UserRole.CLASSROOM_TEACHER:
            if (activeView === 'settings') { viewComponent = <SettingsView user={currentUser} />; break; }
            viewComponent = <InstructorDashboard 
                user={currentUser} 
                currentView={activeView} 
                onNavigate={setActiveView} 
                lessons={lessons} 
                flags={flags}
                setFlags={setFlags}
            />;
            break;

        default:
            viewComponent = <div className="p-10 text-center">Invalid Role Profile</div>;
            break;
    }
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeView}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
            >
                <ErrorBoundary>
                    {viewComponent}
                </ErrorBoundary>
            </motion.div>
        </AnimatePresence>
    )
  };

  if (!isLoggedIn || !currentUser) {
      return (
        <AnimatePresence>
          <motion.div
            key="login"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={isDarkMode ? 'dark' : ''}
          >
            <LoginView onLogin={handleLogin} />
          </motion.div>
        </AnimatePresence>
      );
  }

  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <KnowledgeNebula />
        <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex h-full bg-transparent"
        >
            <Sidebar 
                currentRole={currentUser.role} 
                activeView={activeView} 
                onNavigate={setActiveView} 
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                onLogout={handleLogout}
                pendingCount={pendingApprovalCount}
                pendingFlagsCount={pendingFlagsCount}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <div className="md:hidden bg-white/70 dark:bg-dark-surface/70 backdrop-blur-lg p-4 border-b border-gray-200/50 dark:border-dark-border/50 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                    <span className="font-bold text-gray-800 dark:text-white">Educa-8</span>
                </div>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
                    <Menu size={24} />
                </button>
                </div>

                <main className="flex-1 overflow-y-auto">
                {renderContent()}
                </main>
            </div>
        </motion.div>
    </div>
  );
};

export default App;