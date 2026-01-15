import React, { useState } from 'react';
import { UserPlus, CheckCircle, School, GraduationCap, Shield, Book, Video } from 'lucide-react';
import { UserRole } from '../types';

interface RegisterUserViewProps {
  onNavigate: (view: string) => void;
}

const RegisterUserView: React.FC<RegisterUserViewProps> = ({ onNavigate }) => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SUBJECT_TEACHER);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '' });
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Register New Teacher</h1>
           <p className="text-gray-500 dark:text-gray-400">Onboard a new Subject Teacher or Classroom Facilitator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
            onClick={() => setUserRole(UserRole.SUBJECT_TEACHER)}
            className={`p-6 rounded-2xl border-2 flex items-start gap-4 transition-all ${userRole === UserRole.SUBJECT_TEACHER ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-dark-border hover:border-purple-200'}`}
        >
            <div className={`p-3 rounded-full ${userRole === UserRole.SUBJECT_TEACHER ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}><Video size={24} /></div>
            <div>
                <span className={`font-bold ${userRole === UserRole.SUBJECT_TEACHER ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300'}`}>Subject Teacher</span>
                <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-1">Creates and uploads video lessons for their assigned subjects.</p>
            </div>
        </button>

        <button 
            onClick={() => setUserRole(UserRole.CLASSROOM_TEACHER)}
            className={`p-6 rounded-2xl border-2 flex items-start gap-4 transition-all ${userRole === UserRole.CLASSROOM_TEACHER ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-dark-border hover:border-blue-200'}`}
        >
            <div className={`p-3 rounded-full ${userRole === UserRole.CLASSROOM_TEACHER ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}><Book size={24} /></div>
            <div>
                <span className={`font-bold ${userRole === UserRole.CLASSROOM_TEACHER ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}>Classroom Teacher</span>
                <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-1">Facilitates lessons in the physical classroom using the platform.</p>
            </div>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                    <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Dr. John Doe"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Login Email</label>
                    <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="email@domain.com"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
            </div>

            {userRole === UserRole.SUBJECT_TEACHER && (
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Primary Specialty</label>
                     <input 
                        type="text" 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        placeholder="e.g. Mathematics & Physics"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
            )}

            <div className="pt-4">
                <button 
                    type="submit"
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isSuccess ? 'bg-green-500' : 'bg-blue-600 hover:scale-[1.01]'}`}
                >
                    {isSuccess ? (
                        <><CheckCircle size={20} /> Teacher Registered</>
                    ) : (
                        <><UserPlus size={20} /> Create Account & Send Invite</>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserView;