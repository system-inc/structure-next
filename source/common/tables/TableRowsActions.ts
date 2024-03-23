// Dependencies - Main Components
import { TableRowInterface } from '@structure/source/common/tables/TableRow';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';

// Copy as JSON Action
export const copyAsJsonAction = {
    action: 'Copy as JSON',
    actionFunction: copyRowsAsJsonToClipboard,
    notice: {
        title: 'Rows Copied as JSON',
        content: 'The selected rows have been copied to your clipboard as JSON.',
    },
};

// Copy as JSON (Visible Columns Only) Action
export const copyAsJsonVisibleColumnsOnlyAction = {
    action: 'Copy as JSON (Visible Columns Only)',
    actionFunction: copyRowsAsJsonToClipboardVisibleColumns,
    notice: {
        title: 'Rows Copied as JSON',
        content: 'The selected rows with only the visible columns have been copied to your clipboard as JSON.',
    },
};

// Export as JSON Action
export const exportAsJsonAction = {
    action: 'Export as JSON',
    actionFunction: exportRowsAsJsonFile,
    notice: {
        title: 'Rows Exported as JSON',
        content: 'The selected rows have been exported as a JSON file.',
    },
};

// Export as JSON (Visible Columns Only) Action
export const exportAsJsonVisibleColumnsOnlyAction = {
    action: 'Export as JSON (Visible Columns Only)',
    actionFunction: exportRowsAsJsonFileVisibleColumnsOnly,
    notice: {
        title: 'Rows Exported as JSON',
        content: 'The selected rows with only the visible columns have been exported as a JSON file.',
    },
};

// Copy as CSV Action
export const copyAsCsvAction = {
    action: 'Copy as CSV',
    actionFunction: copyRowsAsCsvToClipboard,
    notice: {
        title: 'Rows Copied as CSV',
        content: 'The selected rows have been copied to your clipboard as comma-separated values (CSV).',
    },
};

// Copy as CSV (Visible Columns Only) Action
export const copyAsCsvVisibleColumnsOnly = {
    action: 'Copy as CSV (Visible Columns Only)',
    actionFunction: copyRowsAsCsvToClipboardVisibleColumns,
    notice: {
        title: 'Rows Copied as CSV',
        content:
            'The selected rows with only the visible columns have been copied to your clipboard as comma-separated values (CSV).',
    },
};

// Export as CSV Action
export const exportAsCsvAction = {
    action: 'Export as CSV',
    actionFunction: exportRowsAsCsvFile,
    notice: {
        title: 'Rows Exported as CSV',
        content: 'The selected rows have been exported as a CSV file.',
    },
};

// Export as CSV (Visible Columns Only) Action
export const exportAsCsvVisibleColumnsOnlyAction = {
    action: 'Export as CSV (Visible Columns Only)',
    actionFunction: exportRowsAsCsvFileVisibleColumnsOnly,
    notice: {
        title: 'Rows Exported as CSV',
        content: 'The selected rows with only the visible columns have been exported as a CSV file.',
    },
};

// Default Table Rows Actions
export const defaultTableRowsActions = [
    copyAsJsonAction,
    copyAsJsonVisibleColumnsOnlyAction,
    exportAsJsonAction,
    exportAsJsonVisibleColumnsOnlyAction,
    copyAsCsvAction,
    copyAsCsvVisibleColumnsOnly,
    exportAsCsvAction,
    exportAsCsvVisibleColumnsOnlyAction,
];

// Function to convert rows into an object
function convertRowsIntoObject(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
    onlyVisibleColumns: boolean = false,
) {
    // console.log('rows', rows);
    // console.log('columns', columns);
    // console.log('onlyVisibleColumns', onlyVisibleColumns);

    // Get the visible columns
    const columnsForJson = columns.filter(function (column) {
        return onlyVisibleColumns ? !column.hidden : true;
    });

    // Loop over all of the rows
    let rowsForJson = rows.map(function (row) {
        // Loop over all of the cells in the row
        let cellsForJson = row.cells
            // Filter out the cells that are for hidden columns
            .filter(function (cell, cellIndex) {
                return onlyVisibleColumns ? !columns[cellIndex]?.hidden : true;
            })
            .map(function (cell, cellIndex) {
                // Return the cell as a key value pair
                return {
                    [columnsForJson[cellIndex]?.identifier || '']: cell.value,
                };
            });
        return Object.assign({}, ...cellsForJson);
    });

    return rowsForJson;
}

// Function to convert rows into comma-separated values
function convertRowsIntoCsv(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
    onlyVisibleColumns: boolean = false,
) {
    let csv = '';
    const rowsObject = convertRowsIntoObject(rows, columns, onlyVisibleColumns);
    const firstRow = rowsObject[0];

    // If there is a first row
    if(firstRow) {
        csv += Object.keys(firstRow).join(',') + '\n';

        // Loop over all of the rows
        rowsObject.forEach(function (row) {
            csv +=
                Object.values(row)
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(',') + '\n';
        });
    }

    return csv;
}

// Function to download a file
function downloadFile(fileName: string, content: string, contentType: string) {
    let blob = new Blob([content], { type: contentType });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

// Function to copy rows as JSON to clipboard
export async function copyRowsAsJsonToClipboard(rows: TableRowInterface[], columns: TableColumnInterface[]) {
    let json = JSON.stringify(convertRowsIntoObject(rows, columns), null, 4);
    console.log('json', json);
    await navigator.clipboard.writeText(json);
}

// Function to copy rows as JSON to clipboard (visible columns only)
export async function copyRowsAsJsonToClipboardVisibleColumns(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
) {
    let json = JSON.stringify(convertRowsIntoObject(rows, columns, true), null, 4);
    console.log('json', json);
    await navigator.clipboard.writeText(json);
}

// Function to export rows as JSON file
export async function exportRowsAsJsonFile(rows: TableRowInterface[], columns: TableColumnInterface[]) {
    let json = JSON.stringify(convertRowsIntoObject(rows, columns), null, 4);
    console.log('json', json);
    downloadFile('rows.json', json, 'application/json');
}

// Function to export rows as JSON file (visible columns only)
export async function exportRowsAsJsonFileVisibleColumnsOnly(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
) {
    let json = JSON.stringify(convertRowsIntoObject(rows, columns, true), null, 4);
    console.log('json', json);
    downloadFile('rows.json', json, 'application/json');
}

// Function to copy rows as CSV to clipboard
export async function copyRowsAsCsvToClipboard(rows: TableRowInterface[], columns: TableColumnInterface[]) {
    let csv = convertRowsIntoCsv(rows, columns);
    console.log('csv', csv);
    await navigator.clipboard.writeText(csv);
}

// Function to copy rows as CSV to clipboard (visible columns only)
export async function copyRowsAsCsvToClipboardVisibleColumns(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
) {
    let csv = convertRowsIntoCsv(rows, columns, true);
    console.log('csv', csv);
    await navigator.clipboard.writeText(csv);
}

// Function to export rows as CSV file
export async function exportRowsAsCsvFile(rows: TableRowInterface[], columns: TableColumnInterface[]) {
    let csv = convertRowsIntoCsv(rows, columns);
    console.log('csv', csv);
    downloadFile('rows.csv', csv, 'text/csv');
}

// Function to export rows as CSV file (visible columns only)
export async function exportRowsAsCsvFileVisibleColumnsOnly(
    rows: TableRowInterface[],
    columns: TableColumnInterface[],
) {
    let csv = convertRowsIntoCsv(rows, columns, true);
    console.log('csv', csv);
    downloadFile('rows.csv', csv, 'text/csv');
}
