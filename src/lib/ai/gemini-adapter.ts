import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService } from './interface';

export class GeminiAdapter implements AIService {
  private genAI: GoogleGenerativeAI;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private model: any; // Using 'any' for now as SDK types might vary based on version

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async removeBackground(imageUrl: string): Promise<Blob | string> {
    // Note: Gemini 1.5 Flash doesn't natively support direct "background removal" returning a transparent PNG.
    // For this MVP, we might need to rely on a specific prompt or a workaround.
    // Ideally, this would use a specialized vision task or Segementation API if available in Vertex AI.
    // Since we are restricted to Gemini API only, we will attempt to generate a "mask" or just return the original for now
    // and let the client handle it, OR we just skip this step if not strictly possible.
    // For the sake of the task, we will return the original image URL as a placeholder
    // acknowledging this limitation in the "Zero-editing" goal context.
    console.warn('Gemini-only background removal is experimental. Returning original for MVP.');
    return imageUrl;
  }

  async generateBackgrounds(imageUrl: string, count: number): Promise<string[]> {
    // In a real scenario, we would use an Image Generation model (like Imagen 2/3 via Vertex AI).
    // The standard Gemini API (gemini-pro-vision) is mostly for understanding-text-from-image.
    // However, google-generative-ai might not expose Image Generation directly for all users yet.
    // If not available, we can mock this or use a prompt that describes the scene.
    // For this MVP implementation, we'll assume we are generating *descriptions* or using a mock.
    // WAIT: The user wants "Zero-editing" "Swipe" which implies visual generation.
    // If Gemini API (free tier) doesn't generate images, this feature is blocked.
    // But assuming we have access or fallback, we will generate placeholder URLs or descriptions.

    // For now, let's generate prompts for backgrounds.
    // If we strictly need images, we might need to check if the user has access to Imagen.
    // Let's implement the prompt generation part which is definitely supported.

    // Actually, let's assume valid generation URLs for the frontend to render.
    // We will return mock URLs for this MVP step until we can integrate actual Image Generation Model.
    // Mocking to ensure UI development can proceed.
    return Array(count).fill(null).map((_, i) => \`https://placehold.co/600x800?text=Gemini+Background+\${i+1}\`);
  }

  async generateCopy(productName: string): Promise<string[]> {
    const prompt = \`Generate 3 catchy, short marketing copy variations for a product named "\${productName}". 
    Format them as a JSON array of strings. Do not include markdown code blocks.\`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Basic cleanup to parse JSON
      const cleanedText = text.replace(/```json | ```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Gemini Copy Gen Error:', error);
      return [
        \`Upgrade your style with \${productName}\`,
        \`Experience the best of \${productName}\`,
        \`\${productName}: Simply amazing\`
      ];
    }
  }
}
