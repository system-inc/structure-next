// Dependencies - Utilities
import { DotPathType, DotPathValuesType } from '@structure/source/utilities/type/DotPath';
import type { VariablesOf } from '@graphql-typed-document-node/core';

/**
 * Extracts field paths from a GraphQL document's variables type.
 * Used for type-safe field name references in GraphQL forms.
 *
 * @example
 * // For PostUpdateDocument with variables { id: string; input: { title: string; slug: string } }
 * type Paths = DocumentFieldPathsType<typeof PostUpdateDocument>;
 * // Result: 'id' | 'input' | 'input.title' | 'input.slug'
 */
export type DocumentFieldPathsType<TDocument> = DotPathType<VariablesOf<TDocument>>;

/**
 * Creates a mapped type of field paths to their corresponding value types.
 * Used for type-safe field value assignments in GraphQL forms.
 *
 * @example
 * // For PostUpdateDocument with variables { id: string; input: { title: string; slug: string } }
 * type Values = DocumentFieldValuesType<typeof PostUpdateDocument>;
 * // Result: { 'id'?: string; 'input.title'?: string; 'input.slug'?: string; ... }
 */
export type DocumentFieldValuesType<TDocument> = DotPathValuesType<VariablesOf<TDocument>>;

/**
 * Type-safe linked field configuration for GraphQL forms.
 * Constrains sourceField and targetField to valid field paths from the document's variables type.
 *
 * @example
 * // For PostUpdateDocument, both fields must be valid paths like 'input.title' or 'input.slug'
 * const config: LinkedFieldConfigurationInterface<typeof PostUpdateDocument> = {
 *     sourceField: 'input.title',
 *     targetField: 'input.slug',
 *     transform: slug,
 * };
 */
export interface LinkedFieldConfigurationInterface<TDocument> {
    sourceField: DocumentFieldPathsType<TDocument>;
    targetField: DocumentFieldPathsType<TDocument>;
    transform: (value: string) => string;
}
