
import React from 'react';
import { Play, Flag, Video } from 'lucide-react';

const ActivityFeed = () => {
    const events = [
        { id: 1, type: 'start', text: 'Lesson Started by Facilitator Musa', subject: 'Physics SS1', time: '2m ago', icon: Play, color: 'green' },
        { id: 2, type: 'flag', text: 'Clarification Requested @ 12:40', subject: 'Calculus', time: '15m ago', icon: Flag, color: 'amber' },
        { id: 3, type: 'upload', text: 'Uploaded by Dr. Sarah – Awaiting Review', subject: 'Chemistry V2', time: '45m ago', icon: Video, color: 'blue' },
        { id: 4, type: 'start', text: 'Lesson Started by Facilitator Tunde', subject: 'Biology JSS3', time: '1h ago', icon: Play, color: 'green' },
    ];

    return (
        <div className="h-full relative overflow-hidden activity-feed-container">
            <div className="activity-feed space-y-4">
                {[...events, ...events].map((event, index) => ( // Duplicate for seamless scroll
                    <div key={`${event.id}-${index}`} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg cursor-pointer">
                        <div className={`p-2 rounded-full bg-${event.color}-100 dark:bg-${event.color}-900/20 text-${event.color}-500`}>
                            <event.icon size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{event.subject}: <span className="font-normal text-gray-600 dark:text-gray-300">{event.text}</span></p>
                            <p className="text-xs text-gray-400">{event.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
