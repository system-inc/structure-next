export function focusFirstFocusableElement(querySelector: string) {
    const popoverContent = document.querySelector(querySelector);

    if(popoverContent) {
        const firstFocusableElement = popoverContent.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if(firstFocusableElement) {
            (firstFocusableElement as HTMLElement).focus();
        }
    }
}
