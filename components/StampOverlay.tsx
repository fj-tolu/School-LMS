
import React from 'react';
import { motion } from 'framer-motion';

const StampOverlay = ({ status }: { status: 'APPROVED' | 'REJECTED' }) => {
    const isApproved = status === 'APPROVED';
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
        >
            <div className={`text-6xl font-black uppercase border-4 p-4 rounded-2xl ${isApproved ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} opacity-80`}>
                {status}
            </div>
        </motion.div>
    );
}

export default StampOverlay;
