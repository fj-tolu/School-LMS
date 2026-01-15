import React, { useState } from 'react';
import { User } from '../types';
import { Search, Shield, ShieldOff, UserCog, Edit, X } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// Define the School interface for type safety
interface School {
  id: string;
  name: string;
  contact: string;
  plan: string;
  status: 'Active' | 'Suspended';
  teachers: number;
  classes: number;
  videos: number;
}

interface SchoolManagementViewProps {
  user: User;
  onNavigate: (view: string) => void;
}

const SchoolManagementView: React.FC<SchoolManagementViewProps> = ({ user, onNavigate }) => {
  const [schools, setSchools] = useState<School[]>([
    { id: 'sch_1', name: 'Springfield High', contact: 'admin@springfield.edu', plan: 'Premium', status: 'Active', teachers: 32, classes: 12, videos: 250 },
    { id: 'sch_2', name: 'Westside Academy', contact: 'contact@westside.edu', plan: 'Basic', status: 'Active', teachers: 15, classes: 8, videos: 120 },
    { id: 'sch_3', name: 'Hill Valley High', contact: 'admin@hvhigh.edu', plan: 'Premium', status: 'Suspended', teachers: 25, classes: 10, videos: 180 },
  ]);
  
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const toggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSchools(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s
    ));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedSchool && (
          <motion.div 
            key="modal-backdrop"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" 
            onClick={() => setSelectedSchool(null)}
          >
            <motion.div 
              layoutId={`school-card-${selectedSchool.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Update Subscription</h3>
                  <button onClick={() => setSelectedSchool(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={20}/>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">Change plan for <span className="font-bold text-blue-600">{selectedSchool.name}</span>.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Plan Tier</label>
                    <select defaultValue={selectedSchool.plan} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm">
                      <option>Basic</option>
                      <option>Premium</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Expiration Date</label>
                    <input type="date" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button 
                  onClick={() => setSelectedSchool(null)} 
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Life-Cycle Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage all registered tenant instances and subscriptions.</p>
      </header>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by school name..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
            />
          </div>
        </div>

        <LayoutGroup>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">School</th>
                  <th className="px-6 py-4">Stats (C/T/V)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {schools.map((school) => {
                  const StatusIcon = school.status === 'Active' ? ShieldOff : Shield;
                  return (
                    <motion.tr 
                      layoutId={`school-card-${school.id}`}
                      key={school.id} 
                      onClick={() => setSelectedSchool(school)} 
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">{school.name}</p>
                        <p className="text-xs text-gray-500">{school.contact}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {school.classes} / {school.teachers} / {school.videos}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          school.status === 'Active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                        }`}>
                          {school.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert(`Impersonating ${school.name}...`); }} 
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors" 
                            title="Impersonate Admin"
                          >
                            <UserCog size={16}/>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedSchool(school); }} 
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors" 
                            title="Update Subscription"
                          >
                            <Edit size={16}/>
                          </button>
                          <button 
                            onClick={(e) => toggleStatus(e, school.id)} 
                            className={`p-2 transition-colors ${school.status === 'Active' ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-green-500'}`} 
                            title={school.status === 'Active' ? 'Suspend' : 'Activate'}
                          >
                            <StatusIcon size={16}/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
};

export default SchoolManagementView;
// import React, { useState } from 'react';
// import { User } from '../types';
// import { MoreHorizontal, Search, Shield, ShieldOff, UserCog, Edit, X } from 'lucide-react';
// import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// interface SchoolManagementViewProps {
//   user: User;
//   onNavigate: (view: string) => void;
// }

// const SchoolManagementView: React.FC<SchoolManagementViewProps> = ({ user, onNavigate }) => {
//     const [schools, setSchools] = useState([
//         { id: 'sch_1', name: 'Springfield High', contact: 'admin@springfield.edu', plan: 'Premium', status: 'Active', teachers: 32, classes: 12, videos: 250 },
//         { id: 'sch_2', name: 'Westside Academy', contact: 'contact@westside.edu', plan: 'Basic', status: 'Active', teachers: 15, classes: 8, videos: 120 },
//         { id: 'sch_3', name: 'Hill Valley High', contact: 'admin@hvhigh.edu', plan: 'Premium', status: 'Suspended', teachers: 25, classes: 10, videos: 180 },
//     ]);
//     const [selectedSchool, setSelectedSchool] = useState<any | null>(null);

//     const toggleStatus = (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         setSchools(schools.map(s => s.id === id ? {...s, status: s.status === 'Active' ? 'Suspended' : 'Active'} : s));
//     }

//     return (
//     <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
//       <AnimatePresence>
//         {selectedSchool && (
//             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 glassmorphic-backdrop flex items-center justify-center p-4" onClick={() => setSelectedSchool(null)}>
//                 <motion.div layoutId={`school-card-${selectedSchool.id}`} className="bg-white dark:bg-dark-surface glassmorphic-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
//                     <div className="p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Update Subscription</h3>
//                             <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => setSelectedSchool(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></motion.button>
//                         </div>
//                         <p className="text-sm text-gray-500 mb-6">Change plan for <span className="font-bold">{selectedSchool.name}</span>.</p>
//                         <div className="space-y-4">
//                             <div><label className="text-xs font-bold text-gray-400 uppercase">Plan Tier</label><select defaultValue={selectedSchool.plan} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg rounded-lg"><option>Basic</option><option>Premium</option><option>Enterprise</option></select></div>
//                             <div><label className="text-xs font-bold text-gray-400 uppercase">Expiration Date</label><input type="date" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg rounded-lg" /></div>
//                         </div>
//                     </div>
//                     <div className="p-4 bg-gray-50 dark:bg-dark-bg/50 border-t border-gray-100 dark:border-dark-border flex justify-end">
//                         <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => setSelectedSchool(null)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Save Changes</motion.button>
//                     </div>
//                 </motion.div>
//             </div>
//         )}
//       </AnimatePresence>

//       <div>
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Life-Cycle Management</h1>
//         <p className="text-gray-500 dark:text-gray-400">Manage all registered tenant instances.</p>
//       </div>

//        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-100 dark:border-dark-border"><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search by school name..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" /></div></div>
//         <LayoutGroup>
//             <motion.div layout className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase text-left"><tr><th className="px-6 py-4">School</th><th className="px-6 py-4">Stats (C/T/V)</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
//                     <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
//                     {schools.map((school) => {
//                         const StatusIcon = school.status === 'Active' ? ShieldOff : Shield;
//                         return (
//                             <motion.tr layoutId={`school-card-${school.id}`} key={school.id} onClick={() => setSelectedSchool(school)} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer">
//                                 <td className="px-6 py-4"><p className="text-sm font-bold text-gray-800 dark:text-white">{school.name}</p><p className="text-xs text-gray-500">{school.contact}</p></td>
//                                 <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{school.classes} / {school.teachers} / {school.videos}</td>
//                                 <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${school.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'}`}>{school.status}</span></td>
//                                 <td className="px-6 py-4 text-right">
//                                     <div className="flex items-center justify-end gap-2">
//                                         <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={(e) => { e.stopPropagation(); alert(`Impersonating ${school.name}...`); }} className="p-2 text-gray-400 hover:text-blue-500" title="Impersonate Admin"><UserCog size={16}/></motion.button>
//                                         <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => setSelectedSchool(school)} className="p-2 text-gray-400 hover:text-yellow-500" title="Update Subscription"><Edit size={16}/></motion.button>
//                                         <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={(e) => toggleStatus(e, school.id)} className={`p-2 ${school.status === 'Active' ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-green-500'}`} title={school.status === 'Active' ? 'Suspend' : 'Activate'}>
//                                             <StatusIcon size={16}/>
//                                         </motion.button>
//                                     </motion.div>
//                                 </td>
//                             </motion.tr>
//                         );
//                     })}
//                     </tbody>
//                 </table>
//             </motion.div>
//         </LayoutGroup>
//       </div>
//     </div>
//   );
// };

// export default SchoolManagementView;
