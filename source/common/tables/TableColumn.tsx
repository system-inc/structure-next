// Dependencies - React and Next.js
import React from 'react';

// Interface - TableColumnPossibleValueInterface
export interface TableColumnPossibleValueInterface {
    value: string;
    title?: string;
    hexColor?: string;
}

// Interface - TableColumn
export interface TableColumnInterface {
    identifier: string;
    title: string;
    description?: string;
    possibleValues?: TableColumnPossibleValueInterface[];
    type?: 'id' | 'option' | 'imageUrl' | 'dateTime' | 'boolean' | 'html';
    sortable?: boolean;
    hidden?: boolean;
    meta?: any;
}
