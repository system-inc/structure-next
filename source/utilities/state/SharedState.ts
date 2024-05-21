// Dependencies
import {
    atom as jotaiAtom,
    useAtom as jotaiUseAtom,
    useSetAtom as jotaiUseSetAtom,
    useAtomValue as jotaiUseAtomValue,
} from 'jotai';
import { create as zustandCreate, type StateCreator as StateStorageCreatorType } from 'zustand';

// Jotai - Used to create shared state for React components
export const State = jotaiAtom;
export const useState = jotaiUseAtom;
export const useSetState = jotaiUseSetAtom;
export const useStateValue = jotaiUseAtomValue;

// Zustand - Use to created shared state for any TypeScript code, not just React components
export const StateStorage = zustandCreate;
export type { StateStorageCreatorType };

// Shared State
export const SharedState = {
    // Jotai
    State,
    useState,
    useSetState,
    useStateValue,

    // Zustand
    StateStorage,
};

// Export - Default
export default SharedState;
