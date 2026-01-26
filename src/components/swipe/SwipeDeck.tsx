'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { useAppStore, SwipeCard } from '@/store/useAppStore';

export default function SwipeDeck() {
    const { generatedCards, addKeptCard, removeCard } = useAppStore();

    if (generatedCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
                <p className="text-muted-foreground">Download your merged design below.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-sm mx-auto h-[600px] flex items-center justify-center">
            {generatedCards.map((card, index) => (
                <CardItem
                    key={card.id}
                    card={card}
                    isTop={index === generatedCards.length - 1}
                    onSwipe={(dir) => {
                        if (dir === 'right') addKeptCard(card);
                        removeCard(card.id);
                    }}
                />
            ))}
        </div>
    );
}

function CardItem({ card, isTop, onSwipe }: { card: SwipeCard, isTop: boolean, onSwipe: (dir: 'left' | 'right') => void }) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = async (event: any, info: PanInfo) => {
        const threshold = 100;
        const velocity = info.velocity.x;

        if (info.offset.x > threshold || velocity > 500) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe('right');
        } else if (info.offset.x < -threshold || velocity < -500) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
            onSwipe('left');
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                zIndex: isTop ? 10 : 1
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            className={`absolute w-full h-full bg-white rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border border-border ${!isTop && 'top-0 left-0 pointer-events-none'}`}
        >
            <div className="relative h-full flex flex-col">
                <div className="relative flex-1 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={card.imageUrl}
                        alt="Generated Design"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                </div>

                <div className="p-6 bg-white dark:bg-card h-1/3 flex flex-col justify-center border-t border-border">
                    <p className="text-xl font-medium text-foreground text-center">
                        {card.copy || "Premium Design"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
