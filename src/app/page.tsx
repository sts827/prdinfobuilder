"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Type,
  Palette,
  Layers,
  Sparkles,
  Download,
  Smartphone,
  Monitor,
  Layout as LayoutIcon,
  Pencil,
  Plus,
  Files,
  ExternalLink,
  Settings,
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

// Types & Constants
import type { Purpose, StyleOption, CardData } from '@/types/swipeshop';
import { PURPOSES, STYLES } from '@/constants/swipeshop';

// Components
import { ProgressBar } from '@/components/swipeshop/ProgressBar';
import Step1Purpose from '@/components/swipeshop/steps/Step1Purpose';
import Step2Input from '@/components/swipeshop/steps/Step2Input';
import Step3Style from '@/components/swipeshop/steps/Step3Style';
import Step4Swipe from '@/components/swipeshop/steps/Step4Swipe';
import Step5Editor from '@/components/swipeshop/steps/Step5Editor';
import Step6Export from '@/components/swipeshop/steps/Step6Export';

export default function Page() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'projects' | 'editor'>('projects');
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [showPurposeModal, setShowPurposeModal] = useState(false);

  // App State
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose>(PURPOSES[0]);
  const [images, setImages] = useState<string[]>([]);
  const [userInputText, setUserInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [keptImages, setKeptImages] = useState<CardData[]>([]);
  const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('mobile');
  const [isRefining, setIsRefining] = useState(false);

  // Device Detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setViewMode('pc');
      else setViewMode('mobile');
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update maxStepReached
  useEffect(() => {
    if (step > maxStepReached) setMaxStepReached(step);
  }, [step, maxStepReached]);

  // Mock Projects
  const [projects] = useState([
    { id: 1, name: '여름 시즌 쇼핑몰 상용구', date: '2026.01.28', type: 'shopping' },
    { id: 2, name: '신규 브랜드 런칭 기획안', date: '2026.01.25', type: 'business' },
  ]);

  // Sidebar Menu Items
  const SIDEBAR_ITEMS = [
    { id: 'projects', icon: <Files size={22} />, label: '프로젝트' },
    { id: 'editor', icon: <LayoutIcon size={22} />, label: '에디터' },
    { id: 'settings', icon: <Settings size={22} />, label: '설정' },
  ];

  // Editor Steps (Sub-Sidebar)
  const EDITOR_STEPS = [
    { id: 1, icon: <Home size={16} />, label: '목적' },
    { id: 2, icon: <Type size={16} />, label: '입력' },
    { id: 3, icon: <Palette size={16} />, label: '스타일' },
    { id: 4, icon: <Sparkles size={16} />, label: '스와이프' },
    { id: 5, icon: <Layers size={16} />, label: '편집' },
  ];

  // --- Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(results => {
        setImages(prev => {
          const combined = [...prev, ...results];
          return combined.slice(0, 5);
        });
        if (step === 1) setStep(2);
      });
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let mockResults: CardData[] = [];

      // Helper to get user image by index with cycling and fallback
      const getImg = (idx: number) => {
        if (images.length > 0) return images[idx % images.length];
        const fallbacks = [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=600',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=600',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&h=600',
          'https://images.unsplash.com/photo-1525966222134-fcfa99bafb71?q=80&w=600&h=600'
        ];
        return fallbacks[idx % fallbacks.length];
      };

      if (selectedPurpose.id === 'shopping') {
        mockResults = [
          { id: 'h1', url: getImg(0), section: 'Hero', copy: '감각적인 일상을 완성하는 최고의 선택', layoutType: 'overlay', type: 'product' },
          { id: 'h2', url: getImg(1), section: 'Hero', copy: '오늘만 만나는 특별한 가격, 지금 확인하세요', layoutType: 'split', type: 'product' },
          { id: 'd1', url: getImg(2), section: 'Detail', copy: '정교한 마감과 고품질 소재의 완벽한 조화', layoutType: 'split', type: 'product' },
          { id: 'd2', url: getImg(3), section: 'Detail', copy: '직접 경험해보면 알 수 있는 차원이 다른 편안함', layoutType: 'overlay', type: 'product' },
          { id: 'r1', url: '', section: 'Review', copy: '기대 이상으로 너무 예뻐요! 강력 추천합니다.', layoutType: 'review-card', type: 'text', userName: '김*린', rating: 5 },
          { id: 'r2', url: '', section: 'Review', copy: '배송도 빠르고 제품 퀄리티가 정말 좋네요.', layoutType: 'review-card', type: 'text', userName: '이*우', rating: 4 },
          { id: 'b1', url: getImg(0), section: 'Banner', copy: '신규 회원 가입 시 10% 추가 할인 혜택', layoutType: 'overlay', type: 'product' },
        ];
      } else if (selectedPurpose.id === 'portfolio') {
        mockResults = [
          { id: 'ph1', url: getImg(0), section: 'Hero', copy: '창의적인 생각과 기술을 담은 포트폴리오', layoutType: 'overlay', type: 'product' },
          { id: 'ph2', url: getImg(1), section: 'Hero', copy: '문제를 해결하는 디자인, 가치를 만드는 작업', layoutType: 'split', type: 'product' },
          { id: 'pi1', url: '', section: 'Info', copy: '저는 5년차 UX/UI 디자이너로서 사용자 중심의 경험을 설계합니다.', layoutType: 'text-block', type: 'text' },
          { id: 'pv1', url: getImg(2), section: 'Vision', copy: '단순한 아름다움을 넘어선 기능적 가치', layoutType: 'overlay', type: 'product' },
        ];
      } else {
        mockResults = [
          { id: 'gh1', url: getImg(0), section: 'Hero', copy: userInputText || '당신의 상상을 현실로 만드는 공간', layoutType: 'overlay', type: 'product' },
          { id: 'gh2', url: getImg(1), section: 'Hero', copy: '우리가 추구하는 더 나은 미래의 모습', layoutType: 'split', type: 'product' },
          { id: 'gi1', url: '', section: 'Info', copy: '더 자세한 정보와 소식은 아래에서 확인하세요.', layoutType: 'text-block', type: 'text' },
          { id: 'gv1', url: getImg(2), section: 'Vision', copy: '끊임없는 혁신과 도전을 통한 도약', layoutType: 'overlay', type: 'product' },
        ];
      }

      setCards(mockResults);
      setIsAnalyzing(false);
      setStep(4);
    }, 1500);
  };

  const handleRefineWithAI = (id: string) => {
    setIsRefining(true);
    setTimeout(() => {
      setKeptImages(prev => prev.map(img =>
        img.id === id ? { ...img, copy: `${img.copy} ✨` } : img
      ));
      setIsRefining(false);
    }, 800);
  };

  const handleSwipe = (direction: 'left' | 'right', card: CardData) => {
    if (direction === 'right') {
      setKeptImages((prev: CardData[]) => {
        if (prev.find(c => c.id === card.id)) return prev;
        return [...prev, card];
      });
    }
    setCards((prev: CardData[]) => prev.filter((c: CardData) => c.id !== card.id));
  };

  const toggleCard = (card: CardData) => {
    setKeptImages(prev => {
      const isAdded = prev.some(c => c.id === card.id);
      if (isAdded) {
        return prev.filter(c => c.id !== card.id);
      } else {
        return [...prev, card];
      }
    });
  };

  const addNewBlock = (prompt: string) => {
    const newId = `custom-${Date.now()}`;
    const newBlock: CardData = {
      id: newId,
      url: images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=600',
      section: 'Custom',
      copy: prompt,
      layoutType: 'overlay',
      type: 'product'
    };
    setCards(prev => [newBlock, ...prev]);
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setKeptImages(prev => prev.filter(c => c.id !== id));
  };

  const updateText = (id: string, newText: string) => {
    setKeptImages(prev => prev.map(img =>
      img.id === id ? { ...img, copy: newText } : img
    ));
  };

  const deleteBlock = (id: string) => {
    setKeptImages(prev => prev.filter(img => img.id !== id));
  };

  const startNewProject = (purpose: Purpose) => {
    setSelectedPurpose(purpose);
    setKeptImages([]);
    setCards([]);
    setImages([]); // Changed from setImage(null) to setImages([])
    setUserInputText("");
    setMaxStepReached(1);
    setShowPurposeModal(false);
    setActiveTab('editor');
    setStep(2); // Start at Input step after purpose is selected
  };

  useEffect(() => {
    if (step === 4 && cards.length === 0 && keptImages.length > 0) setStep(5);
  }, [cards, keptImages, step]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F1F3F5] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* 1. PC Main Sidebar (LNB) */}
      <aside className="hidden md:flex w-[72px] flex-col items-center py-6 bg-slate-900 z-50 shrink-0">
        <div
          onClick={() => setActiveTab('projects')}
          className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-10 shadow-lg shadow-black/20 italic font-black transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          S
        </div>
        <div className="flex flex-col gap-4">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              title={item.label}
            >
              {item.icon}
              <span className="text-[8px] font-bold tracking-tighter leading-none mt-1">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-6 items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] text-white font-bold cursor-pointer">JS</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* 2. PC Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <LayoutIcon size={18} />
              </div>
              <h1 className="font-black text-lg tracking-tight text-slate-800 uppercase italic">SwipeShop</h1>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm font-medium">
              <span
                className={`cursor-pointer ${activeTab === 'projects' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}
                onClick={() => setActiveTab('projects')}
              >워크스페이스</span>
              <span className="text-slate-200">/</span>
              {activeTab === 'editor' && (
                <span className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-bold flex items-center gap-2">
                  {selectedPurpose.name} 프로젝트 <Pencil size={12} className="text-indigo-300" />
                </span>
              )}
              {activeTab === 'projects' && (
                <span className="text-slate-400">내 프로젝트 목록</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-2">
              <button onClick={() => setViewMode('mobile')} className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}><Smartphone size={14} /> 모바일</button>
              <button onClick={() => setViewMode('pc')} className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'pc' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}><Monitor size={14} /> PC</button>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4">
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <ExternalLink size={14} /> Figma 연동
              </button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg shadow-black/10 hover:bg-black transition-all flex items-center gap-2 active:scale-95">
                <Download size={14} /> 내보내기
              </button>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 md:hidden" onClick={() => (activeTab === 'projects' ? setStep(1) : setActiveTab('projects'))}><X size={24} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative bg-[#F1F3F5]">

          <AnimatePresence mode="wait">
            {activeTab === 'projects' ? (
              /* --- 프로젝트 관리 화면 (Dashboard) --- */
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col p-10 overflow-y-auto"
              >
                <div className="max-w-5xl mx-auto w-full">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight">내 프로젝트</h2>
                      <p className="text-slate-400 mt-1">완성된 상세페이지와 기획안을 관리하세요.</p>
                    </div>
                    <button
                      onClick={() => setShowPurposeModal(true)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <Plus size={20} /> 새 프로젝트 만들기
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                      <div key={p.id} onClick={() => { setActiveTab('editor'); setStep(5); setMaxStepReached(5); }} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <LayoutIcon size={24} />
                        </div>
                        <h3 className="font-black text-slate-800 text-lg mb-1">{p.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{p.type} • {p.date}</p>
                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-50">
                          <span className="text-[10px] font-black text-indigo-600/60 uppercase">Final Optimized</span>
                          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purpose Selection Modal */}
                <AnimatePresence>
                  {showPurposeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPurposeModal(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                      >
                        <div className="p-10">
                          <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">어떤 페이지를 만드나요?</h2>
                            <p className="text-slate-400 mt-2">제작 목적에 맞는 AI 가이드라인을 제공해 드립니다.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {PURPOSES.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => startNewProject(p)}
                                className="flex flex-col items-start p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left group"
                              >
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-colors">
                                  <LayoutIcon size={24} />
                                </div>
                                <span className="text-lg font-black text-slate-800">{p.name}</span>
                                <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-6 flex justify-end gap-3">
                          <button onClick={() => setShowPurposeModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600">취소</button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* --- 에디터 화면 (Editor Layout) --- */
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex overflow-hidden w-full"
              >
                {/* 3. Editor Sub-Sidebar (Step Selector) */}
                <aside className="hidden md:block w-72 bg-white border-r border-slate-200 overflow-y-auto z-30 shadow-[10px_0_40px_rgba(0,0,0,0.02)] scrollbar-hide shrink-0">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Editing Workflow</span>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                      {EDITOR_STEPS.map((s) => {
                        const isLocked = s.id > maxStepReached && s.id !== 1;
                        return (
                          <button
                            key={s.id}
                            disabled={isLocked}
                            onClick={() => setStep(s.id)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${step === s.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : isLocked ? 'opacity-40 cursor-not-allowed text-slate-300' : 'text-slate-500 hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${step === s.id ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                                {isLocked ? <Lock size={16} /> : s.icon}
                              </div>
                              <span className="text-sm font-bold">{s.label}</span>
                            </div>
                            {(step > s.id || maxStepReached > s.id) && !isLocked && (
                              <CheckCircle2 size={14} className="text-indigo-400" />
                            )}
                          </button>
                        );
                      })}
                    </nav>

                    <div className="mt-10 pt-10 border-t border-slate-100">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {step === 4 || step === 5 ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">레이어 구조</h4>
                                <span className="text-[10px] font-bold text-indigo-600">{keptImages.length} Blocks</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                {keptImages.map((img, i) => (
                                  <div key={img.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="text-[9px] font-black text-slate-300">0{i + 1}</span>
                                      <span className="text-[10px] font-bold text-slate-600 truncate">{img.section}</span>
                                    </div>
                                    <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteBlock(img.id)}>
                                      <X size={12} className="text-slate-400 hover:text-rose-500" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 rounded-2xl p-5 border border-dashed border-slate-200">
                              <p className="text-[11px] font-bold text-slate-400 leading-relaxed text-center italic">
                                좌측 메뉴를 선택하거나 중앙 캔버스에서 직접 편집하세요.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </aside>

                {/* 4. Canvas Area */}
                <main className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px]">

                  <div className={`transition-all duration-700 ease-in-out relative ${viewMode === 'mobile'
                    ? 'w-[375px] h-[812px] rounded-[56px] border-[12px] border-[#1A1D1F] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]'
                    : 'w-[95%] h-[95%] rounded-[32px] border border-slate-200 shadow-2xl overflow-y-auto bg-slate-50/50'
                    } bg-white flex flex-col scrollbar-hide`}>

                    <div className="flex-1 relative flex flex-col">
                      {/* Mobile-only View Elements */}
                      <div className="md:hidden">
                        <ProgressBar step={step} />
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="h-full w-full"
                        >
                          {/* 캔버스 내부 콘텐츠 분기 */}
                          {step === 4 ? (
                            <Step4Swipe
                              selectedPurpose={selectedPurpose}
                              selectedStyle={selectedStyle}
                              cards={cards}
                              keptImages={keptImages}
                              handleSwipe={handleSwipe}
                              toggleCard={toggleCard}
                              deleteCard={deleteCard}
                              addNewBlock={addNewBlock}
                              setStep={setStep}
                            />
                          ) : step === 2 ? (
                            <Step2Input
                              selectedPurpose={selectedPurpose}
                              images={images}
                              setImages={setImages}
                              userInputText={userInputText}
                              setUserInputText={setUserInputText}
                              handleFileUpload={handleFileUpload}
                              setStep={setStep}
                            />
                          ) : step === 6 ? (
                            <Step6Export
                              selectedPurpose={selectedPurpose}
                              setStep={setStep}
                              setKeptImages={setKeptImages}
                              setCards={setCards}
                              setImages={setImages}
                              setUserInputText={setUserInputText}
                            />
                          ) : (
                            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                              {/* Mobile-only Step Rendering */}
                              <div className="md:hidden">
                                {step === 1 && <Step1Purpose selectedPurpose={selectedPurpose} setSelectedPurpose={setSelectedPurpose} setStep={setStep} />}
                                {step === 2 && <Step2Input selectedPurpose={selectedPurpose} images={images} setImages={setImages} userInputText={userInputText} setUserInputText={setUserInputText} handleFileUpload={handleFileUpload} setStep={setStep} />}
                                {step === 3 && <Step3Style selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} isAnalyzing={isAnalyzing} startAnalysis={startAnalysis} setStep={setStep} />}
                                {step === 5 && <Step5Editor selectedPurpose={selectedPurpose} selectedStyle={selectedStyle} keptImages={keptImages} setKeptImages={setKeptImages} viewMode={viewMode} setViewMode={setViewMode} isRefining={isRefining} handleRefineWithAI={handleRefineWithAI} deleteBlock={deleteBlock} updateText={updateText} setStep={setStep} />}
                              </div>

                              {/* PC-only Layout */}
                              <div className="hidden md:block h-full w-full">
                                {step === 1 && (
                                  <div className="h-full w-full flex items-center justify-center p-10">
                                    <div className="text-center">
                                      <CheckCircle2 size={48} className="text-indigo-600 mx-auto mb-4" />
                                      <h3 className="text-xl font-bold">목적 설정 완료</h3>
                                      <p className="text-slate-400 mt-1">다음 단계를 계속 진행해주세요.</p>
                                      <button onClick={() => setStep(2)} className="mt-6 text-indigo-600 font-bold underline">정보 입력하러 가기</button>
                                    </div>
                                  </div>
                                )}
                                {(step === 2 || step === 3) && (
                                  <div className="h-full w-full flex items-center justify-center p-10">
                                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border border-slate-100 p-10">
                                      {step === 2 && <Step2Input selectedPurpose={selectedPurpose} images={images} setImages={setImages} userInputText={userInputText} setUserInputText={setUserInputText} handleFileUpload={handleFileUpload} setStep={setStep} />}
                                      {step === 3 && <Step3Style selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} isAnalyzing={isAnalyzing} startAnalysis={startAnalysis} setStep={setStep} />}
                                    </div>
                                  </div>
                                )}
                                {step === 5 && (
                                  <Step5Editor
                                    selectedPurpose={selectedPurpose}
                                    selectedStyle={selectedStyle}
                                    keptImages={keptImages}
                                    setKeptImages={setKeptImages}
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                    isRefining={isRefining}
                                    handleRefineWithAI={handleRefineWithAI}
                                    deleteBlock={deleteBlock}
                                    updateText={updateText}
                                    setStep={setStep}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </main>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
