const preventThemeFlashOnFirstLoadCode = function () {
    // Must be hard coded since this is converted to a string and injected into the <script> tag on the root layout.
    const DARK_FAVICON_PATH = '/images/favicon/favicon-dark.png';
    const LIGHT_FAVICON_PATH = '/images/favicon/favicon-light.png';

    let preferredTheme;
    let systemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Get the preferred theme from local storage.
    try {
        const storedValue = localStorage.getItem('phiThemeMode');
        if(storedValue) preferredTheme = JSON.parse(storedValue);
    }
    catch(err) {
        // Catch any errors that might arise from parsing the JSON.
        console.error(err);
    }

    // If the preferred theme is set to dark or the system prefers dark mode, add the dark class to the document element.
    if(preferredTheme === 'dark' || (systemPrefersDarkMode && !preferredTheme)) {
        console.log('PREVENT_FLASH: Adding preferring theme from local storage. ', 'dark');
        document.documentElement.classList.add('dark');
    }
    else {
        console.log('PREVENT_FLASH: preferred theme is light and system prefers light mode. Doing nothing.');
    }

    // If the system color scheme is dark, update the favicon link to the dark theme.
    if(systemPrefersDarkMode) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if(faviconLink) {
            faviconLink.href = DARK_FAVICON_PATH;
            console.log('PREVENT_FLASH: Updating favicon to dark theme.');
        }
    }
    else {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if(faviconLink) {
            faviconLink.href = LIGHT_FAVICON_PATH;
            console.log('PREVENT_FLASH: Updating favicon to light theme.');
        }
    }
};

// Cast the function to a string to be injected into the <script> tag on the root layout.
export const preventThemeFlashOnFirstLoad = `(${preventThemeFlashOnFirstLoadCode.toString()})();`;
