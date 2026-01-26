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
        if (!apiKey || apiKey === 'your-gemini-api-key') {
            return NextResponse.json({ error: 'Server AI configuration missing or invalid' }, { status: 500 });
        }
        const aiService = new GeminiAdapter(apiKey);

        // 3. Execute AI Pipeline in Parallel
        // We run all independent tasks concurrently to reduce total wait time.
        const [bgRemovedImage, backgrounds, copies] = await Promise.all([
            aiService.removeBackground(imageUrl),
            aiService.generateBackgrounds(imageUrl, 10),
            aiService.generateCopy(productName || 'Product')
        ]);

        // 4. Construct Response
        // Create card objects combining backgrounds and copy.
        const cards = backgrounds.map((bgUrl, index) => ({
            id: `card-${Date.now()}-${index}`,
            imageUrl: bgUrl,
            copy: copies[index % copies.length] || 'Discover perfection.', // Fallback copy
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
