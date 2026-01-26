import { create } from 'zustand';

export interface SwipeCard {
    id: string;
    imageUrl: string;
    copy: string; // Marketing copy
    type: 'background' | 'copy';
}

interface AppState {
    uploadedImage: string | null;
    generatedCards: SwipeCard[];
    keptCards: SwipeCard[];
    isGenerating: boolean;

    setUploadedImage: (url: string) => void;
    setGeneratedCards: (cards: SwipeCard[]) => void;
    addKeptCard: (card: SwipeCard) => void;
    removeCard: (id: string) => void; // Remove from deck (swiped)
    setIsGenerating: (isGenerating: boolean) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    uploadedImage: null,
    generatedCards: [],
    keptCards: [],
    isGenerating: false,

    setUploadedImage: (url) => set({ uploadedImage: url }),
    setGeneratedCards: (cards) => set({ generatedCards: cards }),
    addKeptCard: (card) => set((state) => ({ keptCards: [...state.keptCards, card] })),
    removeCard: (id) => set((state) => ({
        generatedCards: state.generatedCards.filter((c) => c.id !== id)
    })),
    setIsGenerating: (loading) => set({ isGenerating: loading }),
    reset: () => set({
        uploadedImage: null,
        generatedCards: [],
        keptCards: [],
        isGenerating: false
    }),
}));
