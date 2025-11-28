'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { Code } from '@structure/source/components/code/Code';
import { InputText } from '@structure/source/components/forms/InputText';
import { InputCheckbox, InputCheckboxState } from '@structure/source/components/forms/InputCheckbox';

// Component - DevelopersPage
export function DevelopersPage() {
    const [code, setCode] = React.useState<string>(`// Code goes here
const [state, setState] = React.useState<string>('');`);
    const [language, setLanguage] = React.useState<string>('typescript');
    const [editing, setEditing] = React.useState<boolean>(false);
    const [showLineNumbers, setShowLineNumbers] = React.useState<boolean>(true);

    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <h1>Developers</h1>
            <div className="my-4 space-y-2">
                <InputText
                    id="language"
                    placeholder="Language"
                    defaultValue={language}
                    onChange={function (val) {
                        if(val) setLanguage(val);
                    }}
                />
                <div className="flex items-center space-x-2">
                    <InputCheckbox
                        defaultValue={editing ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
                        onChange={function (val) {
                            if(val === InputCheckboxState.Checked) {
                                setEditing(true);
                            }
                            else {
                                setEditing(false);
                            }
                        }}
                    />
                    <p>Edit</p>
                </div>
                <div className="flex items-center space-x-2">
                    <InputCheckbox
                        defaultValue={showLineNumbers ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
                        onChange={function (val) {
                            if(val === InputCheckboxState.Checked) {
                                setShowLineNumbers(true);
                            }
                            else {
                                setShowLineNumbers(false);
                            }
                        }}
                    />
                    <p>Show Line Numbers</p>
                </div>

                <div className="relative min-h-[300px]">
                    <Code
                        code={code}
                        setCode={setCode}
                        language={language}
                        className="text-sm"
                        edit={editing}
                        showLineNumbers={showLineNumbers}
                    />
                </div>
            </div>
        </div>
    );
}
