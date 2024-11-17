


```javascript
// Image generation and display handling
import { generateImage } from './api-handlers.js';

class ImageHandler {
    constructor() {
        this.imageService = 'dalle'; // default service
        this.pendingGenerations = new Set();
        this.maxConcurrentGenerations = 3;
    }

    // Handle image generation request
    async handleImageRequest(prompt) {
        if (this.pendingGenerations.size >= this.maxConcurrentGenerations) {
            throw new Error('Too many pending image generations. Please wait.');
        }

        const requestId = crypto.randomUUID();
        this.pendingGenerations.add(requestId);

        try {
            // Create placeholder for the generating image
            const placeholder = this.createImagePlaceholder(requestId);
            
            // Generate the image
            const imageUrl = await generateImage(prompt, this.imageService);
            
            // Replace placeholder with actual image
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

    // Create placeholder while image generates
    createImagePlaceholder(requestId) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.dataset.requestId = requestId;
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        placeholder.appendChild(spinner);

        const status = document.createElement('div');
        status.className = 'generation-status';
        status.textContent = 'Generating image...';
        placeholder.appendChild(status);

        return placeholder;
    }

    // Create image element once generated
    async createImageElement(url, prompt) {
        return new Promise((resolve, reject) => {
            const container = document.createElement('div');
            container.className = 'generated-image-container';

            const img = document.createElement('img');
            img.className = 'generated-image';
            img.alt = prompt;
            
            // Add loading state
            img.onload = () => {
                container.classList.add('loaded');
                resolve(container);
            };
            img.onerror = () => reject(new Error('Failed to load image'));

            // Add image controls
            const controls = this.createImageControls(img);
            
            // Add prompt as caption
            const caption = document.createElement('div');
            caption.className = 'image-caption';
            caption.textContent = prompt;

            container.appendChild(img);
            container.appendChild(controls);
            container.appendChild(caption);

            // Set source after setting up handlers
            img.src = url;
        });
    }

    // Create image control buttons
    createImageControls(img) {
        const controls = document.createElement('div');
        controls.className = 'image-controls';

        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.onclick = () => this.downloadImage(img);

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = () => this.copyImageToClipboard(img);

        // Expand button
        const expandBtn = document.createElement('button');
        expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
        expandBtn.onclick = () => this.showExpandedView(img);

        controls.appendChild(downloadBtn);
        controls.appendChild(copyBtn);
        controls.appendChild(expandBtn);

        return controls;
    }

    // Replace placeholder with generated image
    replacePlaceholder(requestId, imageElement) {
        const placeholder = document.querySelector(
            `.image-placeholder[data-request-id="${requestId}"]`
        );
        if (placeholder) {
            placeholder.parentNode.replaceChild(imageElement, placeholder);
        }
    }

    // Handle generation errors
    handleGenerationError(requestId, error) {
        const placeholder = document.querySelector(
            `.image-placeholder[data-request-id="${requestId}"]`
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

    // Download generated image
    async downloadImage(img) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    }

    // Copy image to clipboard
    async copyImageToClipboard(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    this.showToast('Image copied to clipboard!');
                } catch (error) {
                    console.error('Failed to copy image:', error);
                    this.showToast('Failed to copy image');
                }
            });
        } catch (error) {
            console.error('Failed to prepare image for copying:', error);
            this.showToast('Failed to copy image');
        }
    }

    // Show expanded view of image
    showExpandedView(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        modal.appendChild(modalImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }

    // Show toast notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // Change image generation service
    setImageService(service) {
        if (['dalle', 'flux'].includes(service)) {
            this.imageService = service;
        } else {
            throw new Error('Invalid image service');
        }
    }
}

// Export the ImageHandler class
export default ImageHandler;
```// Image generation and display handling
import { generateImage } from './api-handlers.js';

class ImageHandler {
    constructor() {
        this.imageService = 'dalle'; // default service
        this.pendingGenerations = new Set();
        this.maxConcurrentGenerations = 3;
    }

    // Handle image generation request
    async handleImageRequest(prompt) {
        if (this.pendingGenerations.size >= this.maxConcurrentGenerations) {
            throw new Error('Too many pending image generations. Please wait.');
        }

        const requestId = crypto.randomUUID();
        this.pendingGenerations.add(requestId);

        try {
            // Create placeholder for the generating image
            const placeholder = this.createImagePlaceholder(requestId);
            
            // Generate the image
            const imageUrl = await generateImage(prompt, this.imageService);
            
            // Replace placeholder with actual image
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

    // Create placeholder while image generates
    createImagePlaceholder(requestId) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.dataset.requestId = requestId;
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        placeholder.appendChild(spinner);

        const status = document.createElement('div');
        status.className = 'generation-status';
        status.textContent = 'Generating image...';
        placeholder.appendChild(status);

        return placeholder;
    }

    // Create image element once generated
    async createImageElement(url, prompt) {
        return new Promise((resolve, reject) => {
            const container = document.createElement('div');
            container.className = 'generated-image-container';

            const img = document.createElement('img');
            img.className = 'generated-image';
            img.alt = prompt;
            
            // Add loading state
            img.onload = () => {
                container.classList.add('loaded');
                resolve(container);
            };
            img.onerror = () => reject(new Error('Failed to load image'));

            // Add image controls
            const controls = this.createImageControls(img);
            
            // Add prompt as caption
            const caption = document.createElement('div');
            caption.className = 'image-caption';
            caption.textContent = prompt;

            container.appendChild(img);
            container.appendChild(controls);
            container.appendChild(caption);

            // Set source after setting up handlers
            img.src = url;
        });
    }

    // Create image control buttons
    createImageControls(img) {
        const controls = document.createElement('div');
        controls.className = 'image-controls';

        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.onclick = () => this.downloadImage(img);

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = () => this.copyImageToClipboard(img);

        // Expand button
        const expandBtn = document.createElement('button');
        expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
        expandBtn.onclick = () => this.showExpandedView(img);

        controls.appendChild(downloadBtn);
        controls.appendChild(copyBtn);
        controls.appendChild(expandBtn);

        return controls;
    }

    // Replace placeholder with generated image
    replacePlaceholder(requestId, imageElement) {
        const placeholder = document.querySelector(
            `.image-placeholder[data-request-id="${requestId}"]`
        );
        if (placeholder) {
            placeholder.parentNode.replaceChild(imageElement, placeholder);
        }
    }

    // Handle generation errors
    handleGenerationError(requestId, error) {
        const placeholder = document.querySelector(
            `.image-placeholder[data-request-id="${requestId}"]`
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

    // Download generated image
    async downloadImage(img) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    }

    // Copy image to clipboard
    async copyImageToClipboard(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    this.showToast('Image copied to clipboard!');
                } catch (error) {
                    console.error('Failed to copy image:', error);
                    this.showToast('Failed to copy image');
                }
            });
        } catch (error) {
            console.error('Failed to prepare image for copying:', error);
            this.showToast('Failed to copy image');
        }
    }

    // Show expanded view of image
    showExpandedView(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        modal.appendChild(modalImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }

    // Show toast notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // Change image generation service
    setImageService(service) {
        if (['dalle', 'flux'].includes(service)) {
            this.imageService = service;
        } else {
            throw new Error('Invalid image service');
        }
    }
}

// Export the ImageHandler class
export default ImageHandler;

