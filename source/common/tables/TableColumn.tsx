// Dependencies - React and Next.js
import React from 'react';

// Interface - TableColumnPossibleValueInterface
export interface TableColumnPossibleValueInterface {
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
export interface TableColumnInterface {
    identifier: string;
    title: string;
    description?: string;
    possibleValues?: TableColumnPossibleValueInterface[];
    type?: TableColumnType;
    sortable?: boolean;
    hidden?: boolean;
    meta?: any;
}
