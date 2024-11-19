// Theme management and switching functionality
(() => {
    const themeSwitch = document.getElementById('theme-toggle');
    const body = document.body || document.querySelector('body');
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
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        if (themeSwitch) themeSwitch.checked = savedTheme === 'dark';
        themeSwitch?.addEventListener('change', handleThemeSwitch);
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

        if (!themeColors) {
            console.error(`Theme "${theme}" not found!`);
            return;
        }

        Object.entries(themeColors).forEach(([property, value]) =>
            root.style.setProperty(property, value)
        );

        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${theme}-theme`);
        updateCodeTheme(theme);
    }

    // Save theme preference
    function saveThemePreference(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    }

    // Update code syntax highlighting theme
    function updateCodeTheme(theme) {
        const syntaxTheme = theme === 'dark' ? 'github-dark' : 'github-light';
        const existingLink = document.querySelector('link[title="highlight-theme"]');
        const themeUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/${syntaxTheme}.min.css`;

        if (existingLink) {
            existingLink.href = themeUrl;
        } else if (document.head) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.title = 'highlight-theme';
            link.href = themeUrl;
            document.head.appendChild(link);
        }
        
        document.querySelectorAll('pre code').forEach(block => {
            try {
                hljs.highlightElement(block);
            } catch (error) {
                console.error('Error highlighting code block:', error);
            }
        });
    }

    // Handle system theme changes
    function handleSystemThemeChange(e) {
        const systemTheme = e.matches ? 'dark' : 'light';
        if (!localStorage.getItem('theme')) {
            applyTheme(systemTheme);
            if (themeSwitch) themeSwitch.checked = systemTheme === 'dark';
        }
    }

    // Listen for system theme changes
    const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMedia.addEventListener('change', handleSystemThemeChange);

    // Initialize on load
    initializeTheme();

    // Export functions for use in other modules
    window.themeManager = {
        initializeTheme,
        applyTheme,
        handleThemeSwitch
    };
})();