import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Quote, RotateCcw, Plus, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import type { Purpose, StyleOption, CardData } from '@/types/swipeshop';

interface Step4SwipeProps {
    selectedPurpose: Purpose;
    selectedStyle: StyleOption;
    cards: CardData[];
    keptImages: CardData[];
    handleSwipe: (direction: 'left' | 'right', card: CardData) => void;
    toggleCard: (card: CardData) => void;
    deleteCard: (id: string) => void;
    addNewBlock: (prompt: string) => void;
    setStep: (s: number) => void;
}

const Step4Swipe: React.FC<Step4SwipeProps> = ({
    selectedPurpose,
    selectedStyle,
    cards,
    keptImages,
    handleSwipe,
    toggleCard,
    deleteCard,
    addNewBlock,
    setStep
}) => {
    const recommendedCards = cards.filter(c => !c.id.startsWith('custom-'));
    const hasRecommendations = recommendedCards.length > 0;
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [prompt, setPrompt] = React.useState('');

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            addNewBlock(prompt);
            setPrompt('');
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {/* Mobile View (Existing Swipe Logic) */}
            <div className="md:hidden flex flex-col items-center px-2 pt-4 pb-8 h-full">
                <h2 className="text-2xl font-black mb-1 text-slate-800 tracking-tight">블록을 고르세요</h2>
                <p className="text-[11px] text-slate-400 mb-5 font-bold uppercase tracking-widest leading-none">
                    {selectedPurpose.name} 전용 큐레이션
                </p>
                <div className="relative w-full aspect-[4/5] max-w-[260px] mb-6">
                    <AnimatePresence>
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                className="absolute inset-0 bg-white rounded-[40px] shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-50 flex flex-col"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1 - index * 0.05, y: -index * 12, opacity: 1, zIndex: cards.length - index }}
                                exit={{ x: 1000, opacity: 0 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, info) => {
                                    if (info.offset.x > 80) handleSwipe('right', card);
                                    else if (info.offset.x < -80) handleSwipe('left', card);
                                }}
                            >
                                <div className="absolute top-5 left-5 bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md z-10 tracking-widest uppercase">
                                    {card.section}
                                </div>
                                {card.type === 'product' ? (
                                    <>
                                        <img src={card.url} alt="AI Result" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                                            <p className="text-lg font-black leading-tight tracking-tight">{card.copy}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${selectedStyle.color}`}>
                                        <Quote className="text-indigo-200 mb-5" size={40} />
                                        <p className="text-base font-bold text-slate-700 leading-relaxed mb-5 italic">"{card.copy}"</p>
                                        {card.userName && (
                                            <div className="flex flex-col items-center">
                                                <div className="flex text-amber-400 gap-1 mb-1.5">
                                                    {[...Array(card.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.userName}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="flex gap-6 items-center">
                    <button onClick={() => setStep(3)} className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-slate-50 active:scale-90 transition-all">
                        <RotateCcw size={20} />
                    </button>
                    {cards.length > 0 && (
                        <>
                            <button onClick={() => handleSwipe('left', cards[0])} className="w-13 h-13 rounded-full bg-white shadow-xl flex items-center justify-center text-rose-500 border border-slate-50 hover:bg-rose-50 active:scale-90 transition-all"><X size={28} strokeWidth={3} /></button>
                            <button onClick={() => handleSwipe('right', cards[0])} className="w-13 h-13 rounded-full bg-white shadow-xl flex items-center justify-center text-emerald-500 border border-slate-50 hover:bg-emerald-50 active:scale-90 transition-all"><Check size={28} strokeWidth={3} /></button>
                        </>
                    )}
                </div>
            </div>

            {/* PC View (Grid Curation Logic) */}
            <div className="hidden md:flex flex-col h-full bg-[#F8F9FA]">
                <div className="p-8 border-b bg-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-indigo-600" size={20} />
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">AI Curation Pool</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">블록 큐레이션</h2>
                            <p className="text-slate-400 text-sm mt-1">AI가 생성한 최적의 블록들입니다. 페이지에 추가할 블록을 선택하세요.</p>
                        </div>
                        <div className="relative group">
                            <button
                                onClick={() => setStep(5)}
                                disabled={keptImages.length === 0}
                                className={`px-8 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 ${keptImages.length > 0
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                편집 단계로 넘어가기
                                {keptImages.length > 0 && (
                                    <span className="ml-2 bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full text-white">
                                        {keptImages.length}
                                    </span>
                                )}
                            </button>
                            {keptImages.length === 0 && (
                                <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-slate-800 text-white text-[10px] py-2 px-3 rounded-lg whitespace-nowrap shadow-xl">
                                        최소 1개 이상의 블록을 추가해야 편집할 수 있습니다.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <AnimatePresence mode="popLayout">
                            {cards.map((card) => {
                                const isAdded = keptImages.some(c => c.id === card.id);
                                return (
                                    <motion.div
                                        key={card.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 flex flex-col h-[400px] ${isAdded ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}`}
                                    >
                                        {/* Block Badge (Top Left) */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                {card.section}
                                            </span>
                                        </div>

                                        {/* Delete from Pool (Top Right) */}
                                        <div className="absolute top-4 right-4 z-30">
                                            <button
                                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteCard(card.id); }}
                                                className="w-9 h-9 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-50 shadow-sm border border-slate-100 transition-all active:scale-90"
                                                title="추천에서 제외"
                                            >
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>

                                        {/* Main Content Area */}
                                        <div className="flex-1 overflow-hidden relative bg-slate-50">
                                            {card.type === 'product' ? (
                                                <img src={card.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Block Content" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                                    <Quote className="text-slate-200 mb-4" size={32} />
                                                    <p className="text-sm font-bold text-slate-600 line-clamp-4 leading-relaxed">"{card.copy}"</p>
                                                </div>
                                            )}

                                            {/* Selection Toggle (Bottom Right) */}
                                            <div className="absolute bottom-4 right-4 z-30">
                                                <button
                                                    onClick={() => toggleCard(card)}
                                                    className={`w-11 h-11 rounded-2xl shadow-2xl flex items-center justify-center transition-all active:scale-90 border-2 ${isAdded
                                                            ? "bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-600/20"
                                                            : "bg-white/95 backdrop-blur-sm text-slate-200 hover:text-indigo-600 border-slate-100"
                                                        }`}
                                                >
                                                    <Check size={22} strokeWidth={4} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Footer (Info) */}
                                        <div className={`p-6 transition-colors ${isAdded ? 'bg-indigo-50/30' : 'bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.type}</p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 truncate leading-none">{card.copy}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* AI Generation Box - Smarter Empty State */}
                            <motion.div
                                layout
                                className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 border-dashed border-indigo-200 flex flex-col min-h-[400px] ${!hasRecommendations ? 'col-span-full md:col-span-2 lg:col-span-1 bg-gradient-to-br from-white via-indigo-50/20 to-white' : 'bg-gradient-to-br from-white to-indigo-50/30'}`}
                            >
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                            <p className="font-black text-indigo-600 animate-pulse">새로운 블록을<br />디자인하고 있습니다...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {!hasRecommendations ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-slate-200 mb-4 border border-slate-50">
                                                        <Sparkles size={32} />
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-800">모든 추천 블록을 검토했습니다</h3>
                                                    <p className="text-sm text-slate-400 mt-1 mb-6">찾으시는 스타일이 없다면 다시 설정하거나<br />아래에 구체적으로 요청해 보세요.</p>
                                                    <button
                                                        onClick={() => setStep(3)}
                                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                                                    >
                                                        <RotateCcw size={14} /> 스타일 다시 정하기
                                                    </button>
                                                    <div className="w-full h-px bg-slate-100 my-8 flex items-center justify-center">
                                                        <span className="bg-white px-4 text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">or create with ai</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-indigo-600">
                                                        <Sparkles size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-lg">AI에게 요청하기</p>
                                                        <p className="text-slate-400 text-sm font-medium">원하는 구성이나 내용을<br />자유롭게 적어주세요.</p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="p-4 bg-white border-t">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                            disabled={isGenerating}
                                            placeholder="예: 혜택을 강조한 화려한 배너"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm font-bold focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                                        />
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="absolute right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-200 transition-all active:scale-90"
                                        >
                                            <Check size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step4Swipe;
