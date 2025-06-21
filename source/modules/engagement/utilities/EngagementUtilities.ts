// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Google Attribution Constants
const googleGclidKey = 'EngagementGoogleGclid';
const googleGbraidKey = 'EngagementGoogleGbraid';
const googleWbraidKey = 'EngagementGoogleWbraid';

// Meta Attribution Constants
const metaFbcKey = 'EngagementMetaFbc';
const metaFbpKey = 'EngagementMetaFbp';

// X Attribution Constants
const xTwclidKey = 'EngagementXTwclid';

// Reddit Attribution Constants
const redditRdtCidKey = 'EngagementRedditRdtCid';

// Function to get current Google attribution data
function getGoogleAttributionData(): { gclid?: string; gbraid?: string; wbraid?: string } {
    const gclid = localStorageService.get<string>(googleGclidKey) || undefined;
    const gbraid = localStorageService.get<string>(googleGbraidKey) || undefined;
    const wbraid = localStorageService.get<string>(googleWbraidKey) || undefined;
    return { gclid, gbraid, wbraid };
}

// Function to handle gclid and store Google attribution
// Added to every Google Ads landing‑page URL when Auto‑tagging is on (all browsers except special iOS cases)
function handleGoogleGclid(gclid: string): string {
    localStorageService.set(googleGclidKey, gclid);

    return gclid;
}

// Function to handle gbraid and store Google attribution
// Appended when an ad click starts on the web and the conversion happens in an iOS app (web to app)
function handleGoogleGbraid(gbraid: string): string {
    localStorageService.set(googleGbraidKey, gbraid);

    return gbraid;
}

// Function to handle wbraid and store Google attribution
// Appended when an ad click starts in a Google iOS app (e.g., Search app, YouTube) and the conversion happens on the web (app to web)
function handleGoogleWbraid(wbraid: string): string {
    localStorageService.set(googleWbraidKey, wbraid);

    return wbraid;
}

// Function to get the subdomain index based on the current hostname
function getSubdomainIndex(): number {
    const parts = window.location.hostname.split('.');
    return Math.max(parts.length - 1, 0);
}

// Function to generate a random number using crypto API
function generateRandomNumber(): number {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    return randomValue || Math.floor(Math.random() * 4294967296); // Fallback to Math.random if crypto fails
}

// Function to get current Meta attribution data
function getMetaAttributionData(): { fbc?: string; fbp?: string } {
    const fbc = localStorageService.get<string>(metaFbcKey) || undefined;
    const fbp = localStorageService.get<string>(metaFbpKey) || undefined;

    return { fbc, fbp };
}

// Function to create Meta fbp if it doesn't exist (create once, store forever)
function createMetaFbpIfMissing(): string {
    // Check if fbp already exists in localStorage
    const existingFbp = localStorageService.get<string>(metaFbpKey);
    if(existingFbp) {
        return existingFbp;
    }

    // Create new fbp
    const timestamp = Date.now();
    const randomNumber = generateRandomNumber();
    const subdomainIndex = getSubdomainIndex();
    const fbp = `fb.${subdomainIndex}.${timestamp}.${randomNumber}`;

    // Store in localStorage
    localStorageService.set(metaFbpKey, fbp);

    return fbp;
}

// Function to handle Meta fbclid and create/update fbc
function handleMetaFbclid(fbclid: string): string {
    const timestamp = Date.now();
    const subdomainIndex = getSubdomainIndex();
    const fbc = `fb.${subdomainIndex}.${timestamp}.${fbclid}`;

    // Store in localStorage
    localStorageService.set(metaFbcKey, fbc);

    return fbc;
}

// Function to get current X/Twitter attribution data
function getXAttributionData(): { twclid?: string } {
    const twclid = localStorageService.get<string>(xTwclidKey) || undefined;
    return { twclid };
}

// Function to handle X twclid and store attribution
function handleXTwclid(twclid: string): string {
    localStorageService.set(xTwclidKey, twclid);

    return twclid;
}

// Function to get current Reddit attribution data
function getRedditAttributionData(): { rdt_cid?: string } {
    const rdt_cid = localStorageService.get<string>(redditRdtCidKey) || undefined;
    return { rdt_cid };
}

// Function to handle Reddit rdt_cid and store attribution
function handleRedditRdtCid(rdtCid: string): string {
    localStorageService.set(redditRdtCidKey, rdtCid);

    return rdtCid;
}

// Function to initialize third-party attribution from URL parameters
export function initializeThirdPartyAttribution(urlSearchParameters: URLSearchParams | null): void {
    // Return early if not in browser
    if(typeof window !== 'object') {
        return;
    }

    // Check for gclid in URL parameters
    const gclid = urlSearchParameters?.get('gclid');
    if(gclid) {
        // Handle new Google ad click - store gclid
        handleGoogleGclid(gclid);
    }

    // Check for gbraid in URL parameters
    const gbraid = urlSearchParameters?.get('gbraid');
    if(gbraid) {
        // Handle new Google ad click - store gbraid
        handleGoogleGbraid(gbraid);
    }

    // Check for wbraid in URL parameters
    const wbraid = urlSearchParameters?.get('wbraid');
    if(wbraid) {
        // Handle new Google ad click - store wbraid
        handleGoogleWbraid(wbraid);
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

    // Check for rdt_cid in URL parameters
    const rdtCid = urlSearchParameters?.get('rdt_cid');
    if(rdtCid) {
        // Handle new Reddit ad click - store rdt_cid
        handleRedditRdtCid(rdtCid);
    }
}

// Function to get third-party attribution data for engagement events
export function getThirdPartyAttributionForEvents(): Record<string, unknown> {
    const attributionData: Record<string, unknown> = {};

    // Google
    const { gclid, gbraid, wbraid } = getGoogleAttributionData();

    // Add Google object if we have Google attribution data
    if(gclid || gbraid || wbraid) {
        const google: Record<string, unknown> = {};
        if(gclid) google.gclid = gclid;
        if(gbraid) google.gbraid = gbraid;
        if(wbraid) google.wbraid = wbraid;
        attributionData.google = google;
    }

    // Meta
    const { fbc, fbp } = getMetaAttributionData();

    // Add Meta object if we have Meta attribution data
    if(fbc || fbp) {
        const meta: Record<string, unknown> = {};
        if(fbc) meta.fbc = fbc;
        if(fbp) meta.fbp = fbp;
        attributionData.meta = meta;
    }

    // X
    const { twclid } = getXAttributionData();

    // Add X object if we have X attribution data
    if(twclid) {
        attributionData.x = { twclid };
    }

    // Reddit
    const { rdt_cid } = getRedditAttributionData();

    // Add Reddit object if we have Reddit attribution data
    if(rdt_cid) {
        attributionData.reddit = { rdt_cid };
    }

    return attributionData;
}
