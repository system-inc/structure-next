'use client'; // This hook uses client-only features

// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { accountAtom } from './useAccount';

/**
 * Hook - useAccountEmailAddress
 *
 * Optimized selector hook that only subscribes to the account email address.
 * This prevents unnecessary re-renders when other account properties change
 * (e.g., isLoading, error, etc.).
 *
 * This is particularly useful for forms that only need to auto-fill the email
 * address and don't need to re-render when account loading states change.
 *
 * @returns The current account email address, or empty string if not available
 */
export function useAccountEmailAddress(): string {
    // Create a derived atom that only extracts the email address
    const emailAddressAtom = selectAtom(
        accountAtom,
        function (state) {
            return state.data?.emailAddress ?? '';
        },
        function (previous, next) {
            // Only trigger re-render if email address actually changed
            return previous === next;
        },
    );

    return useAtomValue(emailAddressAtom);
}
