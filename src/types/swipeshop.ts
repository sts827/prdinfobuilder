import React from 'react';

export interface Purpose {
    id: string;
    name: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    inputConfig: {
        imageLabel: string;
        textLabel: string;
        textPlaceholder: string;
        multipleImages: boolean;
    };
}

export interface StyleOption {
    id: string;
    name: string;
    prompt: string;
    color: string;
}

// 레이아웃 타입 정의
export type LayoutType = 'overlay' | 'split' | 'review-card' | 'text-block';

export interface CardData {
    id: string;
    url: string;
    section: string;
    copy: string;
    layoutType: LayoutType;
    type: 'product' | 'text';
    userName?: string;
    rating?: number;
}

export type ViewMode = 'mobile' | 'pc';
export type SwipeDirection = 'left' | 'right';
