// Interface - TableColumnPossibleValueInterface
export interface TableColumnPossibleValueProperties {
    value: string;
    title?: string;
    hexColor?: string;
}

// Type - TableColumnType
export enum TableColumnType {
    String = 'String',
    Number = 'Number',
    Url = 'Url',
    Id = 'Id',
    Option = 'Option',
    ImageUrl = 'ImageUrl',
    DateTime = 'DateTime',
    Boolean = 'Boolean',
    Html = 'Html',
}

// Interface - TableColumn
export interface TableColumnProperties {
    identifier: string;
    title: string;
    description?: string;
    possibleValues?: TableColumnPossibleValueProperties[];
    type?: TableColumnType;
    sortable?: boolean;
    hidden?: boolean;
    meta?: unknown;
}

// Function to infer the table column type from the identifier or data
export function inferTableColumnType(identifier: string, data?: string | number): TableColumnType {
    // Default to string
    let tableColumnType = TableColumnType.String;

    // If the identifier ends with 'Id', it is an ID
    if(identifier.toLowerCase() == 'id' || identifier.endsWith('Id')) {
        tableColumnType = TableColumnType.Id;
    }
    // If the data is a boolean, it is a boolean
    else if(typeof data === 'boolean') {
        tableColumnType = TableColumnType.Boolean;
    }
    // If the data is a number, it is a number
    else if(typeof data === 'number') {
        tableColumnType = TableColumnType.Number;
    }
    // If the data is a string, it could be a URL
    else if(typeof data === 'string') {
        // URLs
        if(data.startsWith('http')) {
            tableColumnType = TableColumnType.Url;
        }
        // DateTime (e.g., 2024-01-04T07:50:08.000Z)
        else if(data.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
            tableColumnType = TableColumnType.DateTime;
        }
    }

    return tableColumnType;
}
