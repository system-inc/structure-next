// Interface - InputReference
export interface InputReferenceInterface {
    getValue: () => any | undefined;
    setValue: (value: any, event?: any) => void;
    focus: () => void;
}

// Interface - InputInterface
export interface InputInterface {
    className?: string;
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
    tabIndex?: number;

    // Methods
    focus?: () => void;

    // Events
    onChange?: (value: any | undefined, event?: any) => void;
    onBlur?: (value: any | undefined, event?: any) => void;
}
