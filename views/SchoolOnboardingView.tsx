import React, { useState } from 'react';
import { Building, User, Tag, Palette, Key, CheckCircle, Mail, Briefcase, PlusCircle, ArrowLeft } from 'lucide-react';

interface SchoolOnboardingViewProps {
    onNavigate: (view: string) => void;
}

const SchoolOnboardingView: React.FC<SchoolOnboardingViewProps> = ({ onNavigate }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [schoolData, setSchoolData] = useState({
        name: '',
        shortCode: '',
        logo: null,
        primaryColor: '#3B82F6',
        adminName: '',
        adminEmail: '',
        plan: 'Tier 2'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Initializing new school tenant:", schoolData);
        setIsSuccess(true);
        setTimeout(() => {
            onNavigate('sa-schools');
        }, 2000);
    }

    if (isSuccess) {
        return (
            <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center h-full animate-fade-in">
                <CheckCircle size={64} className="text-green-500 mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Initialized!</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">A welcome email has been sent to the new School Admin. Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <button onClick={() => onNavigate('sa-dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Onboarding & Tenant Factory</h1>
                <p className="text-gray-500 dark:text-gray-400">Create and configure a new, isolated school instance.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Section 1: Identity */}
                <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3"><Building size={20} className="text-blue-500"/> School Identity & Branding</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Building size={12}/> School Name</label>
                            <input required type="text" placeholder="e.g., Northwood High" className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Tag size={12}/> Short Code</label>
                            <input required type="text" placeholder="e.g., northwood (for URLs)" className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Logo Upload</label>
                            <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Palette size={12}/> Primary Color</label>
                            <input type="color" defaultValue="#3B82F6" className="w-full h-12 p-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
                        </div>
                    </div>
                </div>

                {/* Section 2: Admin */}
                 <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3"><Key size={20} className="text-purple-500"/> Admin Account Provisioning</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5"><User size={12}/> Admin Full Name</label>
                            <input required type="text" placeholder="e.g., Principal Skinner" className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Mail size={12}/> Admin Contact Email</label>
                            <input required type="email" placeholder="principal.skinner@example.com" className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
                        </div>
                    </div>
                </div>

                {/* Section 3: Plan */}
                <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3"><Briefcase size={20} className="text-green-500"/> Plan Constraints & Quotas</h2>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Subscription Tier</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <option>Tier 1 (Small) - 20 Teachers, 10 Classes, 100GB Storage</option>
                        <option>Tier 2 (Medium) - 50 Teachers, 25 Classes, 500GB Storage</option>
                        <option>Enterprise (Custom) - Unlimited</option>
                    </select>
                </div>
                
                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                        <PlusCircle size={20} /> Initialize School & Send Invite
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SchoolOnboardingView;
