import React from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import type { StyleOption } from '@/types/swipeshop';
import { STYLES } from '@/constants/swipeshop';

interface Step3StyleProps {
    selectedStyle: StyleOption;
    setSelectedStyle: (s: StyleOption) => void;
    isAnalyzing: boolean;
    startAnalysis: () => void;
    setStep: (s: number) => void;
}

const Step3Style: React.FC<Step3StyleProps> = ({
    selectedStyle,
    setSelectedStyle,
    isAnalyzing,
    startAnalysis,
    setStep
}) => (
    <div className="px-2 h-full flex flex-col pt-0 pb-4">
        <h2 className="text-2xl font-black mb-1.5 text-center text-slate-800 tracking-tight">디자인 무드 선택</h2>
        <p className="text-slate-400 mb-6 text-center text-[13px] font-medium italic leading-none">원하는 브랜드 무드를 골라보세요.</p>
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto scrollbar-hide pb-4">
            {STYLES.map((s) => (
                <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s)}
                    className={`p-4 rounded-[32px] border-2 text-left transition-all ${selectedStyle.id === s.id ? 'border-indigo-600 bg-indigo-50 shadow-xl ring-2 ring-indigo-100' : 'border-slate-100 bg-white hover:border-indigo-100 shadow-sm'}`}
                >
                    <div className={`w-10 h-10 rounded-2xl mb-3 shadow-inner ${s.color}`} />
                    <div className="font-bold text-[15px] text-slate-700 mb-0.5">{s.name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">AI Theme applied</div>
                </button>
            ))}
        </div>
        <div className="mt-auto flex gap-3 pt-4 pb-2">
            <button onClick={() => setStep(2)} className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-colors"><RotateCcw size={24} /></button>
            <button onClick={startAnalysis} disabled={isAnalyzing} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                {isAnalyzing ? <><Loader2 className="animate-spin" size={18} /> AI 생성 중...</> : "AI 결과 확인하기"}
            </button>
        </div>
    </div>
);

export default Step3Style;
