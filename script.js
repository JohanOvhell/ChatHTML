# __CodeGPT - script.js__

```javascript
// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let autoScroll = true;
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const imageGenButton = document.getElementById('image-gen-btn');
    const clearChatButton = document.getElementById('clear-chat');
    const toggleScrollButton = document.getElementById('toggle-scroll');
    const searchInput = document.getElementById('search-messages');
    const aiModelSelect = document.getElementById('ai-model');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Load chat history from localStorage
    loadChatHistory();

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    imageGenButton.addEventListener('click', handleImageGeneration);
    clearChatButton.addEventListener('click', clearChat);
    toggleScrollButton.addEventListener('click', toggleAutoScroll);
    searchInput.addEventListener('input', handleSearch);
    aiModelSelect.addEventListener('change', handleModelChange);

    // Message handling
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Check for image generation command
        if (message.startsWith('/image')) {
            handleImageGeneration(message.substring(7));
            return;
        }

        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        updateCounters('');

        // Show loading indicators
        showLoadingIndicator();

        try {
            const selectedModel = aiModelSelect.value;
            const response = await sendToAI(message, selectedModel);
            addMessage('ai', response);
        } catch (error) {
            addMessage('ai', 'Sorry, there was an error processing your request.');
            console.error('API Error:', error);
        } finally {
            hideLoadingIndicator();
        }
    }

    // UI Updates
    function showLoadingIndicator() {
        loadingIndicator.classList.remove('hidden');
        startProgressBar();
        updateEstimatedTime();
    }

    function hideLoadingIndicator() {
        loadingIndicator.classList.add('hidden');
        stopProgressBar();
    }

    function addMessage(type, content) {
        const messageDiv = createMessageElement(type, content);
        chatContainer.appendChild(messageDiv);
        if (autoScroll) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        saveChatHistory();
    }

    // Chat Management
    function clearChat() {
        chatContainer.innerHTML = '';
        localStorage.removeItem('chatHistory');
    }

    function toggleAutoScroll() {
        autoScroll = !autoScroll;
        toggleScrollButton.textContent = `Auto-scroll: ${autoScroll ? 'ON' : 'OFF'}`;
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const messages = chatContainer.getElementsByClassName('message');

        Array.from(messages).forEach(message => {
            const content = message.textContent.toLowerCase();
            message.style.display = content.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function handleModelChange() {
        // Reset any model-specific UI elements or settings
        clearActiveContexts();
    }

    // Progress Bar Animation
    let progressInterval;
    function startProgressBar() {
        const progress = loadingIndicator.querySelector('.progress');
        let width = 0;
        
        progressInterval = setInterval(() => {
            if (width >= 90) {
                clearInterval(progressInterval);
            } else {
                width++;
                progress.style.width = width + '%';
            }
        }, 100);
    }

    function stopProgressBar() {
        clearInterval(progressInterval);
        const progress = loadingIndicator.querySelector('.progress');
        progress.style.width = '100%';
        setTimeout(() => {
            progress.style.width = '0%';
        }, 200);
    }

    function updateEstimatedTime() {
        const estimatedTimeSpan = loadingIndicator.querySelector('.estimated-time');
        let seconds = 0;
        
        const timeInterval = setInterval(() => {
            seconds++;
            estimatedTimeSpan.textContent = `Est. time: ${seconds}s`;
            
            if (!loadingIndicator.classList.contains('hidden')) {
                clearInterval(timeInterval);
            }
        }, 1000);
    }

    // Initialize counters and theme
    updateCounters('');
    initializeTheme();
});

// Helper Functions
function clearActiveContexts() {
    // Reset any active contexts or model-specific states
    console.log('Clearing active contexts');
}

function saveChatHistory() {
    const messages = Array.from(chatContainer.children).map(msg => ({
        type: msg.classList.contains('user-message') ? 'user' : 'ai',
        content: msg.querySelector('.message-content').innerHTML,
        timestamp: msg.querySelector('.message-timestamp').textContent
    }));
    
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        const messages = JSON.parse(history);
        messages.forEach(msg => {
            addMessage(msg.type, msg.content);
        });
    }
}
```
