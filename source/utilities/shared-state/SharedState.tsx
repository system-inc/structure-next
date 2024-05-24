// Dependencies - Utilities
import {
    atom as jotaiAtom,
    useAtom as jotaiUseAtom,
    useSetAtom as jotaiUseSetAtom,
    useAtomValue as jotaiUseAtomValue,
} from 'jotai';
import { atomWithDefault as jotaiAtomWithDefault, atomWithStorage as jotaiAtomWithStorage } from 'jotai/utils';

// Export - Individual
export const SharedState = jotaiAtom;
export const useSharedState = jotaiUseAtom;
export const useSetSharedState = jotaiUseSetAtom;
export const useSharedStateValue = jotaiUseAtomValue;
export const SharedStateWithDefault = jotaiAtomWithDefault;
export const SharedStateWithStorage = jotaiAtomWithStorage;

// Shared State
export const SharedStateModule = {
    // Jotai
    SharedState,
    useSharedState,
    useSetSharedState,
    useSharedStateValue,

    // Jotai Utilities
    SharedStateWithDefault,
    SharedStateWithStorage,
};

// Export - Default
export default SharedStateModule;
