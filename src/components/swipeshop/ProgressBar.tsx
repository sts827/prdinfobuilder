import React from 'react';
import { STEP_LABELS } from '@/constants/swipeshop';

interface ProgressBarProps {
    step: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => (
    <div className="flex justify-between mb-4 px-6 mt-2">
        {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${step >= s ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400'}`}>
                    {s}
                </div>
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-tight ${step >= s ? 'text-indigo-600' : 'text-gray-300'}`}>
                    {STEP_LABELS[s - 1]}
                </span>
            </div>
        ))}
    </div>
);
