// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { TableColumnType, TableColumnProperties } from '@structure/source/components/tables/TableColumn';
import { TableCellContentId } from '@structure/source/components/tables/cells/TableCellContentId';
import { TableCellContentOption } from '@structure/source/components/tables/cells/TableCellContentOption';
import { TableCellContentImageUrl } from '@structure/source/components/tables/cells/TableCellContentImageUrl';
import { TableCellContentDateTime } from '@structure/source/components/tables/cells/TableCellContentDateTime';
import { TableCellContentBoolean } from '@structure/source/components/tables/cells/TableCellContentBoolean';
import { TableCellContentHtml } from '@structure/source/components/tables/cells/TableCellContentHtml';
import { TableCellContentUrl } from '@structure/source/components/tables/cells/TableCellContentUrl';
import { TableCellContentNumber } from '@structure/source/components/tables/cells/TableCellContentNumber';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { ObjectTable } from '@structure/source/components/tables/ObjectTable';
import { CopyButton } from '@structure/source/components/buttons/CopyButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TableCell
export interface TableCellProperties extends React.HTMLAttributes<HTMLTableCellElement> {
    value?: string;
    column?: TableColumnProperties;
    url?: string;
    openUrlInNewTab?: boolean;
}
export function TableCell(properties: TableCellProperties) {
    // console.log('properties.value', properties.value);
    // console.log('properties.children', properties.children);

    // Set the content
    let content;

    // Wrap the children in a span if it is a string
    // This is so we can listen for clicks the row to select it
    if(properties.children) {
        if(typeof properties.children === 'string') {
            content = <span>{properties.children}</span>;
        }
        else {
            content = properties.children;
        }
    }
    else if(properties.value) {
        if(properties.url === undefined) {
            content = <span>{properties.value}</span>;
        }
        else {
            content = properties.value;
        }
    }

    // If we have a value and no children (children take precedence for display)
    if(properties.value && !properties.children) {
        // Cell Content - ID
        if(
            properties.column?.type === TableColumnType.Id &&
            typeof properties.value == 'string' &&
            properties.value.length == 36
        ) {
            const meta = properties.column?.meta as Record<string, string> | undefined;
            let url = meta?.url;
            if(url) {
                url += properties.value;
            }

            content = <TableCellContentId value={properties.value} url={url} openUrlInNewTab={true} />;
        }
        // Cell Content - Option
        else if(properties.column?.type === TableColumnType.Option) {
            content = <TableCellContentOption value={properties.value} />;
        }
        // Cell Content - Image URL
        else if(
            properties.column?.type === TableColumnType.ImageUrl ||
            /(\.jpeg|\.jpg|\.png|\.webp|\.bmp|\.gif|\.svg|\.tiff|\.tif|\.ico|\.heif|\.heic|\.avif)$/i.test(
                properties.value,
            )
        ) {
            let url = properties.value;

            // If the URL is relative, prepend the assets URL
            if(!url?.startsWith('http')) {
                url = 'https://' + ProjectSettings.assets.host + url;
            }

            content = <TableCellContentImageUrl value={properties.value} url={url} openUrlInNewTab={true} />;
        }
        // Cell Content - Date Time
        else if(properties.column?.type === TableColumnType.DateTime) {
            content = <TableCellContentDateTime value={properties.value} />;
        }
        // Cell Content - Boolean
        else if(properties.column?.type === TableColumnType.Boolean) {
            content = <TableCellContentBoolean value={properties.value} />;
        }
        // Cell Content - HTML
        else if(
            properties.column?.type === TableColumnType.Html ||
            properties.value?.toString().toLowerCase().startsWith('<!doctype') ||
            properties.value?.toString().toLowerCase().startsWith('<html')
        ) {
            content = <TableCellContentHtml value={properties.value} />;
        }
        // Cell Content - URL
        else if(properties.column?.type === TableColumnType.Url) {
            content = <TableCellContentUrl value={properties.value} openUrlInNewTab={true} />;
        }
        // Cell Content - Number
        else if(properties.column?.type === TableColumnType.Number) {
            content = <TableCellContentNumber value={properties.value} />;
        }
        // Text
        else if(typeof properties.value === 'string') {
            const longContent = properties.value.length > 200;

            // If the value is JSON, parse it
            let value: string | React.JSX.Element | React.JSX.Element[] = properties.value;
            let json = null;
            try {
                json = JSON.parse(properties.value);
            } catch {
                // Do nothing
            }

            // If the JSON is valid and is an array or an object, format it into a table
            if(json && (Array.isArray(json) || typeof json === 'object')) {
                // console.log('json', json);
                value = <ObjectTable object={json} containerClassName={''} />;
            }
            else {
                // Replace new lines with breaks
                value = properties.value.split('\n').map(function (line, index) {
                    return (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    );
                });
            }

            // Use dialogs for long content
            content = (
                <Dialog
                    variant="A"
                    trigger={<div className="w-full truncate">{properties.value}</div>}
                    className={mergeClassNames('w-full text-sm md:max-w-4xl md:min-w-lg', longContent ? '' : '')}
                    accessibilityTitle={properties.column?.title || 'Cell Content'}
                    accessibilityDescription="View full table cell content"
                >
                    <Dialog.Header>{properties.column?.title}</Dialog.Header>
                    <Dialog.Body>{value}</Dialog.Body>
                    <Dialog.Footer closeButton>
                        <CopyButton variant="Ghost" size="Small" className="mr-3 pl-3" value={properties.value}>
                            Copy
                        </CopyButton>
                    </Dialog.Footer>
                </Dialog>
            );
        }
    }
    // If there is no content, render null
    else if(!content) {
        content = <i className="content--2">-</i>;
    }

    // Render the component
    return (
        <td className={mergeClassNames('max-w-xs truncate p-2 px-2 py-1 text-left', properties.className)}>
            {properties.url ? (
                <Link
                    className="hover:underline"
                    href={properties.url}
                    target={properties.openUrlInNewTab ? '_blank' : undefined}
                    prefetch={false}
                >
                    {content}
                </Link>
            ) : (
                content
            )}
        </td>
    );
}
