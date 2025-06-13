// Dependencies - Main Components
// TableRowInterface is commented out in function parameters but kept here for reference
// when implementing the TODOs
/* import { TableRowInterface } from '@structure/source/common/tables/TableRow'; */

// Default Table Rows Actions
export const defaultTableRowActions = [
    {
        content: 'Copy as JSON',
        onSelected: copyRowAsJsonToClipboard,
        closeMenuOnSelect: true,
    },
    {
        content: 'Copy as JSON (Visible Columns Only)',
        onSelected: copyRowAsJsonToClipboardVisibleColumns,
        closeMenuOnSelect: true,
    },
    {
        content: 'Copy as CSV',
        onSelected: copyRowAsCsvToClipboard,
        closeMenuOnSelect: true,
    },
    {
        content: 'Copy as CSV (Visible Columns Only)',
        onSelected: copyRowAsCsvToClipboardVisibleColumns,
        closeMenuOnSelect: true,
    },
];

// Function to copy row as JSON to clipboard
// TODO: Implement this function to copy row data as JSON to clipboard
export function copyRowAsJsonToClipboard(/* row: TableRowInterface */) {}

// Function to copy row as JSON to clipboard (visible columns only)
// TODO: Implement this function to copy visible columns as JSON to clipboard
export function copyRowAsJsonToClipboardVisibleColumns(/* row: TableRowInterface */) {}

// Function to copy row as CSV to clipboard
// TODO: Implement this function to copy row data as CSV to clipboard
export function copyRowAsCsvToClipboard(/* row: TableRowInterface */) {}

// Function to copy row as CSV to clipboard (visible columns only)
// TODO: Implement this function to copy visible columns as CSV to clipboard
export function copyRowAsCsvToClipboardVisibleColumns(/* row: TableRowInterface */) {}
