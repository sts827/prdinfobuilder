import React from 'react';
import { Reorder, motion } from 'framer-motion';
import {
    Smartphone,
    Monitor,
    GripVertical,
    Sparkles,
    Loader2,
    Trash2,
    RotateCcw,
    Check,
    ChevronUp,
    ChevronDown,
    Plus,
    Layers
} from 'lucide-react';
import type { Purpose, StyleOption, CardData } from '@/types/swipeshop';

interface Step5EditorProps {
    selectedPurpose: Purpose;
    selectedStyle: StyleOption;
    keptImages: CardData[];
    setKeptImages: (cards: CardData[]) => void;
    viewMode: 'mobile' | 'pc';
    setViewMode: (m: 'mobile' | 'pc') => void;
    isRefining: boolean;
    handleRefineWithAI: (id: string) => void;
    deleteBlock: (id: string) => void;
    updateText: (id: string, t: string) => void;
    setStep: (s: number) => void;
}

const Step5Editor: React.FC<Step5EditorProps> = ({
    selectedPurpose,
    selectedStyle,
    keptImages,
    setKeptImages,
    viewMode,
    setViewMode,
    isRefining,
    handleRefineWithAI,
    deleteBlock,
    updateText,
    setStep
}) => {

    // Reorder logic helper
    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...keptImages];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setKeptImages(newItems);
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">

            {/* PC Toolbar (Canvas Top) */}
            <div className="hidden md:flex bg-white border-b px-8 py-4 justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Layers className="text-indigo-600" size={18} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-800">Final Layout Editor</span>
                    </div>
                    <div className="h-4 w-px bg-slate-100 mx-2" />
                    <p className="text-xs text-slate-400 font-medium">총 {keptImages.length}개의 블록이 배치되었습니다.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStep(6)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-100 transition-all active:scale-95"
                    >
                        <Check size={16} /> 프로젝트 완성
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
                {/* Editor Board */}
                <div className={`mx-auto transition-all duration-500 ${viewMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'}`}>
                    <Reorder.Group
                        axis="y"
                        values={keptImages}
                        onReorder={setKeptImages}
                        className="flex flex-col gap-6 pb-20"
                    >
                        {keptImages.map((img, i) => (
                            <Reorder.Item
                                key={img.id}
                                value={img}
                                className="group relative bg-white rounded-[32px] shadow-sm hover:shadow-2xl hover:ring-4 hover:ring-indigo-100 transition-all border border-slate-100 overflow-hidden"
                            >
                                {/* floating Toolbars (PC) */}
                                <div className="hidden md:flex absolute top-6 -right-16 group-hover:right-6 transition-all duration-300 flex-col gap-2 z-20">
                                    <button
                                        onClick={() => handleRefineWithAI(img.id)}
                                        disabled={isRefining}
                                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-slate-50"
                                        title="AI 문구 다듬기"
                                    >
                                        {isRefining ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={18} />}
                                    </button>
                                    <button
                                        onClick={() => moveItem(i, 'up')}
                                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all border border-slate-50"
                                    >
                                        <ChevronUp size={18} />
                                    </button>
                                    <button
                                        onClick={() => moveItem(i, 'down')}
                                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all border border-slate-50"
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteBlock(img.id)}
                                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-slate-50 mt-2"
                                        title="블록 삭제"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-col">
                                    {/* Block Metadata Bar */}
                                    <div className="px-6 py-4 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white rounded-lg transition-colors text-slate-300 hover:text-indigo-600">
                                                <GripVertical size={16} />
                                            </div>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{img.section} Block</span>
                                        </div>
                                    </div>

                                    {/* Block Content */}
                                    <div className="relative min-h-[120px]">
                                        {img.type === 'product' ? (
                                            <div className="relative">
                                                <img
                                                    src={img.url}
                                                    className={`w-full block object-cover ${viewMode === 'mobile' ? 'max-h-[300px]' : 'max-h-[500px]'}`}
                                                    alt="Project Block"
                                                />
                                                {/* Overlay Text & Interaction */}
                                                <div className={`absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity group-hover:from-black/90`}>
                                                    <div
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e: React.FocusEvent<HTMLDivElement>) => updateText(img.id, e.target.innerText)}
                                                        className="text-white text-xl md:text-2xl font-black leading-tight outline-none p-3 hover:bg-white/10 rounded-2xl border border-transparent hover:border-white/20 transition-all cursor-text"
                                                    >
                                                        {img.copy}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4 text-white/40 text-[9px] font-bold uppercase tracking-widest">
                                                        <Plus size={10} /> Double click to expand image
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`p-12 text-center flex flex-col items-center justify-center ${selectedStyle.color}`}>
                                                <div
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e: React.FocusEvent<HTMLDivElement>) => updateText(img.id, e.target.innerText)}
                                                    className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed italic outline-none p-4 hover:bg-black/5 rounded-2xl border border-transparent hover:border-indigo-100 transition-all cursor-text w-full max-w-2xl"
                                                >
                                                    "{img.copy}"
                                                </div>
                                                {img.userName && (
                                                    <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em]">{img.userName} VERIFIED CUSTOMER</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {keptImages.length === 0 && (
                        <div className="py-40 text-center flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                                <Layers size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800">배치된 블록이 없습니다</h3>
                                <p className="text-slate-400 mt-1">스와이프 단계에서 추천 블록을 추가해 보세요.</p>
                            </div>
                            <button onClick={() => setStep(4)} className="text-indigo-600 font-black underline underline-offset-8">추천 블록 보러 가기</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile-only Bottom Action */}
            <div className="md:hidden flex gap-3 p-4 bg-white border-t">
                <button onClick={() => setStep(4)} className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold"><RotateCcw size={24} /></button>
                <button onClick={() => setStep(6)} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100">결과물 완성</button>
            </div>
        </div>
    );
};

export default Step5Editor;
