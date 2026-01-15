
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Building, Users, DollarSign, Activity, HardDrive, AlertTriangle, ChevronRight } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

interface SuperAdminDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
    return () => clearTimeout(timer);
  }, []);

  const totalStorage = 10 * 1024; // 10TB in GB
  const usedStorage = 4.2 * 1024; // 4.2TB in GB
  const storagePercentage = (usedStorage / totalStorage) * 100;

  const kpiCards = [
    { 
      id: 'schools',
      link: 'sa-schools',
      component: (
        <>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">Live School Counter</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-green-500">● Active</span><span className="font-bold text-lg text-gray-800 dark:text-white">42</span></div>
                <div className="flex justify-between items-center"><span className="text-yellow-500">● Pending</span><span className="font-bold text-lg text-gray-800 dark:text-white">3</span></div>
                <div className="flex justify-between items-center"><span className="text-red-500">● Suspended</span><span className="font-bold text-lg text-gray-800 dark:text-white">1</span></div>
            </div>
        </>
      )
    },
    {
      id: 'storage',
      link: 'settings',
      component: (
        <>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><HardDrive size={16}/> Storage Health Monitor</h3>
            <div className="space-y-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${storagePercentage}%`}}></div></div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800 dark:text-white">4.2TB / 10TB</span>
                    <span className="text-gray-500">{storagePercentage.toFixed(1)}% Used</span>
                </div>
            </div>
        </>
      )
    },
    {
      id: 'subscriptions',
      link: 'sa-subscriptions',
      component: (
         <>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><DollarSign size={16}/> Subscription Snapshot</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">$24,150</p>
            <p className="text-xs text-gray-500">Monthly Recurring Revenue</p>
        </>
      )
    },
    {
      id: 'health',
      link: 'settings',
      component: (
        <>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><Activity size={16}/> System Health</h3>
            <p className="text-3xl font-bold text-green-500">99.98%</p>
            <p className="text-xs text-gray-500">Uptime (24h)</p>
        </>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Platform "God-View"</h1>
        <p className="text-gray-500 dark:text-gray-400">Cross-tenant system health and lifecycle management.</p>
      </div>

      {/* Metric Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
            Array.from({length: 4}).map((_, i) => <SkeletonLoader key={i} className="h-40" />)
        ) : (
          kpiCards.map(card => (
            <div key={card.id} onClick={() => onNavigate(card.link)} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer">
              {card.component}
            </div>
          ))
        )}
      </div>

      {/* System Alerts & School Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">System Alerts</h3>
                <button onClick={() => onNavigate('sa-schools')} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
                    Manage All Schools <ChevronRight size={14}/>
                </button>
            </div>
             <div className="space-y-3">
                 {isLoading ? (
                    <>
                        <SkeletonLoader className="h-16 w-full" />
                        <SkeletonLoader className="h-16 w-full" />
                    </>
                 ) : (
                    <>
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => onNavigate('sa-schools')}>
                            <AlertTriangle className="text-red-500" size={20} />
                            <div>
                                <p className="font-bold text-sm text-red-800 dark:text-red-200">Subscription Expired</p>
                                <p className="text-xs text-red-600 dark:text-red-300">Hill Valley High's plan expired 2 days ago.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20" onClick={() => onNavigate('sa-schools')}>
                            <AlertTriangle className="text-orange-500" size={20} />
                            <div>
                                <p className="font-bold text-sm text-orange-800 dark:text-orange-200">Storage Limit Nearing</p>
                                <p className="text-xs text-orange-600 dark:text-orange-300">Springfield High is at 92% storage capacity.</p>
                            </div>
                        </div>
                    </>
                 )}
             </div>
        </div>
         <div className="bg-blue-600 text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => onNavigate('sa-onboard')}>
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border-2 border-white/30">
                <Building size={32} />
             </div>
            <h3 className="font-bold text-xl">Onboard a New School</h3>
            <p className="text-sm text-blue-200 mt-1">Create a new isolated tenant instance.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
