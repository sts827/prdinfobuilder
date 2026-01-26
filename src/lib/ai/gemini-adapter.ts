
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { AIService } from './interface';

export class GeminiAdapter implements AIService {
  private genAI: GoogleGenerativeAI;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private textModel: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private imageModel: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);

    // 1. General Intelligence Model (Text generation, logic)
    // User requested: gemini-2.5-flash
    this.textModel = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        }
      }
    });

    // 2. Image Related Model (Vision, Editing, Multimodal)
    // User requested: gemini-2.5-flash-image
    this.imageModel = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
      // Note: Image models might have different schemas or just free-form text depending on task.
      // We configure it for JSON as well if we expect structured edits.
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
  }

  async removeBackground(imageUrl: string): Promise<Blob | string> {
    console.warn('Gemini-only background removal is experimental. Returning original for MVP.');
    return imageUrl;
  }

  async generateBackgrounds(imageUrl: string, count: number): Promise<string[]> {
    // Background generation is a "Creative/Visual" task -> Use Image Model
    const gradients = [
      'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
      'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
      'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      'radial-gradient(circle at 10% 20%, rgb(255, 197, 61) 0%, rgb(255, 94, 7) 90%)',
      'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
      'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)'
    ];

    // In future: await this.imageModel.generateContent(...)
    const shuffled = gradients.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async generateCopy(productName: string): Promise<string[]> {
    // Copywriting is a "Text/Logic" task -> Use Text Model
    const prompt = `Generate 3 catchy, short marketing copy variations for a product named "${productName}".`;

    try {
      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Gemini Copy Gen Error:', error);
      return [
        `Upgrade your style with ${productName} `,
        `Experience the best of ${productName} `,
        `${productName}: Simply amazing`
      ];
    }
  }

  async editImage(imageUrl: string, prompt: string): Promise<import('./interface').DesignEdit> {
    // Image Editing/Styling is a "Visual" task -> Use Image Model
    const analysisPrompt = `You are a professional UX / UI Designer. 
    Review this request: "${prompt}". 
    Generate a JSON object with CSS 'filters'(like contrast, brightness, hue - rotate) and a CSS 'overlay'(gradient or pattern) to achieve this look.
    Also provide a short 'description' and a catchy 'suggestedCopy'.
  Example: { "filters": "contrast(1.2) sepia(0.2)", "overlay": "linear-gradient(45deg, rgba(0,0,0,0.2), transparent)", "description": "Vintage mood", "suggestedCopy": "Classic Vibes" } `;

    try {
      const result = await this.imageModel.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || "{}";
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Edit Image Error:', error);
      return {
        filters: '',
        overlay: '',
        description: 'Could not apply AI edit',
        suggestedCopy: 'Keep it original'
      };
    }
  }

  async upscaleImage(imageUrl: string): Promise<string> {
      // Native Upscaling using Vision Model
      const prompt = "Upscale this image, improving clarity, details and lighting. Output high resolution.";

      try {
        console.log('Requesting Upscale for:', imageUrl);
        // Mock return for MVP
        return imageUrl;
      } catch (error) {
        console.error('Upscale Error:', error);
        return imageUrl;
      }
  }
}

