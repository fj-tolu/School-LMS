
import React, { useState } from 'react';
import { VideoLesson, User } from '../types';
import { SUBJECTS, MOCK_USERS } from '../services/mockData';
import { Check, X, Eye, Video, Clock, User as UserIcon, CheckSquare, VideoOff, Layers, MousePointerClick } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNebula } from '../contexts/NebulaContext';
import StampOverlay from '../components/StampOverlay';

interface VideoApprovalViewProps {
    lessons: VideoLesson[];
    setLessons: React.Dispatch<React.SetStateAction<VideoLesson[]>>;
    onNavigate: (view: string) => void;
}

const VideoApprovalView: React.FC<VideoApprovalViewProps> = ({ lessons, setLessons, onNavigate }) => {
    const [cardStack, setCardStack] = useState<VideoLesson[]>(lessons.filter(l => l.status === 'PENDING'));
    const [reviewingLesson, setReviewingLesson] = useState<VideoLesson | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const { showToast } = useToast();
    const { pulse } = useNebula();
    const [stamp, setStamp] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const controls = useAnimation();

    const removeCard = (lessonId: string) => {
        setCardStack(prev => prev.filter(l => l.id !== lessonId));
    };

    const handleApproval = (lessonId: string, newStatus: 'APPROVED' | 'REJECTED') => {
        if (newStatus === 'REJECTED' && !rejectionReason.trim()) {
            showToast('Please provide a reason for rejection.', 'error');
            return;
        }
        setLessons(currentLessons =>
            currentLessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, status: newStatus, rejectionReason: newStatus === 'REJECTED' ? rejectionReason : undefined } : lesson
            )
        );
        showToast(`Lesson has been ${newStatus.toLowerCase()}.`, newStatus === 'APPROVED' ? 'success' : 'info');
        if (newStatus === 'APPROVED') {
            pulse();
        }
        removeCard(lessonId);
        setReviewingLesson(null);
        setRejectionReason('');
    };
    
    const handleDragEnd = async (info: any, lesson: VideoLesson) => {
        const yOffset = info.offset.y;
        if (yOffset < -150) { // Dragged Up: Approve
            setStamp('APPROVED');
            await controls.start({ y: -1000, opacity: 0 });
            handleApproval(lesson.id, 'APPROVED');
            setStamp(null);
        } else if (yOffset > 150) { // Dragged Down: Reject
            setReviewingLesson(lesson);
            controls.start({ y: 0 }); // Snap back
        } else {
            controls.start({ y: 0 }); // Snap back
        }
    };

    const findTeacher = (teacherId: string): User | undefined => MOCK_USERS.find(user => user.id === teacherId);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Approval Workbench</h1>
                <p className="text-gray-500 dark:text-gray-400">Drag up to approve, drag down to reject.</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
                 {cardStack.length === 0 ? (
                    <EmptyState Icon={CheckSquare} title="Approval Queue is Empty" description="There are currently no new video lessons from teachers awaiting your review." />
                ) : (
                    <div className="relative w-full h-full max-w-lg max-h-[60vh]">
                        <AnimatePresence>
                            {cardStack.map((lesson, index) => {
                                const isTopCard = index === cardStack.length - 1;
                                return (
                                    <motion.div
                                        key={lesson.id}
                                        drag={isTopCard ? "y" : false}
                                        dragConstraints={{ top: 0, bottom: 0 }}
                                        onDragEnd={(e, info) => handleDragEnd(info, lesson)}
                                        animate={controls}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                                        style={{ 
                                            transform: `scale(${1 - (cardStack.length - 1 - index) * 0.05}) translateY(${(cardStack.length - 1 - index) * -10}px)`,
                                            zIndex: index
                                        }}
                                    >
                                        <div className="w-full h-full bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-dark-border/50 flex flex-col overflow-hidden">
                                            <div className="aspect-video bg-black flex items-center justify-center">
                                                {lesson.videoUrl ? <video src={lesson.videoUrl} className="w-full h-full object-cover" /> : <VideoOff className="text-gray-500" size={48} />}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{lesson.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lesson.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 mt-4 border-t border-gray-100 dark:border-dark-border">
                                                    <img src={findTeacher(lesson.teacherId)?.avatarUrl} className="w-6 h-6 rounded-full" />
                                                    <span>{findTeacher(lesson.teacherId)?.name || 'Unknown'} • {lesson.uploadedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {stamp && <StampOverlay status={stamp} />}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {reviewingLesson && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 glassmorphic-backdrop flex items-center justify-center p-4" onClick={() => setReviewingLesson(null)}>
                        <motion.div className="bg-white dark:bg-dark-surface glassmorphic-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                           <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Rejection Reason</h3>
                                <p className="text-sm text-gray-500">Provide feedback for: <span className="font-medium">{reviewingLesson.title}</span></p>
                                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Audio quality is poor from 02:30-05:00..." rows={4} className="mt-4 w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                           </div>
                           <div className="p-4 border-t border-gray-100 dark:border-dark-border flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/20">
                               <button onClick={() => setReviewingLesson(null)} className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
                               <button onClick={() => handleApproval(reviewingLesson.id, 'REJECTED')} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center gap-2"><X size={18} /> Confirm Rejection</button>
                           </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoApprovalView;
