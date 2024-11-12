import React from 'react';

// Define the Item type
type FormInput<T extends string, V> = {
    id: T;
    value: V;
};

// The collectValues function with type safety
function collectFormInputValues<T extends ReadonlyArray<FormInput<string, any>>>(
    items: T,
): { [K in T[number]['id']]: Extract<T[number], { id: K }>['value'] } {
    const result = {} as { [K in T[number]['id']]: Extract<T[number], { id: K }>['value'] };
    for(const item of items) {
        result[item.id as keyof typeof result] = item.value;
    }
    return result;
}

// The form interface with proper typing
interface FormInterface<T extends ReadonlyArray<FormInput<string, any>>> {
    formInputs: T;
    handleSubmit: (values: { [K in T[number]['id']]: Extract<T[number], { id: K }>['value'] }) => void;
}

const Form = function <T extends ReadonlyArray<FormInput<string, any>>>(properties: FormInterface<T>) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values = collectFormInputValues(properties.formInputs);
        properties.handleSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Test Component</h1>
        </form>
    );
};

export default Form;

// Usage example
export const TestForm = function () {
    return (
        <Form
            formInputs={
                [
                    { id: 'name', value: 'Alice' }, // infers string
                    { id: 'age', value: 30 }, // infers number
                    { id: 'isAdmin', value: true }, // infers boolean
                    { id: 'scores', value: [1, 2, 3] }, // infers number[]
                    { id: 'settings', value: { theme: 'dark', showNotifications: true } }, // infers object type
                ] as const
            }
            handleSubmit={(values) => {
                // TypeScript correctly infers all these types:
                values.name; // type: string
                values.age; // type: number
                values.isAdmin; // type: boolean
                values.scores; // type: readonly [1, 2, 3]
                values.settings; // type: { theme: "dark", showNotifications: true }

                // These would be type errors:
                // values.age = "30";     // Error: Type 'string' is not assignable to type 'number'
                // values.nonexistent;    // Error: Property 'nonexistent' does not exist
            }}
        />
    );
};
