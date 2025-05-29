// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableRowProperties } from '@structure/source/common/tables/TableRow';
import { InputCheckboxState, InputCheckbox } from '@structure/source/common/forms/InputCheckbox';

export function TableRowInputCheckbox(properties: TableRowProperties) {
    const checkboxRef = React.useRef<React.ElementRef<typeof InputCheckbox> | null>(null);
    const [forceSafeRerender, setForceSafeRerender] = React.useState<number>(0);
    const propertiesRowsLength = properties.rowsLength ?? 0;
    const propertiesSelectedRowsIndexesSet = properties.selectedRowsIndexesSet;

    React.useEffect(
        function () {
            // console.log('TableRowInputCheckbox useEffect', propertiesRowsLength);
            if(checkboxRef.current) {
                const headerCondition =
                    properties.type === 'Header' &&
                    propertiesRowsLength === propertiesSelectedRowsIndexesSet?.size &&
                    propertiesRowsLength > 0;
                const bodyCondition = propertiesSelectedRowsIndexesSet?.has(properties.rowIndex ?? -1);

                if(properties.type === 'Header') {
                    // console.log(
                    //     'headerCondition',
                    //     headerCondition,
                    //     propertiesRowsLength,
                    //     propertiesSelectedRowsIndexesSet?.size,
                    // );
                }

                checkboxRef.current.setValue(
                    bodyCondition || headerCondition ? InputCheckboxState.Checked : InputCheckboxState.Unchecked,
                );
            }
        },
        [
            propertiesSelectedRowsIndexesSet,
            propertiesRowsLength,
            forceSafeRerender,
            properties.rowIndex,
            properties.type,
        ],
    );

    React.useEffect(function () {
        // Create a listener to force a safe re-render when the selected property changes
        const listener = function () {
            setForceSafeRerender((value) => value + 1);
        };

        // Add the listener
        window.addEventListener('updateCheckboxes', listener);

        // Remove the listener
        return function () {
            window.removeEventListener('updateCheckboxes', listener);
        };
    }, []);

    // Render the component
    return (
        <InputCheckbox
            ref={checkboxRef}
            tabIndex={0}
            defaultValue={properties.selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
            onChange={function (value) {
                if(properties.onSelectChange) {
                    properties.onSelectChange(properties, value === InputCheckboxState.Checked ? true : false);
                }
            }}
        />
    );
}
