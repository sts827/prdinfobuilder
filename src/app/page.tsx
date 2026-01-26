'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import SwipeDeck from '@/components/swipe/SwipeDeck';
import ImageStitch from '@/components/canvas/ImageStitch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { uploadedImage, generatedCards, isGenerating, setUploadedImage, setGeneratedCards, setIsGenerating } = useAppStore();
  const [productName, setProductName] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For MVP fast prototype: Create local object URL immediately
    // In real app, we upload to Supabase -> get URL.
    // Let's do the "Direct Upload" simulation for speed unless we strictly need the Supabase URL for backend.
    // Yes, Backend needs a public URL.

    setIsGenerating(true);

    try {
      // 1. Get Signed URL (Mocked for direct storage upload if needed, or just upload to public bucket)
      // Simulating upload...

      // Since we don't have a real running UI for file picking usually, we used input.
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Supabase Bucket via helper (omitted here for brevity, using URL.createObjectURL for "local features" 
      // but Backend needs access.
      // CRITICAL: Backend (Gemini) cannot access localhost blob: urls.
      // So we MUST upload to Supabase.

      const { signedUrl, path, token } = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      }).then(r => r.json());

      // Real upload to Supabase
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      // Construct public URL (assuming public bucket 'swipeshop-uploads')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/swipeshop-uploads/${path}`;
      
      setUploadedImage(imageUrl);

      // 2. Generate content
      const startRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, productName })
      });
      
      const data = await startRes.json();
      if (data.cards) {
        setGeneratedCards(data.cards);
      }

    } catch (e) {
      console.error(e);
      alert('Error during process');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-900 dark:to-gray-950 p-4">
      {/* Header */}
      <header className="flex justify-between items-center max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          SwipeShop
        </h1>
        <Button variant="ghost">About</Button>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-10">
        <AnimatePresence mode="wait">
          {!uploadedImage ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 text-center border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors shadow-lg">
                <div className="mb-6 bg-purple-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center text-purple-600">
                  <Upload size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Upload Product</h2>
                <p className="text-gray-500 mb-6">Zero-editing. Just swipe to build.</p>
                
                <input 
                  type="text" 
                  placeholder="Product Name (e.g. Nike Air)" 
                  className="w-full mb-4 p-2 border rounded"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                    Select Image
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : isGenerating ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-purple-600 mb-6" />
              <h3 className="text-2xl font-bold">Designing variations...</h3>
              <p className="text-gray-500">Our AI designers are at work.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="swipe"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <SwipeDeck />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ImageStitch />
    </main>
  );
}
