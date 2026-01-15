
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileVideo, CheckCircle } from 'lucide-react';
import { VideoLesson, User, SchoolClass, Subject } from '../types';
import { MOCK_CLASSES, SUBJECTS } from '../services/mockData';

interface UploadWizardProps {
  user: User;
  editingLesson: VideoLesson | null;
  prefillData: { classId: string, subjectId: string } | null;
  onClose: () => void;
  onSave: (lesson: VideoLesson) => void;
}

const UploadWizard: React.FC<UploadWizardProps> = ({ user, editingLesson, prefillData, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [wizardData, setWizardData] = useState<Partial<VideoLesson>>(editingLesson || {
      id: `l-${Date.now()}`,
      teacherId: user.id,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      views: 0,
      duration: '15:00',
      thumbnailUrl: 'https://image.pollinations.ai/prompt/educational%20video%20thumbnail?width=800&height=450&nologo=true',
      ...prefillData
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingLesson ? 'Edit Lesson' : 'Upload New Lesson'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Basic Information</h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Lesson Title</label>
              <input 
                type="text" 
                value={wizardData.title || ''} 
                onChange={e => setWizardData({...wizardData, title: e.target.value})}
                placeholder="e.g. Solving Quadratic Equations"
                className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Class</label>
                <select 
                  value={wizardData.classId || ''} 
                  onChange={e => setWizardData({...wizardData, classId: e.target.value})}
                  className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <option value="">Select Class</option>
                  {MOCK_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
                <select 
                  value={wizardData.subjectId || ''} 
                  onChange={e => setWizardData({...wizardData, subjectId: e.target.value})}
                  className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
            </div>
            <button 
              disabled={!wizardData.title || !wizardData.classId || !wizardData.subjectId}
              onClick={nextStep} 
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Content Details</h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Topic</label>
              <input 
                type="text" 
                value={wizardData.topic || ''} 
                onChange={e => setWizardData({...wizardData, topic: e.target.value})}
                placeholder="e.g. Kinematics"
                className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
              <textarea 
                rows={4}
                value={wizardData.description || ''} 
                onChange={e => setWizardData({...wizardData, description: e.target.value})}
                placeholder="What will students learn in this lesson?"
                className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Week</label>
                <input type="number" value={wizardData.week || 1} onChange={e => setWizardData({...wizardData, week: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Period</label>
                <input type="number" value={wizardData.period || 1} onChange={e => setWizardData({...wizardData, period: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"/>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold">Back</button>
              <button onClick={nextStep} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Continue</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Video Asset</h3>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center bg-gray-50 dark:bg-gray-900/50">
              <FileVideo size={48} className="mx-auto text-blue-500 mb-4" />
              <p className="font-bold text-gray-800 dark:text-white">Select Video File</p>
              <p className="text-sm text-gray-500 mb-6">MP4, WEBM supported (Max 500MB)</p>
              <input type="file" className="hidden" id="video-upload" onChange={() => setWizardData({...wizardData, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'})} />
              <label htmlFor="video-upload" className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50">Choose File</label>
              {wizardData.videoUrl && <p className="text-xs text-green-500 mt-4 flex items-center justify-center gap-1"><CheckCircle size={12}/> Video selected</p>}
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold">Back</button>
              <button 
                onClick={() => onSave(wizardData as VideoLesson)} 
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
              >
                {editingLesson ? 'Update' : 'Publish for Review'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
}

export default UploadWizard;
