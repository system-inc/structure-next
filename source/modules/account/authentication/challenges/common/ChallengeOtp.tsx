import { atom, useAtom, useAtomValue } from 'jotai';
import React from 'react';

interface ChallengeOtpInterface extends React.HTMLAttributes<HTMLInputElement> {}

const inputMapAtom = atom(new Map<number, HTMLInputElement>());
const focusAtom = atom<number | null>(null);

const ChallengeOtp = (properties: ChallengeOtpInterface) => {
    const inputMap = useAtomValue(inputMapAtom);
    const [focus, setFocus] = useAtom(focusAtom);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        let valueArray = value.split('');

        console.log('valueArray', valueArray);
        if(valueArray.length === 6) {
            setFocus(null);
        }
        else {
            setFocus(valueArray.length);
        }

        if(valueArray.length < 6) {
            valueArray = valueArray.concat(Array(6 - valueArray.length).fill(''));
        }

        valueArray.forEach((character, index) => {
            const input = inputMap.get(index);
            if(input) {
                input.value = character;
            }
        });
    }

    function handleFocus() {
        // Set the focus index to the first input without a value
        const index = Array.from(inputMap.keys()).find((index) => inputMap.get(index)?.value === '');
        if(index !== undefined) {
            setFocus(index);
        }
    }

    function handleBlur() {
        // Set the focus index to null
        setFocus(null);
    }

    console.log('focus', focus);

    return (
        <div className="group relative w-min">
            {/* Visual Input */}
            <div className="pointer-events-none flex items-center">
                <div className="relative flex items-center">
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                data-focus={index === focus}
                                className="relative flex items-center justify-center overflow-clip border border-muted-foreground/20 transition-all first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0 group-focus-within:border-muted-foreground/50 group-hover:border-muted-foreground/50 data-[focus='true']:z-10 data-[focus='true']:ring-2 data-[focus='true']:ring-accent-foreground"
                            >
                                <input
                                    ref={(ref) => {
                                        if(ref) {
                                            inputMap.set(index, ref);
                                        }
                                    }}
                                    type="text"
                                    maxLength={1}
                                    tabIndex={-1}
                                    className="h-8 w-8 bg-light text-center dark:bg-dark"
                                />

                                <div
                                    data-focus={index === focus}
                                    className='data-[focus="true"]:animate-blink absolute h-1/2 w-px rounded-full bg-dark opacity-0 data-[focus="true"]:transition-opacity dark:bg-light'
                                />
                            </div>
                        ))}
                </div>
                <div className="mx-2 text-gray-500">-</div>
                <div className="relative z-0 flex items-center">
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                data-focus={index + 3 === focus}
                                className="data-[focus='true']:transition-ring-colors relative flex items-center justify-center overflow-clip border border-muted-foreground/20 transition-all first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0 group-focus-within:border-muted-foreground/50 group-hover:border-muted-foreground/50 data-[focus='true']:z-10 data-[focus='true']:ring-2 data-[focus='true']:ring-accent-foreground"
                            >
                                <input
                                    ref={(ref) => {
                                        if(ref) {
                                            inputMap.set(index + 3, ref);
                                        }
                                    }}
                                    type="text"
                                    maxLength={1}
                                    tabIndex={-1}
                                    className="h-8 w-8 bg-light text-center dark:bg-dark"
                                />

                                <div
                                    data-focus={index + 3 === focus}
                                    className='data-[focus="true"]:animate-blink absolute h-1/2 w-px rounded-full bg-dark opacity-0 data-[focus="true"]:transition-opacity dark:bg-light'
                                />
                            </div>
                        ))}
                </div>
            </div>

            {/* Hidden Input */}
            <input
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={6}
                className="absolute inset-0 h-full w-full opacity-0"
                {...properties}
            />
        </div>
    );
};

export default ChallengeOtp;
