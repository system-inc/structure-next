// Interface - Validation
export interface ValidationResult {
    valid: boolean;
    value?: unknown;
    errors?: { message: string }[];
    successes?: { message: string }[];
}

// Interface - Form Field Reference
export interface FormFieldReferenceInterface {
    getValue: () => unknown;
    setValue: (value: unknown) => void;
    validate: () => Promise<ValidationResult | undefined>;
    focus: () => void;
}

// Interface - Form Context
export interface FormContextInterface {
    registerField: (id: string, reference: FormFieldReferenceInterface) => void;
    unregisterField: (id: string) => void;
    getFieldValue: (id: string) => unknown;
    setFieldValue: (id: string, value: unknown) => void;
    validateField: (id: string) => Promise<ValidationResult | undefined>;
    getFieldValidationResult: (id: string) => ValidationResult | undefined;
    isFieldValidating: (id: string) => boolean;
    loading?: boolean;
    error?: string;
    resetForm: () => void;
}

// Add form submission response
export interface FormSubmitResponse {
    success: boolean;
    message?: string;
    errors?: Record<string, ValidationResult>;
}

// Type - Form Values
export type FormValues<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K];
};

// Type - Extract form values from form input components
export type FormInputValue<T> = T extends { id: string; type?: 'email' }
    ? { [K in T['id']]: string }
    : T extends { id: string }
      ? { [K in T['id']]: unknown }
      : never;

export type ExtractFormValues<T> = T extends Array<infer U>
    ? FormInputValue<U>
    : T extends { props: infer P }
      ? FormInputValue<P>
      : never;

export type InferFormValues<T> = T extends React.ReactElement<any>[]
    ? UnionToIntersection<ExtractFormValues<T[number]>>
    : T extends React.ReactNode
      ? UnionToIntersection<ExtractFormValues<T>>
      : never;

// Utility type to convert union to intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
