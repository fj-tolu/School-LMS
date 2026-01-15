
import React, { useState, useEffect } from 'react';
import { Users, School, DollarSign, Activity, Shield, TrendingUp, BarChart3, PieChart, Download, Video, Award, X, Mail, CheckCircle, Clock, ArrowRight, Play, Flag } from 'lucide-react';
import { User } from '../types';
import { MOCK_USERS, INITIAL_LESSONS } from '../services/mockData';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityFeed from '../components/ActivityFeed';

interface AdminDashboardProps {
    onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    const syllabusProgress = 62;
    const pendingApprovalCount = INITIAL_LESSONS.filter(l => l.status === 'PENDING').length;

    const kpiCards = [
        { icon: Users, count: '32', label: 'Active Teachers', color: 'blue', link: 'admin-users' },
        { icon: Users, count: '1,204', label: 'Enrolled Students', color: 'purple', link: 'admin-users' },
        { icon: Clock, count: `${pendingApprovalCount}`, label: 'Pending Approvals', color: 'orange', link: 'admin-approvals', pending: pendingApprovalCount },
        { icon: Activity, count: `${syllabusProgress}%`, label: 'Syllabus Coverage', color: 'green', link: 'admin-academics' }
    ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Administration</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your school's staff, curriculum, and approvals.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm h-36"><SkeletonLoader className="h-full w-full" /></div>
            ))
        ) : (
            kpiCards.map((kpi, i) => {
                const KpiIcon = kpi.icon;
                return (
                    <div key={i} onClick={() => onNavigate(kpi.link)} className={`bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer ${kpi.pending && kpi.pending > 0 ? 'glowing-notification' : ''}`}>
                        <div className={`p-3 bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 rounded-xl w-fit mb-4`}><KpiIcon size={24} /></div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.count}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{kpi.label}</p>
                    </div>
                );
            })
        )}
      </div>

      {/* Command Center Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Live Activity Ticker</h3>
            {isLoading ? <SkeletonLoader className="h-64 w-full"/> : <ActivityFeed />}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-8 flex flex-col justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Approval Workbench</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">A new kinetic interface to review lessons. Flick cards up to approve or pull down to reject with comments.</p>
            </div>
            <button onClick={() => onNavigate('admin-approvals')} className="mt-6 bg-blue-600 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                Open Workbench <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
