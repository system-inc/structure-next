'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';
import InputSelect from '@structure/source/common/forms/InputSelect';

// Dependencies - Assets
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronLeftDoubleIcon from '@structure/assets/icons/interface/ChevronLeftDoubleIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';
import ChevronRightDoubleIcon from '@structure/assets/icons/interface/ChevronRightDoubleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Pagination
export interface PaginationProperties {
    className?: string;
    useLinks?: boolean;
    itemsPerPageControl?: boolean;
    pageInputControl?: boolean;
    firstAndLastPageControl?: boolean;

    // State
    page: number;
    itemsTotal?: number;
    itemsPerPage?: number;

    pagesTotal: number;
    onChange?: (itemsPerPage: number, page: number) => Promise<void> | void;
}
export function Pagination(properties: PaginationProperties) {
    // console.log('Pagination', properties);

    // State
    const [itemsPerPage, setItemsPerPage] = React.useState(properties.itemsPerPage || 10);
    const [pageIsValid, setPageIsValid] = React.useState(true);

    // References
    const inputTextPageReference = React.useRef<InputReferenceInterface>(null);

    // Defaults
    const {
        useLinks = false,
        itemsPerPageControl = true,
        pageInputControl = true,
        firstAndLastPageControl = true,
    } = properties;
    // const useLinks = properties.useLinks ?? false;
    // const itemsPerPageControl = properties.itemsPerPageControl ?? true;
    // const pageInputControl = properties.pageInputControl ?? true;

    // Extract property to avoid dependency on the whole properties object
    const propertiesOnChange = properties.onChange;

    // Function to handle changes
    const onChangeIntercept = React.useCallback(
        async function (itemsPerPage: number, page: number) {
            // Update the input text page value
            inputTextPageReference.current?.setValue(page.toString());

            await propertiesOnChange?.(itemsPerPage, page);
        },
        [propertiesOnChange],
    );

    // console.log('pageIsValid', pageIsValid);

    // Function to construct href with existing query parameters
    function constructHrefWithExistingUrlSearchParameters(page: number) {
        // Server
        if(typeof window === 'undefined') {
            return `?page=${page}`;
        }
        // Client
        else {
            const urlSearchParameters = new URLSearchParams(window.location.search);
            urlSearchParameters.set('page', page.toString());
            return `?${urlSearchParameters.toString()}`;
        }
    }

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-end space-x-10 text-sm', properties.className)}>
            {itemsPerPageControl && (
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

                                const currentItem = (properties.page - 1) * itemsPerPage + 1;
                                const newPage = Math.ceil(currentItem / newItemsPerPage);
                                onChangeIntercept(newItemsPerPage, newPage);
                            }
                        }}
                    />
                </div>
            )}

            <div className="flex items-center space-x-2">
                {pageInputControl && (
                    <>
                        <p>Page</p>
                        <InputText
                            key={properties.page.toString()}
                            id="paginationPage"
                            ref={inputTextPageReference}
                            className={mergeClassNames('w-20', !pageIsValid ? 'text-red-500 dark:text-red-500' : '')}
                            type="number"
                            autoComplete="off"
                            selectOnFocus={true}
                            defaultValue={properties.page.toString()}
                            onChange={function (value) {
                                console.log('input text page onChange', value);

                                if(value !== undefined) {
                                    const newPage = parseInt(value);
                                    if(newPage >= 1 && newPage <= properties.pagesTotal) {
                                        setPageIsValid(true);
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
                    </>
                )}
                <div className="flex items-center space-x-2">
                    {/* First Page */}
                    {firstAndLastPageControl && (
                        <Button
                            size="icon"
                            icon={ChevronLeftDoubleIcon}
                            disabled={properties.page === 1}
                            href={
                                useLinks && properties.page !== 1
                                    ? constructHrefWithExistingUrlSearchParameters(1)
                                    : undefined
                            }
                            onClick={
                                useLinks
                                    ? undefined
                                    : async function () {
                                          const newPage = 1;
                                          await onChangeIntercept(itemsPerPage, newPage);
                                      }
                            }
                        />
                    )}

                    {/* Previous Page */}
                    <Button
                        size="icon"
                        icon={ChevronLeftIcon}
                        disabled={properties.page <= 1}
                        href={
                            useLinks && properties.page > 1
                                ? constructHrefWithExistingUrlSearchParameters(Number(properties.page) - 1)
                                : undefined
                        }
                        onClick={
                            useLinks
                                ? undefined
                                : async function () {
                                      const newPage = properties.page - 1;
                                      await onChangeIntercept(itemsPerPage, newPage);
                                  }
                        }
                    />

                    {/* Next Page */}
                    <Button
                        size="icon"
                        icon={ChevronRightIcon}
                        disabled={properties.page >= properties.pagesTotal}
                        href={
                            useLinks && properties.page < properties.pagesTotal
                                ? constructHrefWithExistingUrlSearchParameters(Number(properties.page) + 1)
                                : undefined
                        }
                        onClick={
                            useLinks
                                ? undefined
                                : async function () {
                                      const newPage = properties.page + 1;
                                      await onChangeIntercept(itemsPerPage, newPage);
                                  }
                        }
                    />

                    {/* Last Page */}
                    {firstAndLastPageControl && (
                        <Button
                            size="icon"
                            icon={ChevronRightDoubleIcon}
                            disabled={properties.page >= properties.pagesTotal}
                            href={
                                useLinks && properties.page < properties.pagesTotal
                                    ? constructHrefWithExistingUrlSearchParameters(properties.pagesTotal)
                                    : undefined
                            }
                            onClick={
                                useLinks
                                    ? undefined
                                    : async function () {
                                          const newPage = properties.pagesTotal;
                                          await onChangeIntercept(itemsPerPage, newPage);
                                      }
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
