// Interface - InputReference
export interface InputReferenceInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValue: () => any | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: (value: any, event?: any) => void;
    focus: () => void;
    click?: () => void;
}

// Interface - InputInterface
export interface InputInterface {
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
    tabIndex?: number;

    // Methods
    focus?: () => void;

    // Events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (value: any | undefined, event?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBlur?: (value: any | undefined, event?: any) => void;
}
