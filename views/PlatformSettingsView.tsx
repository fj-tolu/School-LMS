import React from 'react';
import { Sliders, History, Save, Search } from 'lucide-react';

const PlatformSettingsView: React.FC = () => {
    const auditLogs = [
        { user: 'Platform Owner', action: 'Suspended School "Hill Valley High"', timestamp: '2 hours ago', ip: '192.168.1.1' },
        { user: 'Platform Owner', action: 'Updated subscription for "Springfield High" to Premium', timestamp: '1 day ago', ip: '192.168.1.1' },
        { user: 'Platform Owner', action: 'Onboarded new school "Westside Academy"', timestamp: '3 days ago', ip: '192.168.1.1' },
    ];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Global Platform Settings</h1>

      {/* Video Hosting Config */}
      <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3"><Sliders size={20} className="text-blue-500"/> Video Hosting Configuration</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Default Video Compression</label>
                <select className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <option>1080p (High Quality)</option>
                    <option>720p (Standard Quality)</option>
                    <option>480p (Low Bandwidth)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">This sets the default output for new video uploads.</p>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">CDN Endpoint</label>
                <input type="text" defaultValue="https://cdn.educa-8.com/videos/" className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"/>
            </div>
             <div className="pt-4 flex justify-end">
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700"><Save size={16}/> Save Configuration</button>
             </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
         <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-3"><History size={20} className="text-purple-500"/> Super Admin Audit Logs</h2>
             <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"/>
             </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 uppercase text-left">
                    <tr><th className="px-6 py-3">Action</th><th className="px-6 py-3">Timestamp</th><th className="px-6 py-3">IP Address</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                    {auditLogs.map((log, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.action}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default PlatformSettingsView;
