import { ShoppingBag, Briefcase, Megaphone, BookOpen, User, Calendar } from 'lucide-react';
import type { Purpose, StyleOption } from '@/types/swipeshop';
import React from 'react';

export const PURPOSES: Purpose[] = [
    {
        id: 'shopping',
        name: '쇼핑몰',
        desc: '제품 판매 및 정보 전달',
        icon: <ShoppingBag size={22} />,
        color: 'bg-blue-50 text-blue-600',
        inputConfig: {
            imageLabel: '제품 이미지 (썸네일/상세)',
            textLabel: '제품 설명 및 홍보 문구',
            textPlaceholder: '제품의 특징, 가격, 제작 의도 등을 자세히 적어주세요. AI가 상세페이지 문구로 다듬어 드립니다.',
            multipleImages: true
        }
    },
    {
        id: 'business',
        name: '비즈니스 홍보',
        desc: '브랜드 가치 강조',
        icon: <Briefcase size={22} />,
        color: 'bg-indigo-50 text-indigo-600',
        inputConfig: {
            imageLabel: '회사/브랜드 이미지',
            textLabel: '회사 소개 및 비전',
            textPlaceholder: '회사가 추구하는 가치와 주요 사업 내용을 적어주세요.',
            multipleImages: true
        }
    },
    {
        id: 'event',
        name: '이벤트/프로젝트',
        desc: '혜택 강조 및 참여 유도',
        icon: <Megaphone size={22} />,
        color: 'bg-rose-50 text-rose-600',
        inputConfig: {
            imageLabel: '이벤트 배너/홍보물',
            textLabel: '이벤트 혜택 및 내용',
            textPlaceholder: '이벤트의 핵심 혜택(할인율 등)과 참여 기간을 적어주세요.',
            multipleImages: false
        }
    },
    {
        id: 'blog',
        name: '블로그/미디어',
        desc: '스토리텔링 중심',
        icon: <BookOpen size={22} />,
        color: 'bg-emerald-50 text-emerald-600',
        inputConfig: {
            imageLabel: '포스팅 관련 이미지',
            textLabel: '스토리 요약 및 핵심 내용',
            textPlaceholder: '독자에게 전달하고 싶은 핵심 메시지를 적어주세요.',
            multipleImages: true
        }
    },
    {
        id: 'portfolio',
        name: '포트폴리오',
        desc: '개인 역량 강조',
        icon: <User size={22} />,
        color: 'bg-amber-50 text-amber-600',
        inputConfig: {
            imageLabel: '작업물/본인 사진',
            textLabel: '자신에 대한 짧은 소개',
            textPlaceholder: '경력, 기술 스택, 추구하는 방향 등을 적어주세요.',
            multipleImages: true
        }
    },
    {
        id: 'booking',
        name: '예약/기타',
        desc: '공간 안내 및 예약',
        icon: <Calendar size={22} />,
        color: 'bg-slate-50 text-slate-600',
        inputConfig: {
            imageLabel: '공간/시설 이미지',
            textLabel: '이용 안내 및 예약 정보',
            textPlaceholder: '공간의 장점과 예약 시 주의사항을 적어주세요.',
            multipleImages: true
        }
    },
];

export const STYLES: StyleOption[] = [
    { id: 'minimal', name: '미니멀', prompt: 'clean white background', color: 'bg-slate-100' },
    { id: 'luxury', name: '럭셔리', prompt: 'dark elegant background', color: 'bg-zinc-800' },
    { id: 'nature', name: '자연주의', prompt: 'wooden table, soft sunlight', color: 'bg-emerald-50' },
    { id: 'urban', name: '어반/시크', prompt: 'concrete texture, neon lights', color: 'bg-stone-300' },
];

export const STEP_LABELS = ['목적', '입력', '스타일', '선택', '편집', '결과'] as const;
