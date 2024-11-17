# __CodeGPT - theme-switcher.js__

```javascript
// Theme management and switching functionality
const themeSwitch = document.getElementById('theme-toggle');
const body = document.body;
const root = document.documentElement;

// Theme configurations
const themes = {
    light: {
        '--primary-color': '#007bff',
        '--secondary-color': '#6c757d',
        '--success-color': '#28a745',
        '--background-color': '#ffffff',
        '--text-color': '#333333',
        '--border-color': '#dee2e6',
        '--chat-user-bg': '#e9ecef',
        '--chat-ai-bg': '#f8f9fa',
        '--shadow-color': 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
        '--primary-color': '#0d6efd',
        '--secondary-color': '#adb5bd',
        '--success-color': '#198754',
        '--background-color': '#1a1a1a',
        '--text-color': '#ffffff',
        '--border-color': '#404040',
        '--chat-user-bg': '#2d2d2d',
        '--chat-ai-bg': '#363636',
        '--shadow-color': 'rgba(255, 255, 255, 0.1)'
    }
};

// Initialize theme
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeSwitch.checked = savedTheme === 'dark';

    // Add event listener for theme toggle
    themeSwitch.addEventListener('change', handleThemeSwitch);
}

// Handle theme switch
function handleThemeSwitch(e) {
    const newTheme = e.target.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    saveThemePreference(newTheme);
}

// Apply theme to document
function applyTheme(theme) {
    const themeColors = themes[theme];
    
    // Apply CSS variables
    for (const [property, value] of Object.entries(themeColors)) {
        root.style.setProperty(property, value);
    }

    // Update body class
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);

    // Update syntax highlighting theme
    updateCodeTheme(theme);
}

// Save theme preference
function saveThemePreference(theme) {
    localStorage.setItem('theme', theme);
}

// Update code syntax highlighting theme
function updateCodeTheme(theme) {
    const syntaxTheme = theme === 'dark' ? 'github-dark' : 'github-light';
    const existingLink = document.querySelector('link[title="highlight-theme"]');
    
    if (existingLink) {
        existingLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${syntaxTheme}.min.css`;
    } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.title = 'highlight-theme';
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${syntaxTheme}.min.css`;
        document.head.appendChild(link);
    }

    // Re-highlight visible code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Handle system theme changes
function handleSystemThemeChange(e) {
    const systemTheme = e.matches ? 'dark' : 'light';
    // Only apply system theme if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        applyTheme(systemTheme);
        themeSwitch.checked = systemTheme === 'dark';
    }
}

// Listen for system theme changes
const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
systemThemeMedia.addListener(handleSystemThemeChange);

// Export functions for use in other modules
export {
    initializeTheme,
    applyTheme,
    handleThemeSwitch
};
```
