


```javascript
// API configuration
const API_ENDPOINTS = {
    gpt: 'https://api.openai.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    dalle: 'https://api.openai.com/v1/images/generations',
    flux: 'https://api.flux.ai/v1/images/generations'
};

const API_KEYS = {
    gpt: 'your-openai-api-key',
    claude: 'your-anthropic-api-key',
    dalle: 'your-openai-api-key',
    flux: 'your-flux-api-key'
};

// Main API handler for text completions
async function sendToAI(message, model) {
    const endpoint = API_ENDPOINTS[model];
    const apiKey = API_KEYS[model];
    
    let requestBody;
    let headers = {
        'Content-Type': 'application/json'
    };

    // Configure request based on selected model
    switch(model) {
        case 'gpt':
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody = {
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: message
                }],
                temperature: 0.7,
                max_tokens: 1000
            };
            break;

        case 'claude':
            headers['x-api-key'] = apiKey;
            requestBody = {
                model: 'claude-3-sonnet',
                messages: [{
                    role: 'user',
                    content: message
                }],
                max_tokens: 1000
            };
            break;

        default:
            throw new Error('Invalid model selected');
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return model === 'gpt' ? 
            data.choices[0].message.content :
            data.content[0].text;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Image generation handler
async function generateImage(prompt, service = 'dalle') {
    const endpoint = API_ENDPOINTS[service];
    const apiKey = API_KEYS[service];

    let requestBody;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    switch(service) {
        case 'dalle':
            requestBody = {
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            };
            break;

        case 'flux':
            headers['x-api-key'] = apiKey;
            requestBody = {
                prompt: prompt,
                width: 1024,
                height: 1024,
                num_images: 1
            };
            break;

        default:
            throw new Error('Invalid image service selected');
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Image generation failed: ${response.status}`);
        }

        const data = await response.json();
        return service === 'dalle' ? 
            data.data[0].url :
            data.images[0].url;

    } catch (error) {
        console.error('Image Generation Error:', error);
        throw error;
    }
}

// Token counting utility
function countTokens(text) {
    // Simple approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

// Cost calculation utility
function calculateCost(model, tokens) {
    const rates = {
        'gpt': 0.03, // $0.03 per 1K tokens
        'claude': 0.02, // $0.02 per 1K tokens
        'dalle': 0.04, // $0.04 per image
        'flux': 0.05 // $0.05 per image
    };

    return (tokens / 1000) * rates[model];
}

// Export functions for use in other modules
export {
    sendToAI,
    generateImage,
    countTokens,
    calculateCost
};// API configuration
const API_ENDPOINTS = {
    gpt: 'https://api.openai.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    dalle: 'https://api.openai.com/v1/images/generations',
    flux: 'https://api.flux.ai/v1/images/generations'
};

const API_KEYS = {
    gpt: 'your-openai-api-key',
    claude: 'your-anthropic-api-key',
    dalle: 'your-openai-api-key',
    flux: 'your-flux-api-key'
};

// Main API handler for text completions
async function sendToAI(message, model) {
    const endpoint = API_ENDPOINTS[model];
    const apiKey = API_KEYS[model];
    
    let requestBody;
    let headers = {
        'Content-Type': 'application/json'
    };

    // Configure request based on selected model
    switch(model) {
        case 'gpt':
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody = {
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: message
                }],
                temperature: 0.7,
                max_tokens: 1000
            };
            break;

        case 'claude':
            headers['x-api-key'] = apiKey;
            requestBody = {
                model: 'claude-3-sonnet',
                messages: [{
                    role: 'user',
                    content: message
                }],
                max_tokens: 1000
            };
            break;

        default:
            throw new Error('Invalid model selected');
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return model === 'gpt' ? 
            data.choices[0].message.content :
            data.content[0].text;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Image generation handler
async function generateImage(prompt, service = 'dalle') {
    const endpoint = API_ENDPOINTS[service];
    const apiKey = API_KEYS[service];

    let requestBody;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    switch(service) {
        case 'dalle':
            requestBody = {
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            };
            break;

        case 'flux':
            headers['x-api-key'] = apiKey;
            requestBody = {
                prompt: prompt,
                width: 1024,
                height: 1024,
                num_images: 1
            };
            break;

        default:
            throw new Error('Invalid image service selected');
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Image generation failed: ${response.status}`);
        }

        const data = await response.json();
        return service === 'dalle' ? 
            data.data[0].url :
            data.images[0].url;

    } catch (error) {
        console.error('Image Generation Error:', error);
        throw error;
    }
}

// Token counting utility
function countTokens(text) {
    // Simple approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

// Cost calculation utility
function calculateCost(model, tokens) {
    const rates = {
        'gpt': 0.03, // $0.03 per 1K tokens
        'claude': 0.02, // $0.02 per 1K tokens
        'dalle': 0.04, // $0.04 per image
        'flux': 0.05 // $0.05 per image
    };

    return (tokens / 1000) * rates[model];
}

// Export functions for use in other modules
export {
    sendToAI,
    generateImage,
    countTokens,
    calculateCost
};

```