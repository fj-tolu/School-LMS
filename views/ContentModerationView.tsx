import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Trash2, Eye, Flag, X, MessageCircle, Video } from 'lucide-react';

interface Alert {
    id: number;
    type: string;
    title: string;
    reportedBy: string;
    reason: string;
    time: string;
    evidence: string;
}

interface ContentModerationViewProps {
    onNavigate: (view: string) => void;
}

const ContentModerationView: React.FC<ContentModerationViewProps> = ({ onNavigate }) => {
    const [alerts, setAlerts] = useState<Alert[]>([
        { 
            id: 1, 
            type: 'Video', 
            title: 'Biology 101 - Reproduction', 
            reportedBy: 'Springfield High', 
            reason: 'Inappropriate language in Q&A thread', 
            time: '2h ago',
            evidence: 'Comment thread: "User123: This is stupid and [expletive]."' 
        },
        { 
            id: 2, 
            type: 'Comment', 
            title: 'Re: Algebra Basics', 
            reportedBy: 'System AI', 
            reason: 'Cyberbullying keywords detected', 
            time: '5h ago',
            evidence: 'Message: "You are terrible at math, just quit."'
        },
    ]);

    const [reviewingAlert, setReviewingAlert] = useState<Alert | null>(null);

    const handleDismiss = (id: number) => {
        setAlerts(alerts.filter(a => a.id !== id));
        setReviewingAlert(null);
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Content Moderation</h1>
                    <p className="text-gray-500 dark:text-gray-400">Review flagged content and reports.</p>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-gray-200 dark:border-dark-border">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">All Caught Up!</h3>
                        <p className="text-gray-500">There are no pending reports to review.</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col md:flex-row gap-6 items-start">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
                                <Flag size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{alert.type}</span>
                                    <span className="text-xs text-gray-400">{alert.time}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{alert.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Reason:</span> {alert.reason}</p>
                                <p className="text-xs text-gray-400">Reported by: {alert.reportedBy}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button 
                                    onClick={() => setReviewingAlert(alert)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> Review
                                </button>
                                <button onClick={() => handleDismiss(alert.id)} className="flex-1 md:flex-none px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-sm rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
                                    Ignore
                                </button>
                                <button onClick={() => handleDismiss(alert.id)} className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* REVIEW MODAL */}
            {reviewingAlert && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border animate-fade-in overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <ShieldAlert size={20} className="text-orange-500" />
                                Reviewing Report #{reviewingAlert.id}
                            </h3>
                            <button onClick={() => setReviewingAlert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Content Type</p>
                                    <p className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                        {reviewingAlert.type === 'Video' ? <Video size={16}/> : <MessageCircle size={16} />}
                                        {reviewingAlert.type}
                                    </p>
                                </div>
                                <div className="w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Context Source</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{reviewingAlert.title}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Flagged Evidence</h4>
                                <div className="p-4 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl text-red-800 dark:text-red-200 font-mono text-sm">
                                    {reviewingAlert.evidence}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Reason for Report</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{reviewingAlert.reason}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-dark-border flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
                             <button onClick={() => setReviewingAlert(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-bold text-sm hover:underline">
                                 Cancel
                             </button>
                             <button onClick={() => handleDismiss(reviewingAlert.id)} className="px-6 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20">
                                 Keep Content
                             </button>
                             <button onClick={() => handleDismiss(reviewingAlert.id)} className="px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/20">
                                 Remove Content
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentModerationView;