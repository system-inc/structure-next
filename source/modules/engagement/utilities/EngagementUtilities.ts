// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Meta Attribution Constants
const metaFbcKey = ProjectSettings.identifier + 'EngagementMetaFbc';
const metaFbpKey = ProjectSettings.identifier + 'EngagementMetaFbp';

// X Attribution Constants
const xTwclidKey = ProjectSettings.identifier + 'EngagementXTwclid';

function getSubdomainIndex(): number {
    const parts = window.location.hostname.split('.');
    return Math.max(parts.length - 1, 0);
}

function generateRandomNumber(): number {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    return randomValue || Math.floor(Math.random() * 4294967296); // Fallback to Math.random if crypto fails
}

// Function to create fbp if it doesn't exist (create once, store forever)
function createMetaFbpIfMissing(): string {
    // Check if fbp already exists in localStorage
    const existingFbp = localStorage.getItem(metaFbpKey);
    if(existingFbp) {
        return existingFbp;
    }

    // Create new fbp
    const timestamp = Date.now();
    const randomNumber = generateRandomNumber();
    const subdomainIndex = getSubdomainIndex();
    const fbp = `fb.${subdomainIndex}.${timestamp}.${randomNumber}`;

    // Store in localStorage
    localStorage.setItem(metaFbpKey, fbp);

    return fbp;
}

// Function to handle fbclid and create/update fbc
function handleMetaFbclid(fbclid: string): string {
    const timestamp = Date.now();
    const subdomainIndex = getSubdomainIndex();
    const fbc = `fb.${subdomainIndex}.${timestamp}.${fbclid}`;

    // Store in localStorage
    localStorage.setItem(metaFbcKey, fbc);

    return fbc;
}

// Function to handle twclid and store X attribution
function handleXTwclid(twclid: string): string {
    // Store the twclid as-is in localStorage
    localStorage.setItem(xTwclidKey, twclid);

    return twclid;
}

// Function to get current Meta attribution data
function getMetaAttributionData(): { fbc?: string; fbp?: string } {
    const fbc = localStorage.getItem(metaFbcKey) || undefined;
    const fbp = localStorage.getItem(metaFbpKey) || undefined;

    return { fbc, fbp };
}

// Function to get current X/Twitter attribution data
function getXAttributionData(): { twclid?: string } {
    const twclid = localStorage.getItem(xTwclidKey) || undefined;
    return { twclid };
}

// Function to initialize third-party attribution from URL parameters
export function initializeThirdPartyAttribution(urlSearchParameters: URLSearchParams | null): void {
    // Return early if not in browser
    if(typeof window !== 'object') {
        return;
    }

    // Always ensure Meta fbp exists (create once, store forever)
    createMetaFbpIfMissing();

    // Check for Meta fbclid in URL parameters
    const fbclid = urlSearchParameters?.get('fbclid');
    if(fbclid) {
        // Handle new Meta ad click - update fbc
        handleMetaFbclid(fbclid);
    }
    // If no fbclid, leave existing fbc untouched

    // Check for twclid in URL parameters
    const twclid = urlSearchParameters?.get('twclid');
    if(twclid) {
        // Handle new X ad click - store twclid
        handleXTwclid(twclid);
    }
}

// Function to get third-party attribution data for engagement events
export function getThirdPartyAttributionForEvents(): Record<string, unknown> {
    // Meta
    const { fbc, fbp } = getMetaAttributionData();

    // X
    const { twclid } = getXAttributionData();

    const attributionData: Record<string, unknown> = {};

    // Add meta object if we have Meta attribution data
    if(fbc || fbp) {
        const meta: Record<string, unknown> = {};
        if(fbc) meta.fbc = fbc;
        if(fbp) meta.fbp = fbp;
        attributionData.meta = meta;
    }

    // Add x object if we have X attribution data
    if(twclid) {
        attributionData.x = { twclid };
    }

    return attributionData;
}
