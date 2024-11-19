import { generateImage } from './api-handlers.js';

const CLASS_NAMES = {
    imagePlaceholder: 'image-placeholder',
    loadingSpinner: 'loading-spinner',
    generationStatus: 'generation-status',
    generatedImage: 'generated-image',
    imageControls: 'image-controls',
    toast: 'toast',
};

class ImageHandler {
    constructor() {
        this.imageService = 'dalle'; // Default service
        this.pendingGenerations = new Set();
        this.maxConcurrentGenerations = 3;
    }

    async handleImageRequest(prompt) {
        if (this.pendingGenerations.size >= this.maxConcurrentGenerations) {
            throw new Error('Too many pending image generations. Please wait.');
        }

        const requestId = this.generateRequestId();
        this.pendingGenerations.add(requestId);

        try {
            const placeholder = this.createImagePlaceholder(requestId);
            const imageUrl = await generateImage(prompt, this.imageService);
            const imageElement = await this.createImageElement(imageUrl, prompt);
            this.replacePlaceholder(requestId, imageElement);
            return imageElement;
        } catch (error) {
            this.handleGenerationError(requestId, error);
            throw error;
        } finally {
            this.pendingGenerations.delete(requestId);
        }
    }

    generateRequestId() {
        return crypto.randomUUID?.() || `id-${Date.now()}-${Math.random()}`;
    }

    createImagePlaceholder(requestId) {
        const placeholder = document.createElement('div');
        placeholder.className = CLASS_NAMES.imagePlaceholder;
        placeholder.dataset.requestId = requestId;

        const spinner = document.createElement('div');
        spinner.className = CLASS_NAMES.loadingSpinner;
        placeholder.appendChild(spinner);

        const status = document.createElement('div');
        status.className = CLASS_NAMES.generationStatus;
        status.textContent = 'Generating image...';
        placeholder.appendChild(status);

        return placeholder;
    }

    replacePlaceholder(requestId, imageElement) {
        const placeholder = document.querySelector(
            `.${CLASS_NAMES.imagePlaceholder}[data-request-id="${requestId}"]`
        );
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.replaceChild(imageElement, placeholder);
        }
    }

    handleGenerationError(requestId, error) {
        const placeholder = document.querySelector(
            `.${CLASS_NAMES.imagePlaceholder}[data-request-id="${requestId}"]`
        );
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to generate image: ${error.message}</p>
                </div>
            `;
        }
    }
}

export default ImageHandler;