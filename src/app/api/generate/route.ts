import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { GeminiAdapter } from '@/lib/ai/gemini-adapter';

// Allow 60 seconds for AI operations
export const maxDuration = 60;

// Initialize Rate Limiter (Fallback to allow all if env vars missing for dev)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const ratelimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute
    })
    : null;

export async function POST(req: NextRequest) {
    // 1. Rate Limiting
    if (ratelimit) {
        const ip = req.ip ?? '127.0.0.1';
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
    }

    try {
        const { imageUrl, productName } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // 2. Initialize AI Adapter
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Server AI configuration missing' }, { status: 500 });
        }
        const aiService = new GeminiAdapter(apiKey);

        // 3. Execute AI Pipeline
        // A. Remove Background (Gemini/Placeholder)
        const bgRemovedImage = await aiService.removeBackground(imageUrl);

        // B. Generate Backgrounds & Copy in parallel
        const [backgrounds, copies] = await Promise.all([
            aiService.generateBackgrounds(imageUrl, 10),
            aiService.generateCopy(productName || 'Product'),
        ]);

        // 4. Construct Response
        // We combine backgrounds with the copy. 
        // Since we have 10 BGs and 3 Copies, we can mix them randomly or just return lists.
        // The frontend expects "Cards".

        // Let's create card objects.
        const cards = backgrounds.map((bgUrl, index) => ({
            id: `card-${Date.now()}-${index}`,
      imageUrl: bgUrl,
      copy: copies[index % copies.length], // Cycle through copies
      type: 'background'
    }));

    return NextResponse.json({ 
      cards,
      processedImage: bgRemovedImage 
    });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
