import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download } from 'lucide-react';
import type { Purpose, CardData } from '@/types/swipeshop';

interface Step6ExportProps {
    selectedPurpose: Purpose;
    setStep: (s: number) => void;
    setKeptImages: (c: CardData[]) => void;
    setCards: (c: CardData[]) => void;
    setImages: (s: string[]) => void;
    setUserInputText: (s: string) => void;
}

const Step6Export: React.FC<Step6ExportProps> = ({
    selectedPurpose,
    setStep,
    setKeptImages,
    setCards,
    setImages,
    setUserInputText
}) => (
    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner"><Check size={40} strokeWidth={3} /></motion.div>
        <h2 className="text-2xl font-black mb-2 tracking-tight text-slate-800">상세페이지 완성!</h2>
        <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed italic">{selectedPurpose.name} 결과물입니다.<br />지금 바로 적용해 보세요.</p>
        <div className="w-full space-y-4">
            <button className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all">
                <Download size={22} /> 고화질 이미지 저장
            </button>
            <button onClick={() => { setStep(1); setKeptImages([]); setCards([]); setImages([]); setUserInputText(""); }} className="w-full bg-white text-slate-500 py-5 rounded-[28px] font-bold border-2 border-slate-50 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-center">
                처음부터 다시 시작하기
            </button>
        </div>
    </div>
);

export default Step6Export;
