import { atom, type SetStateAction } from 'jotai';

export function atomWithBroadcast<Value>(key: string, initialValue: Value) {
    const baseAtom = atom(initialValue);
    const listeners = new Set<(event: MessageEvent<Value>) => void>();
    const channel = new BroadcastChannel(key);

    channel.onmessage = (event) => {
        listeners.forEach((l) => l(event));
    };

    const broadcastAtom = atom(
        (get) => get(baseAtom),
        (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
            set(baseAtom, update.value);

            if(!update.isEvent) {
                channel.postMessage(get(baseAtom));
            }
        },
    );

    broadcastAtom.onMount = (setAtom) => {
        const listener = (event: MessageEvent<Value>) => {
            setAtom({ isEvent: true, value: event.data });
        };

        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    };

    const returnedAtom = atom(
        (get) => get(broadcastAtom),
        (_get, set, update: SetStateAction<Value>) => {
            set(broadcastAtom, { isEvent: false, value: update });
        },
    );

    return returnedAtom;
}
