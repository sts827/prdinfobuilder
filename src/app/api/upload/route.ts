import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Filename and Content-Type are required' }, { status: 400 });
        }

        // Create a unique path
        const fileExt = filename.split('.').pop();
        const uniquePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Create signed upload URL
    const { data, error } = await supabase
      .storage
      .from('swipeshop-uploads') // Ensure this bucket exists in Supabase
      .createSignedUploadUrl(uniquePath);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      signedUrl: data.signedUrl,
      path: data.path, // Store this path to retrieve public URL later
      token: data.token
    });

  } catch (error) {
    console.error('Upload Setup Error:', error);
    return NextResponse.json({ error: 'Upload setup failed' }, { status: 500 });
  }
}
