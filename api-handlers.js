// API configuration
const API_ENDPOINTS = {
    gpt: 'https://api.openai.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    dalle: 'https://api.openai.com/v1/images/generations',
    flux: 'https://api.flux.ai/v1/images/generations',
};

const API_KEYS = {
    gpt: process.env.GPT_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
    dalle: process.env.DALLE_API_KEY,
    flux: process.env.FLUX_API_KEY,
};

// Helper to set headers
function createHeaders(apiKey, isImage = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (isImage) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
        headers['x-api-key'] = apiKey;
    }
    return headers;
}

// Main API handler for text completions
async function sendToAI(message, model, options = {}) {
    const { temperature = 0.7, maxTokens = 1000 } = options;
    const endpoint = API_ENDPOINTS[model];
    const apiKey = API_KEYS[model];

    if (!endpoint || !apiKey) {
        throw new Error('Invalid model or missing API key');
    }

    const headers = createHeaders(apiKey);
    const requestBody = {
        model: model === 'gpt' ? 'gpt-4' : 'claude-3-sonnet',
        messages: [{ role: 'user', content: message }],
        temperature,
        max_tokens: maxTokens,
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return model === 'gpt'
            ? data.choices[0].message.content
            : data.completion;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Image generation handler
async function generateImage(prompt, service = 'dalle') {
    const endpoint = API_ENDPOINTS[service];
    const apiKey = API_KEYS[service];

    if (!endpoint || !apiKey) {
        throw new Error('Invalid service or missing API key');
    }

    const headers = createHeaders(apiKey, true);
    const requestBody = service === 'dalle'
        ? { model: 'dall-e-3', prompt, n: 1, size: '1024x1024' }
        : { prompt, width: 1024, height: 1024, num_images: 1 };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Image generation failed: ${response.status}`);
        }

        const data = await response.json();
        return service === 'dalle'
            ? data.data[0].url
            : data.images[0].url;
    } catch (error) {
        console.error('Image Generation Error:', error);
        throw error;
    }
}

// Token counting utility
function countTokens(text) {
    return Math.ceil(text.length / 4);
}

// Cost calculation utility
function calculateCost(model, tokens) {
    const rates = {
        gpt: 0.03,
        claude: 0.02,
        dalle: 0.04,
        flux: 0.05,
    };
    return (tokens / 1000) * (rates[model] || 0);
}

// Export functions
export { sendToAI, generateImage, countTokens, calculateCost };