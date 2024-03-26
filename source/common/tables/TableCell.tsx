// Dependencies - Structure
import StructureSettings from '@structure/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { TableColumnType, TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableCellContentId } from '@structure/source/common/tables/cells/TableCellContentId';
import { TableCellContentOption } from '@structure/source/common/tables/cells/TableCellContentOption';
import { TableCellContentImageUrl } from '@structure/source/common/tables/cells/TableCellContentImageUrl';
import { TableCellContentDateTime } from '@structure/source/common/tables/cells/TableCellContentDateTime';
import { TableCellContentBoolean } from '@structure/source/common/tables/cells/TableCellContentBoolean';
import { TableCellContentHtml } from '@structure/source/common/tables/cells/TableCellContentHtml';
import { TableCellContentUrl } from '@structure/source/common/tables/cells/TableCellContentUrl';
import { TableCellContentNumber } from '@structure/source/common/tables/cells/TableCellContentNumber';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - TableCell
export interface TableCellInterface extends React.HTMLAttributes<HTMLTableCellElement> {
    value?: string;
    column?: TableColumnInterface;
    url?: string;
    openUrlInNewTab?: boolean;
}
export function TableCell(properties: TableCellInterface) {
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

    // If we have a value
    if(properties.value) {
        // Cell Content - ID
        if(
            properties.column?.type === TableColumnType.Id &&
            typeof properties.value == 'string' &&
            properties.value.length == 36
        ) {
            let url = properties.column?.meta?.url;
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
                url = StructureSettings.assetsUrl + url;
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
    }
    // If there is no content, render null
    else if(!content) {
        content = <i className="text-neutral">-</i>;
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

// Export - Default
export default TableCell;
