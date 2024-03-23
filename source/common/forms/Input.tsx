// Interface - InputReference
export interface InputReferenceInterface {
    getValue: () => string | undefined;
    setValue: (value: any, event?: any) => void;
    focus: () => void;
}

// Interface - InputInterface
export interface InputInterface {
    className?: string;
    defaultValue?: string;
    required?: boolean;
    disabled?: boolean;
    tabIndex?: number;

    // Events
    onChange?: (value: string | undefined, event?: Event) => void;
    onBlur?: (value: string | undefined, event?: Event) => void;

    // Validation
    validate?: (value: any) => Promise<boolean>;
    validating?: boolean;
}
