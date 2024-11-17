


```javascript
// Import required utilities
import { countTokens, calculateCost } from './api-handlers.js';

class ChatCounters {
    constructor() {
        // Initialize counter elements
        this.tokenCounter = document.getElementById('token-counter');
        this.charCounter = document.getElementById('char-counter');
        this.costCounter = document.getElementById('cost-counter');
        this.messageCounter = document.getElementById('message-counter');
        
        // Initialize counts
        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: {
                total: 0,
                user: 0,
                ai: 0
            }
        };

        // Initialize update interval
        this.updateInterval = null;
    }

    // Start real-time counting
    startCounting() {
        // Update counters every second
        this.updateInterval = setInterval(() => {
            this.updateAllCounters();
        }, 1000);
    }

    // Stop real-time counting
    stopCounting() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Reset all counters
    resetCounters() {
        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: {
                total: 0,
                user: 0,
                ai: 0
            }
        };
        this.updateAllCounters();
    }

    // Update all counter displays
    updateAllCounters() {
        this.updateTokenCounter();
        this.updateCharCounter();
        this.updateCostCounter();
        this.updateMessageCounter();
    }

    // Update token counter
    updateTokenCounter() {
        if (this.tokenCounter) {
            this.tokenCounter.textContent = `${this.counts.tokens.toLocaleString()} tokens`;
            
            // Add warning class if approaching limits
            this.tokenCounter.classList.toggle('warning', 
                this.counts.tokens > 3500);
        }
    }

    // Update character counter
    updateCharCounter() {
        if (this.charCounter) {
            this.charCounter.textContent = 
                `${this.counts.characters.toLocaleString()} characters`;
        }
    }

    // Update cost counter
    updateCostCounter() {
        if (this.costCounter) {
            this.costCounter.textContent = 
                `$${this.counts.cost.toFixed(4)}`;
        }
    }

    // Update message counter
    updateMessageCounter() {
        if (this.messageCounter) {
            this.messageCounter.textContent = `Messages: ${this.counts.messages.total} ` +
                `(User: ${this.counts.messages.user}, AI: ${this.counts.messages.ai})`;
        }
    }

    // Add new message to counts
    addMessage(content, type) {
        // Update message counts
        this.counts.messages.total++;
        if (type === 'user') {
            this.counts.messages.user++;
        } else if (type === 'ai') {
            this.counts.messages.ai++;
        }

        // Update character count
        this.counts.characters += content.length;

        // Update token count
        const tokens = countTokens(content);
        this.counts.tokens += tokens;

        // Update cost (only for AI messages)
        if (type === 'ai') {
            this.counts.cost += calculateCost('gpt', tokens);
        }

        // Update displays
        this.updateAllCounters();
    }

    // Remove message from counts
    removeMessage(content, type) {
        // Update message counts
        this.counts.messages.total--;
        if (type === 'user') {
            this.counts.messages.user--;
        } else if (type === 'ai') {
            this.counts.messages.ai--;
        }

        // Update character count
        this.counts.characters -= content.length;

        // Update token count
        const tokens = countTokens(content);
        this.counts.tokens -= tokens;

        // Update cost (only for AI messages)
        if (type === 'ai') {
            this.counts.cost -= calculateCost('gpt', tokens);
        }

        // Update displays
        this.updateAllCounters();
    }

    // Get current statistics
    getStats() {
        return {
            ...this.counts,
            averageTokensPerMessage: this.counts.messages.total > 0 
                ? this.counts.tokens / this.counts.messages.total 
                : 0,
            averageCostPerMessage: this.counts.messages.ai > 0 
                ? this.counts.cost / this.counts.messages.ai 
                : 0
        };
    }

    // Create statistics report
    generateReport() {
        const stats = this.getStats();
        return {
            summary: {
                totalMessages: stats.messages.total,
                userMessages: stats.messages.user,
                aiMessages: stats.messages.ai,
                totalTokens: stats.tokens,
                totalCost: stats.cost
            },
            averages: {
                tokensPerMessage: stats.averageTokensPerMessage.toFixed(2),
                costPerMessage: stats.averageCostPerMessage.toFixed(4)
            },
            usage: {
                characters: stats.characters,
                tokens: stats.tokens,
                cost: stats.cost.toFixed(4)
            }
        };
    }

    // Export statistics to JSON
    exportStats() {
        const report = this.generateReport();
        const blob = new Blob(
            [JSON.stringify(report, null, 2)], 
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-stats-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export the ChatCounters class
export default ChatCounters;
```
// Import required utilities
import { countTokens, calculateCost } from './api-handlers.js';

class ChatCounters {
    constructor() {
        // Initialize counter elements
        this.tokenCounter = document.getElementById('token-counter');
        this.charCounter = document.getElementById('char-counter');
        this.costCounter = document.getElementById('cost-counter');
        this.messageCounter = document.getElementById('message-counter');
        
        // Initialize counts
        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: {
                total: 0,
                user: 0,
                ai: 0
            }
        };

        // Initialize update interval
        this.updateInterval = null;
    }

    // Start real-time counting
    startCounting() {
        // Update counters every second
        this.updateInterval = setInterval(() => {
            this.updateAllCounters();
        }, 1000);
    }

    // Stop real-time counting
    stopCounting() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Reset all counters
    resetCounters() {
        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: {
                total: 0,
                user: 0,
                ai: 0
            }
        };
        this.updateAllCounters();
    }

    // Update all counter displays
    updateAllCounters() {
        this.updateTokenCounter();
        this.updateCharCounter();
        this.updateCostCounter();
        this.updateMessageCounter();
    }

    // Update token counter
    updateTokenCounter() {
        if (this.tokenCounter) {
            this.tokenCounter.textContent = `${this.counts.tokens.toLocaleString()} tokens`;
            
            // Add warning class if approaching limits
            this.tokenCounter.classList.toggle('warning', 
                this.counts.tokens > 3500);
        }
    }

    // Update character counter
    updateCharCounter() {
        if (this.charCounter) {
            this.charCounter.textContent = 
                `${this.counts.characters.toLocaleString()} characters`;
        }
    }

    // Update cost counter
    updateCostCounter() {
        if (this.costCounter) {
            this.costCounter.textContent = 
                `$${this.counts.cost.toFixed(4)}`;
        }
    }

    // Update message counter
    updateMessageCounter() {
        if (this.messageCounter) {
            this.messageCounter.textContent = `Messages: ${this.counts.messages.total} ` +
                `(User: ${this.counts.messages.user}, AI: ${this.counts.messages.ai})`;
        }
    }

    // Add new message to counts
    addMessage(content, type) {
        // Update message counts
        this.counts.messages.total++;
        if (type === 'user') {
            this.counts.messages.user++;
        } else if (type === 'ai') {
            this.counts.messages.ai++;
        }

        // Update character count
        this.counts.characters += content.length;

        // Update token count
        const tokens = countTokens(content);
        this.counts.tokens += tokens;

        // Update cost (only for AI messages)
        if (type === 'ai') {
            this.counts.cost += calculateCost('gpt', tokens);
        }

        // Update displays
        this.updateAllCounters();
    }

    // Remove message from counts
    removeMessage(content, type) {
        // Update message counts
        this.counts.messages.total--;
        if (type === 'user') {
            this.counts.messages.user--;
        } else if (type === 'ai') {
            this.counts.messages.ai--;
        }

        // Update character count
        this.counts.characters -= content.length;

        // Update token count
        const tokens = countTokens(content);
        this.counts.tokens -= tokens;

        // Update cost (only for AI messages)
        if (type === 'ai') {
            this.counts.cost -= calculateCost('gpt', tokens);
        }

        // Update displays
        this.updateAllCounters();
    }

    // Get current statistics
    getStats() {
        return {
            ...this.counts,
            averageTokensPerMessage: this.counts.messages.total > 0 
                ? this.counts.tokens / this.counts.messages.total 
                : 0,
            averageCostPerMessage: this.counts.messages.ai > 0 
                ? this.counts.cost / this.counts.messages.ai 
                : 0
        };
    }

    // Create statistics report
    generateReport() {
        const stats = this.getStats();
        return {
            summary: {
                totalMessages: stats.messages.total,
                userMessages: stats.messages.user,
                aiMessages: stats.messages.ai,
                totalTokens: stats.tokens,
                totalCost: stats.cost
            },
            averages: {
                tokensPerMessage: stats.averageTokensPerMessage.toFixed(2),
                costPerMessage: stats.averageCostPerMessage.toFixed(4)
            },
            usage: {
                characters: stats.characters,
                tokens: stats.tokens,
                cost: stats.cost.toFixed(4)
            }
        };
    }

    // Export statistics to JSON
    exportStats() {
        const report = this.generateReport();
        const blob = new Blob(
            [JSON.stringify(report, null, 2)], 
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-stats-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export the ChatCounters class
export default ChatCounters;
