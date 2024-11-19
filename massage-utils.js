// Import required functions from other modules
import { countTokens, calculateCost } from './api-handlers.js';
import marked from 'marked';
import hljs from 'highlight.js';

// Message creation and management utilities
function createMessageElement(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const processedContent = processMessageContent(content);
    contentDiv.innerHTML = processedContent;

    const copyButton = createCopyButton();
    messageDiv.appendChild(copyButton);

    const timestamp = createTimestamp();
    messageDiv.appendChild(timestamp);

    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

// Process message content with markdown and code highlighting
function processMessageContent(content) {
    marked.setOptions({
        highlight: function(code, language) {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    return marked(content);
}

// Create copy button for messages
function createCopyButton() {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = '<i class="fas fa-copy"></i>';

    button.addEventListener('click', function(e) {
        const messageContent = e.target.closest('.message')
            .querySelector('.message-content').textContent;

        copyToClipboard(messageContent);

        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    });

    return button;
}

// Create timestamp element
function createTimestamp() {
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString();
    return timestamp;
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}

// Message search functionality
function searchMessages(searchTerm) {
    const messages = document.querySelectorAll('.message');
    const results = [];

    messages.forEach(message => {
        const content = message.querySelector('.message-content').textContent;
        if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
                element: message,
                content: content,
                timestamp: message.querySelector('.message-timestamp').textContent
            });
        }
    });

    return results;
}

// Highlight search results
function highlightSearchResults(searchTerm) {
    const messages = document.querySelectorAll('.message-content');

    messages.forEach(message => {
        const content = message.textContent;
        const regex = new RegExp(searchTerm, 'gi');
        const fragments = content.split(regex);
        const highlightedNode = document.createElement('span');

        fragments.forEach((fragment, index) => {
            if (index % 2 === 1) {
                const mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.textContent = fragments[index];
                highlightedNode.appendChild(mark);
            } else {
                highlightedNode.appendChild(document.createTextNode(fragment));
            }
        });

        message.innerHTML = '';
        message.appendChild(highlightedNode);
    });
}

// Clear search highlights
function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    });
}

// Message statistics
function getMessageStats() {
    const messages = document.querySelectorAll('.message');
    const stats = {
        total: messages.length,
        userMessages: document.querySelectorAll('.user-message').length,
        aiMessages: document.querySelectorAll('.ai-message').length,
        totalTokens: 0,
        estimatedCost: 0
    };

    messages.forEach(message => {
        const content = message.querySelector('.message-content').textContent;
        const tokens = countTokens(content);
        stats.totalTokens += tokens;

        if (message.classList.contains('ai-message')) {
            stats.estimatedCost += calculateCost('gpt', tokens);
        }
    });

    return stats;
}

// Export functions for use in other modules
export {
    createMessageElement,
    searchMessages,
    highlightSearchResults,
    clearSearchHighlights,
    getMessageStats
};