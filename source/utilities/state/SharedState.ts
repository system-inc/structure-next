// This fundamentally breaks the naming conventions that conceptually separate React state from Jotai atoms. Also, the zustand invocation here will break how the library is used in the rest of the codebase.

// In terms of onboarding new engineers, you're only introducing new complexity rather that maintaining simplicity by abstracting to a new system that defies traditional conventions.

// Usually I would let you move forward on your own with this, but having side-by-side invocations of state managers (since I won't be using this) will introduce some major bugs.

// FIXME: Delete this file.
// Dependencies
// import {
//     atom as jotaiAtom,
//     useAtom as jotaiUseAtom,
//     useSetAtom as jotaiUseSetAtom,
//     useAtomValue as jotaiUseAtomValue,
// } from 'jotai';
// import { create as zustandCreate, type StateCreator as StateStorageCreatorType } from 'zustand';

// // Jotai - Used to create shared state for React components
// export const State = jotaiAtom;
// export const useState = jotaiUseAtom;
// export const useSetState = jotaiUseSetAtom;
// export const useStateValue = jotaiUseAtomValue;

// // Zustand - Use to created shared state for any TypeScript code, not just React components
// export const StateStorage = zustandCreate;
// export type { StateStorageCreatorType };

// // Shared State
// export const SharedState = {
//     // Jotai
//     State,
//     useState,
//     useSetState,
//     useStateValue,

//     // Zustand
//     StateStorage,
// };

// // Export - Default
// export default SharedState;
