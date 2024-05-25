'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';
import InputSelect from '@structure/source/common/forms/InputSelect';

// Dependencies - Assets
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronLeftDoubleIcon from '@structure/assets/icons/interface/ChevronLeftDoubleIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';
import ChevronRightDoubleIcon from '@structure/assets/icons/interface/ChevronRightDoubleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - Pagination
export interface PaginationInterface {
    className?: string;

    // State
    itemsTotal?: number;
    itemsPerPage?: number;
    page?: number;

    pagesTotal: number;
    onChange: (itemsPerPage: number, page: number) => Promise<void> | void;
}
export function Pagination(properties: PaginationInterface) {
    // State
    const [itemsPerPage, setItemsPerPage] = React.useState(properties.itemsPerPage || 10);
    const [page, setPage] = React.useState(properties.page || 1);
    const [pageIsValid, setPageIsValid] = React.useState(true);

    // References
    const inputTextPageReference = React.useRef<InputReferenceInterface>(null);

    // Function to handle changes
    const propertiesOnChange = properties.onChange;
    const onChangeIntercept = React.useCallback(
        async function (itemsPerPage: number, page: number) {
            // Update the input text page value
            inputTextPageReference.current?.setValue(page.toString());

            await propertiesOnChange(itemsPerPage, page);
        },
        [propertiesOnChange],
    );

    // console.log('pageIsValid', pageIsValid);

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-end space-x-10 text-sm', properties.className)}>
            <div className="flex items-center space-x-2">
                {properties.itemsTotal && <p className="mr-10">{properties.itemsTotal} records</p>}

                <p>Show</p>
                <InputSelect
                    key={itemsPerPage}
                    className="w-[102px]"
                    items={[
                        {
                            value: '10',
                        },
                        {
                            value: '25',
                        },
                        {
                            value: '50',
                        },
                        {
                            value: '100',
                        },
                        {
                            value: '250',
                        },
                        {
                            value: '500',
                        },
                        {
                            value: '1000',
                            content: '1,000',
                        },
                    ]}
                    defaultValue={itemsPerPage.toString()}
                    onChange={function (value) {
                        if(value) {
                            const newItemsPerPage = parseInt(value);
                            setItemsPerPage(newItemsPerPage);

                            // Test case #1
                            // There are 90 items
                            // I start on with 10 items per page
                            // I go to page 2
                            // I switch to 100 items per page
                            // I should be on page 1

                            // Test case #2
                            // There are 90 items
                            // I start with 100 items per page and there is 1 page
                            // I switch to 10 items per page
                            // I should go to page 1

                            // Test case #3
                            // There are 90 items
                            // I start with 10 items per page
                            // I go to page 4, starting item is 31
                            // I switch to 25 items per page
                            // I should be on page 2 with starting item 26
                            // const newPage = Math.max(
                            //     1,
                            //     Math.min(page, Math.ceil(properties.pagesTotal / newItemsPerPage)),
                            // );

                            const currentItem = (page - 1) * itemsPerPage + 1;
                            const newPage = Math.ceil(currentItem / newItemsPerPage);
                            setPage(newPage);
                            onChangeIntercept(newItemsPerPage, newPage);
                        }
                    }}
                />
            </div>
            <div className="flex items-center space-x-2">
                <p>Page</p>
                <InputText
                    key={page.toString()}
                    ref={inputTextPageReference}
                    className={mergeClassNames('w-20', !pageIsValid ? 'text-red-500 dark:text-red-500' : '')}
                    type="number"
                    autoComplete="off"
                    selectOnFocus={true}
                    defaultValue={page.toString()}
                    onChange={function (value, event) {
                        console.log('input text page onChange', value);

                        if(value !== undefined) {
                            const newPage = parseInt(value);
                            if(newPage >= 1 && newPage <= properties.pagesTotal) {
                                setPageIsValid(true);
                                setPage(newPage);
                                onChangeIntercept(itemsPerPage, newPage);
                            }
                            else {
                                setPageIsValid(false);
                            }
                        }
                    }}
                    onClick={function (event: React.MouseEvent<HTMLInputElement>) {
                        event.currentTarget.select();
                    }}
                />
                <p>of {properties.pagesTotal}</p>
                <div className="flex items-center space-x-2">
                    <Button
                        size="icon"
                        icon={ChevronLeftDoubleIcon}
                        disabled={page === 1}
                        onClick={async () => {
                            const newPage = 1;
                            setPage(newPage);
                            await onChangeIntercept(itemsPerPage, newPage);
                        }}
                    />
                    <Button
                        size="icon"
                        icon={ChevronLeftIcon}
                        disabled={page === 1}
                        onClick={async () => {
                            const newPage = page - 1;
                            setPage(newPage);
                            await onChangeIntercept(itemsPerPage, newPage);
                        }}
                    />
                    <Button
                        size="icon"
                        icon={ChevronRightIcon}
                        disabled={page === properties.pagesTotal}
                        onClick={async () => {
                            const newPage = page + 1;
                            setPage(newPage);
                            await onChangeIntercept(itemsPerPage, newPage);
                        }}
                    />
                    <Button
                        size="icon"
                        icon={ChevronRightDoubleIcon}
                        disabled={page === properties.pagesTotal}
                        onClick={async () => {
                            const newPage = properties.pagesTotal;
                            setPage(newPage);
                            await onChangeIntercept(itemsPerPage, newPage);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default Pagination;
