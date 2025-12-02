'use client'; // This component uses client-only features

// Dependencies - Lexical
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';

// URL regex pattern for matching web addresses
const urlPattern =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// Email regex pattern for matching email addresses
const emailPattern =
    /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

// Function to match URLs in text
function urlMatcher(text: string) {
    const match = urlPattern.exec(text);
    return (
        match && {
            index: match.index,
            length: match[0].length,
            text: match[0],
            url: match[0],
        }
    );
}

// Function to match email addresses in text
function emailMatcher(text: string) {
    const match = emailPattern.exec(text);
    return (
        match && {
            index: match.index,
            length: match[0].length,
            text: match[0],
            url: `mailto:${match[0]}`,
        }
    );
}

// Component - LexicalAutoLinkPlugin
export function LexicalAutoLinkPlugin() {
    // Render the component
    return <AutoLinkPlugin matchers={[urlMatcher, emailMatcher]} />;
}
