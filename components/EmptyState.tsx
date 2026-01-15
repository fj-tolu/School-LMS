
import React from 'react';
import { LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  Icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-12 bg-gray-50/50 dark:bg-dark-surface/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border"
    >
      <motion.div 
        animate={{ rotate: [0, 3, -3, 3, 0], scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Icon size={32} />
      </motion.div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;