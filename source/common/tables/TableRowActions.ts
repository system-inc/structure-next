// Dependencies - Main Components
import { TableRowInterface } from '@structure/source/common/tables/TableRow';

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
export function copyRowAsJsonToClipboard(row: TableRowInterface) {}

// Function to copy row as JSON to clipboard (visible columns only)
export function copyRowAsJsonToClipboardVisibleColumns(row: TableRowInterface) {}

// Function to copy row as CSV to clipboard
export function copyRowAsCsvToClipboard(row: TableRowInterface) {}

// Function to copy row as CSV to clipboard (visible columns only)
export function copyRowAsCsvToClipboardVisibleColumns(row: TableRowInterface) {}
