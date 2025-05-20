import React from 'react';
import { CommandPlugin } from './CommandPlugin';

// Define snippet types
type Snippet = {
    key: string;
    value: string;
};

// Sample predefined snippets
const PREDEFINED_SNIPPETS: Snippet[] = [
    {
        key: 'delete-account-response',
        value: "Thank you so much for reaching out and we're sorry for the delay in response here.\n\nYou can delete your account by clicking the 'Delete Account' button by going to this link while logged in: https://www.phi.health/account/settings\n\nPlease let us know if you have trouble locating it.",
    },
    {
        key: 'refund-policy',
        value: 'Our Refund Policy:\n\nWe offer a 30-day money-back guarantee on all purchases. To request a refund, please contact our support team with your order number and reason for refund. Processing typically takes 5-7 business days.',
    },
    {
        key: 'welcome-message',
        value: "Welcome to our platform! We're excited to have you join our community. Here are some quick tips to get started:\n\n- Complete your profile\n- Explore the dashboard\n- Check out our tutorials\n\nIf you need any assistance, our support team is available 24/7.",
    },
    {
        key: 'thank-you',
        value: "Thank you for your submission! We've received your request and will process it shortly. You should receive a confirmation email within the next few minutes.",
    },
];

export function SlashSnippetCommandPlugin() {
    // const [editor] = useLexicalComposerContext();

    // Memoize snippets to prevent unnecessary re-renders
    const snippets = React.useMemo(() => PREDEFINED_SNIPPETS, []);

    const handleSnippetSelect = (snippet: Snippet) => {
        console.log(`Selected snippet: ${snippet.key}`);
    };

    return <CommandPlugin prefix="/" commands={snippets} onSelect={handleSnippetSelect} />;
}
