
import React, { useState } from 'react';
import { MOCK_CLASSES, SUBJECTS } from '../services/mockData';
import { BookCopy, GraduationCap, PlusCircle, Edit, Trash2, X, Save, ChevronLeft, Archive, Check } from 'lucide-react';
import { SchoolClass, Subject } from '../types';

// Extracted modal to its own component to manage its state properly
const SubjectAssignmentModal = ({ classData, allSubjects, onClose, onSave }: { classData: SchoolClass, allSubjects: Subject[], onClose: () => void, onSave: (classId: string, subjectIds: string[]) => void }) => {
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(classData.subjects);

    const handleCheckboxChange = (subjectId: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedSubjects(prev => [...prev, subjectId]);
        } else {
            setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
                <h3 className="text-lg font-bold mb-1">Assign Subjects</h3>
                <p className="text-sm text-gray-500 mb-4">Select subjects for <span className="font-bold">{classData.name}</span></p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {allSubjects.map(sub => (
                         <label key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={selectedSubjects.includes(sub.id)} 
                                onChange={(e) => handleCheckboxChange(sub.id, e.target.checked)}
                                className="form-checkbox h-5 w-5 rounded text-blue-600 bg-gray-200 border-gray-300 focus:ring-blue-500" 
                             />
                             <span className="font-medium text-gray-700 dark:text-gray-300">{sub.title}</span>
                         </label>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                    <button onClick={() => onSave(classData.id, selectedSubjects)} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Save Assignments</button>
                </div>
            </div>
        </div>
    );
};

interface AcademicSetupViewProps {
  onNavigate: (view: string) => void;
}

const AcademicSetupView: React.FC<AcademicSetupViewProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [editingClass, setEditingClass] = useState<Partial<SchoolClass> | null>(null);
  const [assigningSubjectsTo, setAssigningSubjectsTo] = useState<SchoolClass | null>(null);

  const handleSaveClass = () => {
    if (!editingClass?.name || !editingClass?.category) return;
    
    if (editingClass.id) {
        setClasses(classes.map(c => c.id === editingClass.id ? { ...c, ...editingClass } as SchoolClass : c));
    } else {
        const newClass: SchoolClass = {
            id: `c-${Date.now()}`,
            name: editingClass.name,
            category: editingClass.category,
            status: 'ACTIVE',
            subjects: []
        };
        setClasses([newClass, ...classes]);
    }
    setEditingClass(null);
  };

  const toggleArchive = (cls: SchoolClass) => {
      setClasses(classes.map(c => c.id === cls.id ? {...c, status: c.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'} : c));
  };
  
  const handleSubjectAssignment = (classId: string, subjectIds: string[]) => {
      setClasses(classes.map(c => c.id === classId ? {...c, subjects: subjectIds} : c));
      setAssigningSubjectsTo(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* MODALS */}
        {editingClass && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4">{editingClass.id ? 'Edit' : 'Add'} Class</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            defaultValue={editingClass.name || ''}
                            placeholder="e.g. JSS 1A"
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg rounded-lg"
                            onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                        />
                        <select
                            defaultValue={editingClass.category || ''}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg rounded-lg"
                            onChange={(e) => setEditingClass({...editingClass, category: e.target.value as SchoolClass['category']})}
                        >
                            <option value="">Select Category</option>
                            <option value="PRIMARY">Primary</option>
                            <option value="JUNIOR_SECONDARY">Junior Secondary</option>
                            <option value="SENIOR_SECONDARY">Senior Secondary</option>
                        </select>
                    </div>
                     <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setEditingClass(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                        <button onClick={handleSaveClass} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Save Class</button>
                    </div>
                </div>
            </div>
        )}
        {assigningSubjectsTo && (
            <SubjectAssignmentModal 
                classData={assigningSubjectsTo}
                allSubjects={subjects}
                onClose={() => setAssigningSubjectsTo(null)}
                onSave={handleSubjectAssignment}
            />
        )}

      {/* HEADER */}
      <div>
        <button onClick={() => onNavigate('admin-dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4">
            <ChevronLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Setup</h1>
        <p className="text-gray-500 dark:text-gray-400">Define your school's structure by managing classes and subjects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Classes Management */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-3"><GraduationCap size={20} className="text-blue-500"/> Manage Classes</h2>
                <button onClick={() => setEditingClass({})} className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"><PlusCircle size={16}/> New Class</button>
            </div>
            <div className="space-y-3">
                {classes.map(cls => (
                    <div key={cls.id} className={`p-3 rounded-lg flex justify-between items-center transition-colors ${cls.status === 'ARCHIVED' ? 'bg-gray-100 dark:bg-gray-900 opacity-60' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                        <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{cls.name}</span>
                            <p className="text-xs text-gray-400">{cls.subjects.length} Subjects Assigned</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => toggleArchive(cls)} className="p-2 text-gray-400 hover:text-yellow-500" title={cls.status === 'ACTIVE' ? 'Archive' : 'Activate'}>
                                {cls.status === 'ACTIVE' ? <Archive size={16}/> : <Check size={16} />}
                            </button>
                            <button onClick={() => setAssigningSubjectsTo(cls)} className="p-2 text-gray-400 hover:text-purple-500" title="Assign Subjects"><BookCopy size={16}/></button>
                            <button onClick={() => setEditingClass(cls)} className="p-2 text-gray-400 hover:text-blue-500" title="Edit"><Edit size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Subjects Management */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-3"><BookCopy size={20} className="text-purple-500"/> Manage Subjects</h2>
                <button className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline"><PlusCircle size={16}/> New Subject</button>
            </div>
             <div className="space-y-3">
                {subjects.map(sub => (
                    <div key={sub.id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{sub.title}</span>
                         <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-500" title="Edit"><Edit size={16}/></button>
                            <button className="p-2 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicSetupView;
