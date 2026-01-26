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
}
