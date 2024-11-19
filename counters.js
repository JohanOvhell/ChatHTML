import { countTokens, calculateCost } from './api-handlers.js';

class ChatCounters {
    constructor() {
        this.tokenCounter = document.getElementById('token-counter');
        this.charCounter = document.getElementById('char-counter');
        this.costCounter = document.getElementById('cost-counter');
        this.messageCounter = document.getElementById('message-counter');

        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: { total: 0, user: 0, ai: 0 }
        };

        this.updateInterval = null;
    }

    startCounting() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(() => this.updateAllCounters(), 1000);
    }

    stopCounting() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    resetCounters() {
        this.counts = {
            tokens: 0,
            characters: 0,
            cost: 0,
            messages: { total: 0, user: 0, ai: 0 }
        };
        this.updateAllCounters();
    }

    updateAllCounters() {
        this.updateTokenCounter();
        this.updateCharCounter();
        this.updateCostCounter();
        this.updateMessageCounter();
    }

    updateTokenCounter() {
        if (this.tokenCounter) {
            const isApproachingLimit = this.counts.tokens > 3500;
            this.tokenCounter.textContent = `${this.counts.tokens.toLocaleString()} tokens`;
            this.tokenCounter.classList.toggle('warning', isApproachingLimit);
        }
    }

    updateCharCounter() {
        if (this.charCounter) {
            this.charCounter.textContent = `${this.counts.characters.toLocaleString()} characters`;
        }
    }

    updateCostCounter() {
        if (this.costCounter) {
            this.costCounter.textContent = `$${this.counts.cost.toFixed(4)}`;
        }
    }

    updateMessageCounter() {
        if (this.messageCounter) {
            this.messageCounter.textContent = 
                `Messages: ${this.counts.messages.total} ` +
                `(User: ${this.counts.messages.user}, AI: ${this.counts.messages.ai})`;
        }
    }

    updateCounts(content, type, isAdding = true) {
        const delta = isAdding ? 1 : -1;
        const lengthDelta = isAdding ? content.length : -content.length;
        const tokensDelta = isAdding ? countTokens(content) : -countTokens(content);

        this.counts.messages.total += delta;
        if (type === 'user') this.counts.messages.user += delta;
        if (type === 'ai') this.counts.messages.ai += delta;

        this.counts.characters += lengthDelta;
        this.counts.tokens += tokensDelta;

        if (type === 'ai') {
            const costDelta = isAdding 
                ? calculateCost('gpt', tokensDelta) 
                : -calculateCost('gpt', tokensDelta);
            this.counts.cost += costDelta;
        }
        this.updateAllCounters();
    }

    addMessage(content, type) {
        this.updateCounts(content, type, true);
    }

    removeMessage(content, type) {
        this.updateCounts(content, type, false);
    }

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

    exportStats() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
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

export default ChatCounters;