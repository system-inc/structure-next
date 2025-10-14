// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Markdown } from '@structure/source/components/markdown/Markdown';

// Component - ContentPage
export function ContentPage() {
    // Render the component

    const tableTest = `
# Table Test

| Energy Amount | OpenAI GPT-4o (default) | Anthropic Claude Sonnet 3.5 | Anthropic Claude Opus |
|--------------|-------------------------|---------------------------|---------------------|
| 1B | 74 messages | 56 messages | 11 messages |
| 2B | 148 messages | 111 messages | 22 messages |
| 5B | 370 messages | 278 messages | 56 messages |
| 10B | 741 messages | 556 messages | 111 messages |
| 11B | 815 messages | 611 messages | 122 messages |
  `;

    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Content</h1>
            <Markdown className="mt-8">{tableTest}</Markdown>
        </div>
    );
}
