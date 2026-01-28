import React from 'react';
import { Camera, Check, MessageSquare, RotateCcw, X, Plus } from 'lucide-react';
import type { Purpose } from '@/types/swipeshop';

interface Step2InputProps {
    selectedPurpose: Purpose;
    images: string[];
    setImages: (imgs: string[]) => void;
    userInputText: string;
    setUserInputText: (t: string) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setStep: (s: number) => void;
}

const Step2Input: React.FC<Step2InputProps> = ({
    selectedPurpose,
    images,
    setImages,
    userInputText,
    setUserInputText,
    handleFileUpload,
    setStep
}) => {
    const config = selectedPurpose.inputConfig;

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full px-2 pt-1 pb-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black mb-1 text-slate-800 tracking-tight">내용을 채워주세요</h2>
                <p className="text-slate-400 text-[13px] font-medium leading-none">{selectedPurpose.name} 페이지 정보를 입력하세요.</p>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto scrollbar-hide">
                {/* Image Upload Section */}
                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{config.imageLabel}</span>
                        <span className="text-[10px] font-bold text-indigo-400">{images.length} / {config.multipleImages ? 5 : 1}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm group ring-2 ring-white">
                                <img src={img} className="w-full h-full object-cover" alt="preview" />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                                    <Check size={16} className="text-white drop-shadow-md" />
                                </div>
                            </div>
                        ))}

                        {(config.multipleImages ? images.length < 5 : images.length < 1) && (
                            <label className="w-20 h-20 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-white hover:bg-slate-50">
                                <Plus size={24} className="text-slate-300" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} multiple={config.multipleImages} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Text Description Section */}
                <div className="bg-white border border-slate-100 rounded-[28px] p-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{config.textLabel}</span>
                    </div>
                    <textarea
                        className="w-full h-32 resize-none outline-none text-[14px] placeholder:text-slate-300 font-medium leading-relaxed scrollbar-hide"
                        placeholder={config.textPlaceholder}
                        value={userInputText}
                        onChange={(e) => setUserInputText(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6 flex gap-3 pb-2">
                <button onClick={() => setStep(1)} className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-colors"><RotateCcw size={24} /></button>
                <button
                    onClick={() => setStep(3)}
                    disabled={images.length === 0 && !userInputText?.trim()}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold disabled:bg-slate-100 disabled:text-slate-300 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                    스타일 선택하기
                </button>
            </div>
        </div>
    );
};

export default Step2Input;
