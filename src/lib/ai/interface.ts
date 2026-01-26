export interface AIService {
    /**
     * Remove background from an image.
     * @param imageUrl The URL of the input image.
     * @returns A promise that resolves to the processed image (Blob or base64 data URL).
     */
    removeBackground(imageUrl: string): Promise<Blob | string>;

    /**
     * Generate background variations for a product image.
     * @param imageUrl The URL of the foreground product image.
     * @param count Number of backgrounds to generate.
     * @returns Array of generated image URLs.
     */
    generateBackgrounds(imageUrl: string, count: number): Promise<string[]>;

    /**
     * Generate marketing copy for a product.
     * @param productName Or description of the product.
     * @returns Array of marketing copy strings.
     */
    generateCopy(productName: string): Promise<string[]>;

    /**
     * Modify or enhance an image based on a user prompt.
     * Returns a structured design edit (CSS filters, overlays, or new background descriptions).
     * @param imageUrl The original image URL.
     * @param prompt User's instruction (e.g. "Make it moody", "Add snowfall").
     */
    editImage(imageUrl: string, prompt: string): Promise<DesignEdit>;
}

export interface DesignEdit {
    filters?: string; // CSS filter string (e.g. "contrast(1.2) sepia(0.5)")
    overlay?: string; // CSS background/overlay (e.g. "linear-gradient(...)")
    description?: string; // Text description of what was done
    suggestedCopy?: string; // Optional new copy based on the edit
}
