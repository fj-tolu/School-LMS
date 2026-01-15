
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Clock, Send, Bell, X, ChevronLeft, Video, CheckCircle, Lock, Rewind, FastForward, Flag, AlertTriangle, VideoOff, BookOpen, MessageSquare, Search, ChevronRight, Radio } from 'lucide-react';
import { Subject, VideoLesson, QAThread, User, LessonFlag, SchoolClass } from '../types';
import { SUBJECTS, MOCK_CLASSES } from '../services/mockData';
import EmptyState from '../components/EmptyState';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

interface InstructorDashboardProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  lessons: VideoLesson[];
  flags: LessonFlag[];
  setFlags: React.Dispatch<React.SetStateAction<LessonFlag[]>>;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user, currentView, onNavigate, lessons, flags, setFlags }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curriculum' | 'videos' | 'qa'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagTimestamp, setFlagTimestamp] = useState(0);
  const [flagComment, setFlagComment] = useState('');
  const [videoFilter, setVideoFilter] = useState<string>('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    if (['dashboard', 'curriculum', 'videos', 'qa'].includes(currentView)) {
      setActiveTab(currentView as any);
    }
  }, [currentView]);

  const assignedClass = useMemo(() => 
    MOCK_CLASSES.find(c => user.assignments?.some(a => a.classId === c.id)), 
  [user.assignments]);

  const assignedSubjects = useMemo(() => 
    SUBJECTS.filter(s => assignedClass?.subjects.includes(s.id)), 
  [assignedClass]);

  const assignedLessons = useMemo(() => 
    lessons.filter(l => l.status === 'APPROVED' && assignedClass?.id === l.classId),
  [lessons, assignedClass]);
  
  const userFlags = useMemo(() => 
    flags.filter(f => f.instructorId === user.id),
  [flags, user.id]);

  const filteredLessons = useMemo(() => {
      if (videoFilter === 'ALL') return assignedLessons;
      return assignedLessons.filter(l => l.subjectId === videoFilter);
  }, [assignedLessons, videoFilter]);
  
  const currentLiveLesson = assignedLessons[0];

  const handleStartLesson = (lesson: VideoLesson) => setSelectedLesson(lesson);
  
  const handleFlagClick = (event: React.MouseEvent<HTMLButtonElement>) => { 
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    const rect = button.getBoundingClientRect();
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    
    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) {
      existingRipple.remove();
    }
    button.appendChild(circle);

    if (videoRef.current) { 
      videoRef.current.pause(); 
      setFlagTimestamp(Math.floor(videoRef.current.currentTime)); 
      setShowFlagModal(true); 
    } 
  };
  
  const submitFlag = () => {
      if (!selectedLesson) return;
      const newFlag: LessonFlag = { id: `f-${Date.now()}`, lessonId: selectedLesson.id, instructorId: user.id, timestamp: flagTimestamp, comment: flagComment, status: 'PENDING' };
      setFlags(prevFlags => [newFlag, ...prevFlags]);
      setFlagComment('');
      setShowFlagModal(false);
      videoRef.current?.play();
      showToast('Question flagged to Subject Teacher!', 'success');
  };

  const handleCourseClick = (subjectId: string) => {
    setVideoFilter(subjectId);
    onNavigate('videos');
  }

  const getLessonSubject = (lesson: VideoLesson): Subject | undefined => {
    return assignedSubjects.find(s => s.id === lesson.subjectId);
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
        <AnimatePresence>
            {selectedLesson && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4" onClick={() => setSelectedLesson(null)}>
                    <motion.div layoutId={`lesson-card-${selectedLesson.id}`} className="w-full max-w-6xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative group/player shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {selectedLesson.videoUrl ? <video ref={videoRef} src={selectedLesson.videoUrl} className="w-full h-full" autoPlay controls /> : <div className="text-center text-gray-400"><VideoOff size={48} className="mx-auto mb-4" /><h3 className="text-lg font-bold">Video Not Available</h3></div>}
                        <div className="absolute top-4 right-4"><motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => setSelectedLesson(null)} className="p-2 bg-black/50 rounded-full hover:bg-white hover:text-black transition-colors text-white"><X size={20}/></motion.button></div>
                        <div className="absolute bottom-4 right-4">
                            <motion.button animate={{scale: [1, 1.05, 1]}} transition={{repeat: Infinity, duration: 2.5}} onClick={handleFlagClick} className="px-5 py-3 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-500/30 ripple-button">
                                <Flag size={18}/> Ask Question
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {showFlagModal && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] glassmorphic-backdrop flex items-center justify-center p-4"><motion.div initial={{scale:0.9}} animate={{scale:1}} className="glassmorphic-card bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg p-6"><h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><Flag size={20} className="text-red-500" /> Ask a question</h3><p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your question will be flagged at <span className="font-bold text-yellow-500">{new Date(flagTimestamp * 1000).toISOString().substr(14, 5)}</span> for the Subject Teacher.</p><textarea value={flagComment} onChange={e => setFlagComment(e.target.value)} placeholder="e.g., The diagram on screen was confusing..." rows={3} className="w-full p-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg text-gray-800 dark:text-white" /><div className="flex justify-end gap-3 mt-4"><button onClick={() => { setShowFlagModal(false); videoRef.current?.play(); }} className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button><motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={submitFlag} className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700">Send Question</motion.button></div></motion.div></motion.div>}
        </AnimatePresence>
      
        <div className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Facilitator Dashboard</h1><p className="text-gray-500 dark:text-gray-400">Classroom: <span className="font-semibold text-gray-600 dark:text-gray-300">{assignedClass?.name || 'Unassigned'}</span></p></div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
                {currentLiveLesson && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => handleStartLesson(currentLiveLesson)}
                        className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg cursor-pointer hover:shadow-red-500/20 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <Radio size={24} className="text-red-500" />
                                <div className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-50"></div>
                            </div>
                            <h3 className="text-lg font-bold text-red-700 dark:text-red-200">LIVE: Class in Session</h3>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="font-bold text-gray-800 dark:text-white">{currentLiveLesson.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{getLessonSubject(currentLiveLesson)?.title}</p>
                        </div>
                        <button className="px-5 py-2 bg-red-600 text-white font-bold rounded-full text-sm hover:bg-red-700">Join Now</button>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => onNavigate('videos')} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all"><div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4"><Video size={20} /></div><h3 className="text-2xl font-bold text-gray-800 dark:text-white">{assignedLessons.length}</h3><p className="text-sm text-gray-400">Total Lessons</p></div>
                    <div onClick={() => onNavigate('curriculum')} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all"><div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-4"><BookOpen size={20} /></div><h3 className="text-2xl font-bold text-gray-800 dark:text-white">{assignedSubjects.length}</h3><p className="text-sm text-gray-400">Subjects Covered</p></div>
                    <div onClick={() => onNavigate('qa')} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all"><div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 mb-4"><MessageSquare size={20} /></div><h3 className="text-2xl font-bold text-gray-800 dark:text-white">{userFlags.filter(f=>f.status === 'PENDING').length}</h3><p className="text-sm text-gray-400">Pending Questions</p></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4"><Clock size={20} className="text-blue-500"/> Continue Watching</h3>
                        {assignedLessons[0] ? (<div onClick={() => handleStartLesson(assignedLessons[0])} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"><img src={assignedLessons[0].thumbnailUrl} className="w-24 aspect-video rounded-lg object-cover" /><div className="flex-1"><p className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{assignedLessons[0].title}</p><p className="text-xs text-gray-400">{getLessonSubject(assignedLessons[0])?.title}</p></div><div className="p-3 rounded-full bg-blue-600 text-white"><Play size={16} /></div></div>) : <p className="text-sm text-gray-400">No lessons available yet.</p>}
                    </div>
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><MessageSquare size={20} className="text-orange-500"/> My Recent Questions</h3><button onClick={()=>onNavigate('qa')} className="text-sm text-blue-600 hover:underline">View All</button></div>
                        <div className="space-y-3">{userFlags.slice(0, 2).map(flag => (<div key={flag.id} onClick={() => onNavigate('qa')} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"><p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 flex-1">"{flag.comment}"</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${flag.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{flag.status}</span></div>))}</div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'curriculum' && (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Courses for {assignedClass?.name}</h2>
                {assignedSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedSubjects.map(subject => {
                            const Icon = BookOpen;
                            const lessonCount = assignedLessons.filter(l => l.subjectId === subject.id).length;
                            return (
                                <div key={subject.id} onClick={() => handleCourseClick(subject.id)} className={`p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer ${subject.color.replace('text-', 'dark:bg-').replace('-600', '-900/20')} bg-white`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.color} mb-4`}><Icon size={24} /></div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{subject.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{lessonCount} Lessons Available</p>
                                </div>
                            )
                        })}
                    </div>
                ) : <EmptyState Icon={BookOpen} title="No Courses Assigned" description="The school administrator has not assigned any subjects to your class yet." />}
            </div>
        )}

        {activeTab === 'videos' && (
            <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-dark-surface p-2 rounded-full border border-gray-100 dark:border-dark-border flex gap-2 overflow-x-auto"><button onClick={() => setVideoFilter('ALL')} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap ${videoFilter === 'ALL' ? 'bg-gray-900 text-white dark:bg-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>All Subjects</button>{assignedSubjects.map(s=><button key={s.id} onClick={() => setVideoFilter(s.id)} className={`px-4 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap ${videoFilter === s.id ? 'bg-gray-900 text-white dark:bg-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{s.title}</button>)}</div>
                <LayoutGroup>{filteredLessons.length > 0 ? (<motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredLessons.map(lesson => (<motion.div layoutId={`lesson-card-${lesson.id}`} key={lesson.id} onClick={() => handleStartLesson(lesson)} className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden group cursor-pointer hover:shadow-xl transition-all"><div className="aspect-video bg-gray-200 relative overflow-hidden"><motion.img src={lesson.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Play className="text-white" size={48} /></div></div><div className="p-4"><h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-2">{lesson.title}</h3><p className="text-xs text-gray-400 mt-1">W{lesson.week} P{lesson.period} • {getLessonSubject(lesson)?.title}</p></div></motion.div>))}</motion.div>) : ( <EmptyState Icon={VideoOff} title="No Lessons Found" description={`There are no approved lessons for this subject yet.`} /> )}</LayoutGroup>
            </div>
        )}
        
        {activeTab === 'qa' && (
            <div className="animate-fade-in space-y-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Questions for Teachers</h2>
                {userFlags.length > 0 ? (
                    <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-dark-border">{userFlags.map(flag => { const lesson = assignedLessons.find(l => l.id === flag.lessonId); return (
                            <div key={flag.id} className="p-6 flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2"><span className="text-sm font-bold text-gray-800 dark:text-white">{lesson?.title}</span><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${flag.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{flag.status}</span></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border-l-4 border-blue-500">"{flag.comment}"</p>
                                </div>
                                {lesson && <motion.button whileHover={{scale:1.05}} onClick={() => handleStartLesson(lesson)} className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 flex items-center gap-2"><Play size={14}/> View Lesson</motion.button>}
                            </div>
                        )})}</div>
                    </div>
                ) : <EmptyState Icon={MessageSquare} title="No Questions Asked" description="You can ask questions on any video lesson by using the 'Flag Question' button." />}
            </div>
        )}

    </div>
  );
};

export default InstructorDashboard;