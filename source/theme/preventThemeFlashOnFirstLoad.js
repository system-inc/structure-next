const preventThemeFlashOnFirstLoadCode = function () {
    let preferredTheme;

    try {
        preferredTheme = localStorage.getItem('phiThemeMode');
    }
    catch(err) {}

    if(preferredTheme !== undefined && preferredTheme !== null && preferredTheme !== 'undefined') {
        console.log('PREVENT_FLASH: Adding preferring theme from local storage. ', preferredTheme);
        document.documentElement.classList.add(preferredTheme);
        return;
    }
    else {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if(darkQuery.matches) {
            console.log('PREVENT_FLASH: Adding preferring theme from system. ', 'dark');
            document.documentElement.classList.add('dark');
            return;
        }
    }
};

// Cast the function to a string to be injected into the <script> tag on the root layout.
export const preventThemeFlashOnFirstLoad = `(${preventThemeFlashOnFirstLoadCode.toString()})();`;
