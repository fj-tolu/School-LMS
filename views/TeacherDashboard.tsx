
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UploadCloud, MessageSquare, CheckCircle, Video, TrendingUp, MoreVertical, Sparkles, X, FileVideo, Search, Send, Play, Clock, Eye, Trash2, Edit2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, BarChart, AlertTriangle, Info, PlusCircle, Flag, ArrowRight, LoaderCircle, VideoOff, Pin } from 'lucide-react';
import { User, QAThread, VideoLesson, LessonFlag, Subject, SchoolClass } from '../types';
import { MOCK_QA_THREADS, SUBJECTS, MOCK_CLASSES } from '../services/mockData';
import EmptyState from '../components/EmptyState';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useNebula } from '../contexts/NebulaContext';
import UploadWizard from '../components/UploadWizard';

interface TeacherDashboardProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  lessons: VideoLesson[];
  setLessons: React.Dispatch<React.SetStateAction<VideoLesson[]>>;
  flags: LessonFlag[];
  setFlags: React.Dispatch<React.SetStateAction<LessonFlag[]>>;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, currentView, onNavigate, lessons, setLessons, flags, setFlags }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'videos' | 'qa' | 'curriculum'>('dashboard');
  const { showToast } = useToast();
  const { pulse } = useNebula();
  
  const [libraryFilter, setLibraryFilter] = useState<VideoLesson['status'] | 'ALL'>('ALL');
  const [showRejectionModal, setShowRejectionModal] = useState<VideoLesson | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<VideoLesson | null>(null);
  const [viewingLesson, setViewingLesson] = useState<VideoLesson | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);
  const [prefillData, setPrefillData] = useState<{classId: string, subjectId: string} | null>(null);
  const [bridgeTab, setBridgeTab] = useState<'qa' | 'flags'>('qa');
  const [modalContext, setModalContext] = useState<{ type: 'lesson' | 'flag', id: string, flag?: LessonFlag } | null>(null);

  const teacherLessons = useMemo(() => lessons.filter(l => l.teacherId === user.id), [lessons, user.id]);
  const teacherFlags = useMemo(() => flags.filter(f => teacherLessons.some(l => l.id === f.lessonId)), [flags, teacherLessons]);
  const pendingFlagsCount = teacherFlags.filter(f => f.status === 'PENDING').length;

  useEffect(() => { 
    if (['dashboard', 'videos', 'qa', 'curriculum'].includes(currentView)) {
      setActiveTab(currentView as any); 
    }
  }, [currentView]);

  useEffect(() => {
    if (viewingLesson && modalContext?.type === 'flag' && videoPlayerRef.current) {
      const timestamp = modalContext.flag?.timestamp || 0;
      videoPlayerRef.current.currentTime = timestamp;
    }
  }, [viewingLesson, modalContext]);
  
  const handleMarkFlagResolved = (flagId: string) => { 
    setFlags(flags.map(f => f.id === flagId ? { ...f, status: 'RESOLVED' } : f)); 
    showToast('Flag marked as resolved.', 'success');
  };

  const handlePlayFromFlag = (flag: LessonFlag) => { 
    const lesson = teacherLessons.find(l => l.id === flag.lessonId); 
    if (lesson) {
        setViewingLesson(lesson);
        setModalContext({ type: 'flag', id: flag.id, flag: flag });
    }
  };
  
  const handleViewLesson = (lesson: VideoLesson) => {
      setViewingLesson(lesson);
      setModalContext({ type: 'lesson', id: lesson.id });
  };

  const closeModal = () => {
    setViewingLesson(null);
    setModalContext(null);
  }

  const filteredLibraryLessons = useMemo(() => { 
    if (libraryFilter === 'ALL') return teacherLessons; 
    return teacherLessons.filter(l => l.status === libraryFilter); 
  }, [teacherLessons, libraryFilter]);

  const handleDeleteLesson = (lessonId: string) => { 
    setLessons(lessons.filter(l => l.id !== lessonId)); 
    setShowDeleteModal(null); 
    showToast('Lesson permanently deleted.', 'info'); 
  };

  const handleEditLesson = (lesson: VideoLesson) => { 
    setEditingLesson(lesson); 
    setShowUploadWizard(true); 
  };

  const stats = useMemo(() => ({ 
    pending: teacherLessons.filter(l => l.status === 'PENDING').length, 
    rejected: teacherLessons.filter(l => l.status === 'REJECTED').length, 
    drafts: teacherLessons.filter(l => l.status === 'DRAFT').length,
    approved: teacherLessons.filter(l => l.status === 'APPROVED').length
  }), [teacherLessons]);

  const openUploadWizard = (prefill: {classId: string, subjectId: string} | null = null) => { 
    setPrefillData(prefill); 
    setEditingLesson(null); 
    setShowUploadWizard(true); 
  };

  const handleSaveLesson = (lesson: VideoLesson) => { 
    const exists = lessons.some(l => l.id === lesson.id); 
    if (exists) setLessons(lessons.map(l => l.id === lesson.id ? lesson : l)); 
    else setLessons([lesson, ...lessons]); 
    setShowUploadWizard(false); 
    setEditingLesson(null); 
    showToast(exists ? 'Lesson updated!' : 'Lesson uploaded for review!', 'success');
    pulse();
  };
  
  const statCards = [
      { label: 'Total Approved', value: stats.approved, icon: CheckCircle, color: 'green', status: 'APPROVED' },
      { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'blue', status: 'PENDING' },
      { label: 'Rejected', value: stats.rejected, icon: AlertTriangle, color: 'red', status: 'REJECTED' },
      { label: 'Drafts', value: stats.drafts, icon: Edit2, color: 'orange', status: 'DRAFT' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative animate-fade-in h-full flex flex-col">
        <AnimatePresence>
            {showUploadWizard && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] glassmorphic-backdrop flex items-center justify-center p-4"> 
                <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden glassmorphic-card"> 
                  <UploadWizard 
                    user={user}
                    editingLesson={editingLesson}
                    prefillData={prefillData}
                    onClose={() => setShowUploadWizard(false)}
                    onSave={handleSaveLesson}
                  />
                </motion.div>
              </motion.div>
            )}
            
            {showRejectionModal && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] glassmorphic-backdrop flex items-center justify-center p-4"> 
                <motion.div initial={{scale:0.9}} animate={{scale:1}} className="glassmorphic-card bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in border border-red-200 dark:border-red-800"> 
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-red-600 flex items-center gap-2"><AlertTriangle size={20}/> Rejection Feedback</h3>
                    <button onClick={() => setShowRejectionModal(null)}><X size={20}/></button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">"{showRejectionModal.rejectionReason}"</p>
                  <div className="flex justify-end">
                    <button onClick={() => { handleEditLesson(showRejectionModal); setShowRejectionModal(null); }} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Update Lesson</button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {showDeleteModal && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] glassmorphic-backdrop flex items-center justify-center p-4">
                <motion.div initial={{scale:0.9}} animate={{scale:1}} className="glassmorphic-card bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in"> 
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Delete Lesson?</h3>
                  <p className="text-gray-500 mb-6">This action cannot be undone. All views and data for this lesson will be lost.</p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 font-bold text-gray-500">Cancel</button>
                    <button onClick={() => handleDeleteLesson(showDeleteModal!.id)} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Delete Permanently</button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {viewingLesson && modalContext && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeModal}>
                    <motion.div 
                        layoutId={modalContext.type === 'flag' ? `flag-card-${modalContext.id}` : `lesson-card-${modalContext.id}`}
                        className="w-full max-w-5xl bg-dark-surface rounded-3xl overflow-hidden relative shadow-2xl flex flex-col items-center justify-center" 
                        onClick={e => e.stopPropagation()}
                    >
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={closeModal} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"><X size={20} /></motion.button>
                        
                        {modalContext.type === 'flag' && modalContext.flag && (
                            <motion.div 
                                initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}}
                                className="absolute top-4 left-4 z-20 p-4 bg-yellow-300/90 text-yellow-900 rounded-2xl shadow-lg max-w-xs backdrop-blur-sm"
                            >
                                <div className="flex items-start gap-2">
                                    <Pin size={18} className="flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-sm">Note from Facilitator:</p>
                                        <p className="text-sm">"{modalContext.flag.comment}"</p>
                                        <p className="text-xs font-mono opacity-70 mt-2">Timestamp: {new Date(modalContext.flag.timestamp * 1000).toISOString().substr(14, 5)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <div className="aspect-video w-full bg-black">
                            {viewingLesson.videoUrl ? (
                                <video ref={videoPlayerRef} src={viewingLesson.videoUrl} controls autoPlay className="w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <VideoOff size={48} className="mb-4" />
                                    <h3 className="text-lg font-bold">Video Not Available</h3>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {activeTab === 'videos' ? 'My Lessons' : activeTab === 'qa' ? 'The Bridge' : 'Teacher Dashboard'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{user.specialty} • Expert Creator Portal</p>
        </div>
        <motion.button 
          whileHover={{scale:1.05}} 
          whileTap={{scale:0.95}} 
          onClick={() => openUploadWizard()} 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <UploadCloud size={18} /> New Lesson
        </motion.button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* ... Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div key={i} onClick={() => { onNavigate('videos'); setLibraryFilter(stat.status as any); }} className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-dark-border/50 shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-4`}><stat.icon size={20} /></div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3><p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Uploads */}
            <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-dark-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Video size={20} className="text-blue-500"/> Recent Uploads</h3><button onClick={() => onNavigate('videos')} className="text-sm text-blue-600 hover:underline">View All</button></div>
              <div className="space-y-2">
                {teacherLessons.slice(0, 5).map(lesson => (
                  <div key={lesson.id} onClick={() => handleViewLesson(lesson)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <img src={lesson.thumbnailUrl} className="w-16 aspect-video rounded-lg object-cover" />
                    <div className="flex-1"><p className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{lesson.title}</p><p className="text-xs text-gray-400">{lesson.uploadedAt}</p></div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lesson.status === 'APPROVED' ? 'bg-green-100 text-green-700' : lesson.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{lesson.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Bridge Alerts */}
            <div className={`bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-dark-border/50 shadow-sm transition-all ${pendingFlagsCount > 0 ? 'glowing-notification-red' : ''}`}>
              <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Flag size={20} className="text-red-500"/> Critical Flags</h3><button onClick={() => onNavigate('qa')} className="text-sm text-red-600 hover:underline">Respond Now</button></div>
              <LayoutGroup>
              <div className="space-y-2">
                {teacherFlags.filter(f => f.status === 'PENDING').slice(0, 5).map(flag => (
                  <motion.div layoutId={`flag-card-${flag.id}`} key={flag.id} onClick={() => handlePlayFromFlag(flag)} className="flex items-center gap-4 p-3 rounded-xl bg-red-50/80 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 cursor-pointer hover:bg-red-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600"><Flag size={18} /></div>
                    <div className="flex-1"><p className="font-bold text-sm text-red-800 dark:text-red-200 line-clamp-1">{flag.comment}</p><p className="text-xs text-red-600 opacity-70">Lesson: {teacherLessons.find(l => l.id === flag.lessonId)?.title}</p></div>
                    <ChevronRight className="text-red-400" size={16} />
                  </motion.div>
                ))}
              </div>
              </LayoutGroup>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
         <div className="animate-fade-in space-y-6">
            <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-2 rounded-full border border-white/20 dark:border-dark-border/50 flex gap-2">
              {(['ALL', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
                <button key={f} onClick={() => setLibraryFilter(f)} className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${libraryFilter === f ? 'bg-gray-900 text-white dark:bg-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {f}
                </button>
              ))}
            </div>
            <LayoutGroup>
                {filteredLibraryLessons.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredLibraryLessons.map(lesson => (
                            <motion.div layoutId={`lesson-card-${lesson.id}`} key={lesson.id} onClick={() => handleViewLesson(lesson)} className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-dark-border/50 overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                  <motion.img src={lesson.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Play className="text-white" size={48} />
                                  </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">{lesson.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                      <span>{lesson.uploadedAt}</span>
                                      <span className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] ${
                                        lesson.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        lesson.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                      }`}>
                                        {lesson.status}
                                      </span>
                                    </div>
                                    {lesson.status === 'REJECTED' && (
                                      <button onClick={(e) => { e.stopPropagation(); setShowRejectionModal(lesson);}} className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-[10px] font-bold rounded-lg flex items-center justify-center gap-2">
                                        <AlertTriangle size={14} /> View Feedback
                                      </button>
                                    )}
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-50/50 dark:border-dark-border/50">
                                        <motion.button whileHover={{scale:1.1}} onClick={(e) => {e.stopPropagation(); setShowDeleteModal(lesson)}} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></motion.button>
                                        <motion.button whileHover={{scale:1.1}} onClick={(e) => {e.stopPropagation(); handleEditLesson(lesson)}} className="p-2 text-gray-400 hover:text-blue-500"><Edit2 size={16} /></motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : ( 
                  <EmptyState 
                    Icon={Video} 
                    title="No Lessons Found" 
                    description={`You haven't created any lessons with the status "${libraryFilter}" yet.`} 
                    action={<button onClick={() => openUploadWizard()} className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-full flex items-center gap-2 hover:bg-blue-700"><PlusCircle size={16} /> Create First Lesson</button>} 
                  /> 
                )}
            </LayoutGroup>
         </div>
      )}

      {activeTab === 'qa' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center gap-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-1 rounded-xl border border-white/20 dark:border-dark-border/50 w-fit">
            <button onClick={() => setBridgeTab('qa')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bridgeTab === 'qa' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500'}`}>Q&A Conversations</button>
            <button onClick={() => setBridgeTab('flags')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${bridgeTab === 'flags' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}>
              Instructional Flags 
              {pendingFlagsCount > 0 && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">{pendingFlagsCount}</span>}
            </button>
          </div>

          {bridgeTab === 'qa' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-dark-border/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-dark-border font-bold">Recent Inquiries</div>
                <div className="divide-y divide-gray-50 dark:divide-dark-border">
                  {MOCK_QA_THREADS.map(qa => (
                    <div key={qa.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500">
                      <p className="text-xs text-gray-400 mb-1">{qa.timestamp}</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2">{qa.questionText}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${qa.status === 'ANSWERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {qa.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-dark-border/50 p-8 flex flex-col items-center justify-center text-center">
                <MessageSquare size={48} className="text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Bridge Workspace</h3>
                <p className="text-sm text-gray-500 max-w-xs">Select an inquiry from the left to start a direct pedagogical dialogue with the facilitator.</p>
              </div>
            </div>
          ) : (
            <LayoutGroup>
            <div className="space-y-4">
              {teacherFlags.length > 0 ? (
                teacherFlags.map(flag => (
                  <motion.div layoutId={`flag-card-${flag.id}`} key={flag.id} className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-dark-border/50 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 aspect-video bg-black rounded-xl overflow-hidden relative cursor-pointer group" onClick={() => handlePlayFromFlag(flag)}>
                      <img src={teacherLessons.find(l => l.id === flag.lessonId)?.thumbnailUrl} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-mono">
                        {new Date(flag.timestamp * 1000).toISOString().substr(14, 5)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 dark:text-white">{teacherLessons.find(l => l.id === flag.lessonId)?.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${flag.status === 'PENDING' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {flag.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl border-l-4 border-red-500">"{flag.comment}"</p>
                      <div className="flex justify-end gap-3">
                        {flag.status === 'PENDING' && (
                          <button onClick={() => handleMarkFlagResolved(flag.id)} className="px-6 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20">Mark as Resolved</button>
                        )}
                        <button onClick={() => handlePlayFromFlag(flag)} className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-lg hover:bg-gray-200">Review Clip</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState Icon={Flag} title="No Instructional Flags" description="Facilitators haven't marked any points of confusion in your lessons yet." />
              )}
            </div>
            </LayoutGroup>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
