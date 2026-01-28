import React from 'react';
import type { Purpose } from '@/types/swipeshop';
import { PURPOSES } from '@/constants/swipeshop';

interface Step1PurposeProps {
    selectedPurpose: Purpose;
    setSelectedPurpose: (p: Purpose) => void;
    setStep: (s: number) => void;
}

const Step1Purpose: React.FC<Step1PurposeProps> = ({
    selectedPurpose,
    setSelectedPurpose,
    setStep
}) => (
    <div className="flex flex-col h-full px-2 pt-1 pb-4">
        <h2 className="text-2xl font-black mb-1.5 text-center text-slate-800 tracking-tight">어떤 페이지를 만들까요?</h2>
        <p className="text-slate-400 mb-4 text-center text-[13px] font-medium italic leading-none">목적에 맞는 AI 기획안을 준비해 드립니다.</p>
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
            <div className="grid grid-cols-2 gap-3 content-start pb-6">
                {PURPOSES.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => { setSelectedPurpose(p); setStep(2); }}
                        className={`p-3.5 rounded-[28px] border-2 transition-all text-left flex flex-col group ${selectedPurpose.id === p.id ? 'border-indigo-600 bg-indigo-50 shadow-xl ring-2 ring-indigo-100' : 'border-slate-100 bg-white hover:border-indigo-200 shadow-sm'}`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${p.color} shadow-sm`}>
                            {p.icon}
                        </div>
                        <div className="font-bold text-[15px] text-slate-800 mb-0.5">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold leading-tight line-clamp-2 uppercase tracking-tight">{p.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default Step1Purpose;
