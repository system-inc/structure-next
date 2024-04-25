import { atom, useAtom, useAtomValue } from 'jotai';
import React from 'react';

// Patterns
export const OTP_PATTERNS = {
    numbers: '^\\d+$',
    letters: '^[a-zA-Z]+$',
    lettersAndNumbers: '^[a-zA-Z0-9]+$',
};

type NumberDivisibleByThree = 0 | 3 | 6 | 9 | 12; // No way there's more than 12 digits in an OTP 😅
interface ChallengeOtpInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    numberOfSlots?: NumberDivisibleByThree;
}

// State
const inputMapAtom = atom(new Map<number, HTMLInputElement>());
const focusedSlotsAtom = atom<number | number[] | null>(null);
const isFocusedAtom = atom(false);

const ChallengeOtp = ({ numberOfSlots = 6, ...properties }: ChallengeOtpInterface) => {
    const SLOT_ARRAY = Array.from({ length: numberOfSlots }, (_, index) => index);
    const GROUPED_SLOT_ARRAY = Array.from({ length: 2 }, (_, index) => SLOT_ARRAY.slice(index * 3, index * 3 + 3));

    const inputMap = useAtomValue(inputMapAtom);
    const [focusedSlots, setFocusedSlots] = useAtom(focusedSlotsAtom);
    const [isFocused, setIsFocused] = useAtom(isFocusedAtom);

    const virtualInputRef = React.useRef<HTMLInputElement>(null);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if(properties.pattern) {
            const regex = new RegExp(properties.pattern);
            // console.log('regex', regex);
            // console.log('value', value);
            // console.log('regex.test(value)', regex.test(value));

            if(!regex.test(value) && value.length > 0) {
                // Erase the last character
                event.target.value = value.slice(0, -1);
                return;
            }
        }

        let valueArray = value.split('');

        // console.log('valueArray', valueArray);
        if(valueArray.length === 6) {
            setFocusedSlots(null);

            // Button element to submit the OTP
            const submitButton = document.querySelector('#challenge-submit-button') as HTMLButtonElement | null;
            if(submitButton) {
                submitButton.focus();
            }
        }
        else {
            setFocusedSlots(valueArray.length);
        }

        if(valueArray.length < 6) {
            valueArray = valueArray.concat(Array(6 - valueArray.length).fill(''));
        }

        valueArray.forEach((character, index) => {
            const input = inputMap.get(index);
            if(input) {
                input.value = character.toUpperCase();
            }
        });
    }

    function handleFocus() {
        setIsFocused(true);

        // Set the focus index to the first input without a value
        const index = Array.from(inputMap.keys()).find((index) => inputMap.get(index)?.value === '');
        if(index !== undefined) {
            setFocusedSlots(index);
        }

        console.log(focusedSlots);
    }

    function handleBlur() {
        setIsFocused(false);

        // Set the focus index to null
        setFocusedSlots(null);
    }

    React.useEffect(() => {
        function handleSelectChange() {
            if(!isFocused) {
                return;
            }

            // If the selection direction is not 'none', set the focus indeces to the selected range
            const [virtualInputSelectionStart, virtualInputSelectionEnd, virtualInputSelectionDirection] = [
                virtualInputRef.current?.selectionStart,
                virtualInputRef.current?.selectionEnd,
                virtualInputRef.current?.selectionDirection,
            ];
            console.log(virtualInputSelectionDirection);

            // If the start and end are the same, move the selection to first unfilled input
            if(virtualInputSelectionStart === virtualInputSelectionEnd) {
                const index = Array.from(inputMap.keys()).find((index) => inputMap.get(index)?.value === '');
                if(index !== undefined) {
                    setFocusedSlots(index);
                    virtualInputRef.current?.setSelectionRange(index, index);
                }
            }
            // If the start and end are different, set the focus to the selected range
            else {
                if(
                    virtualInputSelectionStart !== null &&
                    virtualInputSelectionEnd !== null &&
                    virtualInputSelectionStart !== undefined &&
                    virtualInputSelectionEnd !== undefined
                ) {
                    setFocusedSlots([
                        ...Array.from(
                            {
                                length: virtualInputSelectionEnd - virtualInputSelectionStart,
                            },
                            (_, index) => index + virtualInputSelectionStart,
                        ),
                    ]);
                }
            }
        }

        // Add an event listener to the document to listen for selection changes
        addEventListener('selectionchange', handleSelectChange, {
            capture: true, // Capture the event during the capturing phase
        });

        return () => {
            // Remove the event listener when the component is unmounted
            removeEventListener('selectionchange', handleSelectChange, {
                capture: true, // Capture the event during the capturing phase
            });
        };
    }, [setFocusedSlots, inputMap, isFocused]);

    return (
        <div className="group relative w-min">
            {/* Visual Input */}
            <div className="pointer-events-none flex items-center">
                <div className="relative flex items-center">
                    {GROUPED_SLOT_ARRAY.map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            <div className="relative z-0 flex items-center">
                                {group.map((_, index) => (
                                    <ChallengeOtpSlot
                                        key={index}
                                        ref={(ref) => {
                                            if(ref) {
                                                inputMap.set(index + groupIndex * 3, ref);
                                            }
                                        }}
                                        isFocused={
                                            index + groupIndex * 3 === focusedSlots ||
                                            (Array.isArray(focusedSlots) &&
                                                focusedSlots.includes(index + groupIndex * 3))
                                        }
                                        showCaret={index + groupIndex * 3 === focusedSlots}
                                    />
                                ))}
                            </div>
                            {groupIndex !== GROUPED_SLOT_ARRAY.length - 1 && (
                                <div className="mx-2 text-gray-500">-</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Hidden Input */}
            <input
                ref={virtualInputRef}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={6}
                className="absolute inset-0 h-full w-full uppercase opacity-0"
                {...properties}
            />
        </div>
    );
};

export default ChallengeOtp;

interface ChallengeOtpSlotInterface {
    isFocused: boolean;
    showCaret?: boolean;
}
const ChallengeOtpSlot = React.forwardRef<HTMLInputElement, ChallengeOtpSlotInterface>((properties, ref) => {
    return (
        <div
            data-focus={properties.isFocused}
            className="relative flex items-center justify-center overflow-clip border border-muted-foreground/20 transition-all first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0 group-focus-within:border-muted-foreground/50 group-hover:border-muted-foreground/50 data-[focus='true']:z-10 data-[focus='true']:ring-2 data-[focus='true']:ring-accent-foreground"
        >
            <input
                ref={ref}
                type="text"
                maxLength={1}
                tabIndex={-1}
                className="h-8 w-8 bg-light text-center dark:bg-dark"
            />

            {properties.showCaret && (
                <div
                    data-focus={properties.showCaret}
                    className='data-[focus="true"]:animate-blink absolute h-1/2 w-px rounded-full bg-dark opacity-0 data-[focus="true"]:transition-opacity dark:bg-light'
                />
            )}
        </div>
    );
});
ChallengeOtpSlot.displayName = 'ChallengeOtpSlot';
