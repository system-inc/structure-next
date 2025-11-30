// Primitives that should stop recursion
type PrimitiveType = string | number | boolean | Date | RegExp | null | undefined;

/**
 * Recursively generates dotted paths for an object type.
 * Used for type-safe field name references in forms.
 *
 * @example
 * type Variables = { id: string; input: { title: string; slug: string } }
 * type Paths = DotPathType<Variables>;
 * // Result: 'id' | 'input' | 'input.title' | 'input.slug'
 */
export type DotPathType<T> = T extends object
    ? {
          [K in keyof T & (string | number)]: T[K] extends Array<unknown>
              ? `${K}` // Stop recursion at arrays
              : T[K] extends PrimitiveType
                ? `${K}` // Terminal node (primitive value)
                : `${K}` | `${K}.${DotPathType<NonNullable<T[K]>>}`; // Object node: include key and recurse
      }[keyof T & (string | number)]
    : never;

/**
 * Extracts the value type at a given dotted path within an object type.
 *
 * @example
 * type Variables = { id: string; input: { title: string; count: number } }
 * type TitleType = ValueAtPathType<Variables, 'input.title'>; // string
 * type CountType = ValueAtPathType<Variables, 'input.count'>; // number
 */
export type ValueAtPathType<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? ValueAtPathType<NonNullable<T[Key]>, Rest>
        : never
    : Path extends keyof T
      ? T[Path]
      : never;

/**
 * Creates a mapped type where keys are dotted paths and values are the corresponding types.
 * Used for type-safe field value assignments in forms.
 *
 * @example
 * type Variables = { id: string; input: { title: string; count: number } }
 * type Values = DotPathValuesType<Variables>;
 * // Result: { 'id'?: string; 'input'?: { title: string; count: number }; 'input.title'?: string; 'input.count'?: number }
 */
export type DotPathValuesType<T> = {
    [K in DotPathType<T>]?: ValueAtPathType<T, K>;
};
