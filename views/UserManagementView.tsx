
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Search, UserX, UserCheck, Edit, Users, X, Link as LinkIcon, Save, GraduationCap, CheckCircle } from 'lucide-react';
import { User, UserRole, SchoolClass, Subject, UserAssignment } from '../types';
import { MOCK_USERS, MOCK_CLASSES, SUBJECTS } from '../services/mockData';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

// Modal component with its own state for managing assignments
const AssignmentManagerModal = ({ user, onClose, onSave }: { user: User, onClose: () => void, onSave: (userId: string, assignments: UserAssignment[]) => void }) => {
    const [assignments, setAssignments] = useState<UserAssignment[]>(user.assignments || []);

    const handleAssignmentChange = (classId: string, subjectId: string | undefined, isChecked: boolean) => {
        setAssignments(prev => {
            if (isChecked) {
                // For classroom teachers, ensure only one class is assigned
                if (user.role === UserRole.CLASSROOM_TEACHER) {
                    return [{ classId, subjectId }];
                }
                return [...prev, { classId, subjectId }];
            } else {
                return prev.filter(a => !(a.classId === classId && a.subjectId === subjectId));
            }
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glassmorphic-backdrop flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div 
                layoutId={`user-card-${user.id}`}
                className="bg-white dark:bg-dark-surface glassmorphic-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-dark-bg/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Manage Matrix Assignments</h3>
                        <p className="text-sm text-gray-500">For: <span className="font-medium text-blue-600 dark:text-blue-400">{user.name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
                {user.role === UserRole.SUBJECT_TEACHER ? (
                    <div className="space-y-6">
                        {MOCK_CLASSES.filter(c => c.status === 'ACTIVE').map(cls => (
                            <div key={cls.id} className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-dark-border">
                                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><GraduationCap size={16}/> {cls.name}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {SUBJECTS.filter(s => cls.subjects.includes(s.id)).map(sub => (
                                        <label key={sub.id} className="flex items-center gap-3 p-3 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border cursor-pointer hover:border-blue-500 transition-colors shadow-sm">
                                            <input 
                                                type="checkbox" 
                                                checked={assignments.some(a => a.classId === cls.id && a.subjectId === sub.id)} 
                                                onChange={(e) => handleAssignmentChange(cls.id, sub.id, e.target.checked)}
                                                className="form-checkbox h-5 w-5 rounded text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" 
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sub.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Assign Primary Class</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {MOCK_CLASSES.map(cls => (
                                <label key={cls.id} className="flex items-center gap-3 p-4 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border cursor-pointer hover:border-blue-500 transition-all shadow-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={assignments.some(a => a.classId === cls.id)} 
                                        onChange={(e) => handleAssignmentChange(cls.id, undefined, e.target.checked)}
                                        className="form-checkbox h-5 w-5 rounded text-blue-600" 
                                    />
                                    <div>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white">{cls.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase">{cls.category.replace('_', ' ')}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-dark-border flex justify-end gap-3 bg-gray-50 dark:bg-dark-bg/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => onSave(user.id, assignments)} className="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/30">
                        <Save size={18}/> Save Assignment Matrix
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

interface UserManagementViewProps {
    onNavigate: (view: string) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ onNavigate }) => {
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>(MOCK_USERS.filter(u => u.role === UserRole.SUBJECT_TEACHER || u.role === UserRole.CLASSROOM_TEACHER));
    const [managingAssignmentsFor, setManagingAssignmentsFor] = useState<User | null>(null);
    const { showToast } = useToast();

    const handleSaveAssignments = (userId: string, newAssignments: UserAssignment[]) => {
        setUsers(users.map(u => u.id === userId ? { ...u, assignments: newAssignments } : u));
        setManagingAssignmentsFor(null);
        showToast('Assignments updated successfully.', 'success');
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'ALL' || 
                              (filter === 'SUBJECT_TEACHERS' && user.role === UserRole.SUBJECT_TEACHER) || 
                              (filter === 'CLASSROOM_TEACHERS' && user.role === UserRole.CLASSROOM_TEACHER);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <AnimatePresence>
                {managingAssignmentsFor && (
                     <AssignmentManagerModal
                        user={managingAssignmentsFor}
                        onClose={() => setManagingAssignmentsFor(null)}
                        onSave={handleSaveAssignments}
                     />
                )}
            </AnimatePresence>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Staffing & Assignment Matrix</h1>
                    <p className="text-gray-500 dark:text-gray-400">Map Subject Experts and Facilitators to their respective physical classes.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-dark-border flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Filter by name or specialty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm" />
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        {['ALL', 'SUBJECT_TEACHERS', 'CLASSROOM_TEACHERS'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)} 
                                className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${filter === f ? 'bg-white dark:bg-dark-surface text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <LayoutGroup>
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <motion.div layoutId={`user-card-${user.id}`} key={user.id} onClick={() => setManagingAssignmentsFor(user)} className="bg-white dark:bg-dark-bg/20 p-5 rounded-2xl border border-gray-100 dark:border-dark-border hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 group cursor-pointer transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={user.avatarUrl} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-dark-border group-hover:border-blue-500 transition-colors shadow-md"/>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-dark-surface flex items-center justify-center ${user.role === UserRole.SUBJECT_TEACHER ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                            <CheckCircle size={10} className="text-white"/>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{user.role === UserRole.SUBJECT_TEACHER ? user.specialty : 'Classroom Facilitator'}</p>
                                    </div>
                                    <motion.div whileHover={{rotate:90}} className="text-gray-300 group-hover:text-blue-500 transition-colors"><MoreHorizontal size={20}/></motion.div>
                                </div>
                                <div className="mt-5 pt-5 border-t border-gray-50 dark:border-dark-border flex flex-wrap gap-2">
                                    {user.assignments && user.assignments.length > 0 ? (
                                        user.assignments.slice(0, 3).map((a, i) => {
                                            const clsName = MOCK_CLASSES.find(c => c.id === a.classId)?.name;
                                            const subName = a.subjectId ? SUBJECTS.find(s => s.id === a.subjectId)?.title : null;
                                            return (
                                                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-800/50">
                                                    {clsName}{subName ? `: ${subName}` : ''}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-[10px] text-gray-400 italic">No assignments pending</span>
                                    )}
                                    {user.assignments && user.assignments.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold rounded-lg">+{user.assignments.length - 3} more</span>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-gray-400">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold text-lg">No staff found</p>
                                <p className="text-sm">Try adjusting your filter or search query.</p>
                            </div>
                        )}
                    </motion.div>
                </LayoutGroup>
            </div>
        </div>
    );
};

export default UserManagementView;
