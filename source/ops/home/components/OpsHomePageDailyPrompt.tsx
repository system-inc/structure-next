// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { SparkleIcon } from '@phosphor-icons/react';

// Function to get deterministic question based on day
function getDailyQuestion(questions: string[]): string {
    // Get current date and create a seed from year + day of year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

    // Use day of year to deterministically select a question
    const questionIndex = dayOfYear % questions.length;

    // Return the question for today
    return questions[questionIndex]!;
}

// Component - OpsHomePageDailyPrompt
export interface OpsHomePageDailyPromptProperties {
    className?: string;
    questions: string[];
}
export function OpsHomePageDailyPrompt(properties: OpsHomePageDailyPromptProperties) {
    // Get today's question
    const dailyQuestion = getDailyQuestion(properties.questions);

    // Render the component
    return (
        <div className={properties.className}>
            <div className="flex items-center gap-2">
                <SparkleIcon size={16} weight="fill" className="shrink-0 text-purple-500" />
                <p className="text-sm leading-relaxed content--1">{dailyQuestion}</p>
            </div>
        </div>
    );
}
