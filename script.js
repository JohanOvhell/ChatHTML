document.addEventListener('DOMContentLoaded', () => {
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

    loadChatHistory();

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    imageGenButton.addEventListener('click', () => handleImageGeneration());
    clearChatButton.addEventListener('click', clearChat);
    toggleScrollButton.addEventListener('click', toggleAutoScroll);
    searchInput.addEventListener('input', handleSearch);
    aiModelSelect.addEventListener('change', handleModelChange);

    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        if (message.startsWith('/image')) {
            handleImageCommand(message);
            return;
        }

        addMessage('user', message);
        userInput.value = '';
        updateCounters('');

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

    function handleImageCommand(message) {
        const imageRequest = message.substring(7).trim();
        console.log('Image generation requested:', imageRequest);
        // Add image generation logic here
    }

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

        Array.from(messages).forEach((message) => {
            const content = message.textContent.toLowerCase();
            message.style.display = content.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function updateEstimatedTime() {
        const estimatedTimeSpan = loadingIndicator.querySelector('.estimated-time');
        let seconds = 0;

        const timeInterval = setInterval(() => {
            seconds++;
            estimatedTimeSpan.textContent = `Est. time: ${seconds}s`;
            if (loadingIndicator.classList.contains('hidden')) {
                clearInterval(timeInterval);
            }
        }, 1000);
    }

    function saveChatHistory() {
        try {
            const messages = Array.from(chatContainer.children).map((msg) => ({
                type: msg.classList.contains('user-message') ? 'user' : 'ai',
                content: msg.querySelector('.message-content').innerHTML,
                timestamp: msg.querySelector('.message-timestamp').textContent,
            }));

            localStorage.setItem('chatHistory', JSON.stringify(messages));
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    }

    function loadChatHistory() {
        try {
            const history = localStorage.getItem('chatHistory');
            if (history) {
                const messages = JSON.parse(history);
                messages.forEach((msg) => addMessage(msg.type, msg.content));
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
    }
});