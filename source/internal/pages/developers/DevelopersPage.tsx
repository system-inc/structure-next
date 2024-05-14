'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import CodeEditor from '@project/source/modules/common/text/CodeView';
import InputText from '@structure/source/common/forms/InputText';
import InputCheckbox, { InputCheckboxState } from '@structure/source/common/forms/InputCheckbox';

// Component - DevelopersPage
export type DevelopersPageProperties = {};
export function DevelopersPage(properties: DevelopersPageProperties) {
    const [code, setCode] = React.useState<string>(`// Code goes here
const [state, setState] = React.useState<string>('');`);
    const [language, setLanguage] = React.useState<string>('typescript');
    const [editing, setEditing] = React.useState<boolean>(false);
    const [showLineNumbers, setShowLineNumbers] = React.useState<boolean>(true);

    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Developers</h1>
            <div className="my-4 space-y-2">
                <InputText
                    placeholder="Language"
                    defaultValue={language}
                    onChange={(val) => {
                        if(val) setLanguage(val);
                    }}
                />
                <div className="flex items-center space-x-2">
                    <InputCheckbox
                        defaultValue={editing ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
                        onChange={(val) => {
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
                        onChange={(val) => {
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
                    <CodeEditor
                        code={code}
                        setCode={setCode}
                        language={language}
                        className="text-sm"
                        edit={editing}
                        showLineNumbers={showLineNumbers}
                    />
                </div>
            </div>
        </>
    );
}

// Export - Default
export default DevelopersPage;
