// Dependencies - Types
import { DocumentationSpecificationCategoryInterface } from '@structure/source/modules/documentation/types/DocumentationSpecificationInterface';

// Type - DocumentationSpecificationCategoryWithParent
export interface DocumentationSpecificationCategoryWithParentInterface
    extends DocumentationSpecificationCategoryInterface {
    parent: DocumentationSpecificationCategoryWithParentInterface | null;
}

// Function to find a documentation specification category by URL path
export function findDocumentationSpecificationCategoryByUrlPath(
    categories: DocumentationSpecificationCategoryInterface[],
    urlPath: string,
    parent?: DocumentationSpecificationCategoryWithParentInterface | null,
): DocumentationSpecificationCategoryWithParentInterface | null {
    // Base case - no categories
    if(!categories || categories.length === 0) {
        return null;
    }

    // Search through each category
    for(const category of categories) {
        // Add parent reference to current category
        const categoryWithParent: DocumentationSpecificationCategoryWithParentInterface = {
            ...category,
            parent: parent ?? null,
        };

        // Check if current category matches path
        if(category.href === urlPath.replace(/\/$/, '')) {
            return categoryWithParent;
        }

        // If category has children, search them recursively
        if(category.children && category.children.length > 0) {
            const foundInChildren = findDocumentationSpecificationCategoryByUrlPath(
                category.children,
                urlPath,
                categoryWithParent,
            );
            if(foundInChildren) {
                return foundInChildren;
            }
        }
    }

    return null;
}
