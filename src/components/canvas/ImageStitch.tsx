'use client';

import React, { useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export default function ImageStitch() {
    const { keptCards } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDownload = async () => {
        setIsProcessing(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = 860; // Standard detailed page width
            // Estimate height based on aspect ratio approx, strictly assuming images are compatible
            // For now, assume each card image maps to 860px width.
            // We need to load images to get natural height if variable, or fix height.
            // Let's assume input images are vertical ~ 1:1.5 ratio -> 860 * 1.5 height.
            // Or we wait for them to load.

            const imageElements = await Promise.all(
                keptCards.map((card) => {
                    return new Promise<HTMLImageElement>((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = card.imageUrl;
                    });
                })
            );

            // Calculate total height
            let totalHeight = 0;
            const heights = imageElements.map(img => {
                const aspect = img.height / img.width;
                return width * aspect;
            });
            totalHeight = heights.reduce((a, b) => a + b, 0);

            canvas.width = width;
            canvas.height = totalHeight;

            // Draw
            let currentY = 0;
            imageElements.forEach((img, i) => {
                const h = heights[i];
                ctx.drawImage(img, 0, currentY, width, h);
                currentY += h;
            });

            // Export
            const dataUrl = canvas.toDataURL('image/webp', 0.9);

            // Trigger DL
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `swipeshop-detail-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Stitch failed', error);
      alert('Failed to merge images. See console.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (keptCards.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button 
        size="lg" 
        onClick={handleDownload} 
        disabled={isProcessing}
        className="shadow-2xl text-lg px-8 py-6 rounded-full"
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
        ) : (
          <><Download className="mr-2 h-5 w-5" /> Download ({keptCards.length})</>
        )}
      </Button>
    </div>
  );
}
