// Dependencies - Types
import {
    DocumentationSpecificationInterface,
    DocumentationNodeInterface,
    DocumentationNodeWithParentInterface,
    SectionNodeInterface,
} from '@structure/source/modules/documentation/types/DocumentationTypes';
import { SideNavigationItemInterface } from '@structure/source/common/navigation/side-navigation/SideNavigationItem';
import { SideNavigationSectionInterface } from '@structure/source/common/navigation/side-navigation/SideNavigationSection';

// Function to build path from node to root
export function buildPathFromNode(node: DocumentationNodeWithParentInterface): string[] {
    const parts: string[] = [];
    let current: DocumentationNodeWithParentInterface | null = node;

    // Traverse up to root, collecting identifiers
    while(current) {
        if(current.identifier) {
            parts.unshift(current.identifier);
        }
        current = current.parent;
    }

    return parts;
}

// Function to find a documentation node by URL path
export function findDocumentationNodeByUrlPath(
    documentationNodes: DocumentationNodeInterface[],
    baseUrlPath: string,
    urlPath: string,
    parent: DocumentationNodeWithParentInterface | null = null,
): DocumentationNodeWithParentInterface | null {
    let foundDocumentationNode: DocumentationNodeWithParentInterface | null = null;

    // Normalize URL path (remove trailing slash)
    const normalizedUrlPath = urlPath.replace(/\/$/, '');

    // Search through each node
    for(const documentationNode of documentationNodes) {
        // Create node with parent
        const documentationNodeWithParent: DocumentationNodeWithParentInterface = {
            ...documentationNode,
            parent: parent,
        };

        // Build href by getting path from root to current node
        const pathParts = buildPathFromNode(documentationNodeWithParent);
        const href = baseUrlPath + '/' + pathParts.join('/');
        // console.log('href', href);

        // Check if current node matches path
        if(href === normalizedUrlPath) {
            foundDocumentationNode = documentationNodeWithParent;
        }
        // If node is a section and has children, search them recursively
        else if(documentationNode.type === 'Section') {
            const sectionNode = documentationNode as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                const foundInChildren = findDocumentationNodeByUrlPath(
                    sectionNode.children,
                    baseUrlPath,
                    urlPath,
                    documentationNodeWithParent,
                );
                if(foundInChildren) {
                    foundDocumentationNode = foundInChildren;
                }
            }
        }
    }

    // If no node is found, and the urlPath is the baseUrlPath, use the first node which has content
    if(!foundDocumentationNode && normalizedUrlPath === baseUrlPath.replace(/\/$/, '')) {
        foundDocumentationNode = getFirstDocumentationNodeWithParentWithContent(documentationNodes);
    }

    return foundDocumentationNode;
}

// Function to get the first documentation node with content
export function getFirstDocumentationNodeWithParentWithContent(
    documentationNodes: DocumentationNodeInterface[],
    parent: DocumentationNodeWithParentInterface | null = null,
): DocumentationNodeWithParentInterface | null {
    let firstDocumentationNodeWithParentWithContent: DocumentationNodeWithParentInterface | null = null;

    // Search through each node
    for(const documentationNode of documentationNodes) {
        // If the node is a section and has children, search them recursively
        if(documentationNode.type === 'Section') {
            const sectionNode = documentationNode as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                const foundInChildren = getFirstDocumentationNodeWithParentWithContent(sectionNode.children, {
                    ...documentationNode,
                    parent: parent,
                });
                if(foundInChildren) {
                    firstDocumentationNodeWithParentWithContent = foundInChildren;
                    break;
                }
            }
        }
        // If the node is a MarkdownPage and has content, return it
        else if(documentationNode.type === 'MarkdownPage' && documentationNode.content) {
            firstDocumentationNodeWithParentWithContent = {
                ...documentationNode,
                parent: parent,
            };
            break;
        }
    }

    return firstDocumentationNodeWithParentWithContent;
}

// Function to generate SideNavigationSections from a DocumentationSpecification
export function getSideNavigationSectionsFromDocumentationSpecification(
    documentationSpecification: DocumentationSpecificationInterface,
): SideNavigationSectionInterface[] {
    let isFirstContentNode = true; // Track the first content node

    // Helper function to process nodes recursively
    function processDocumentationNode(
        documentationNode: DocumentationNodeInterface,
        parentDocumentationNode: DocumentationNodeWithParentInterface | null = null,
    ): SideNavigationItemInterface {
        // Create node with parent for path building
        const documentationNodeWithParent: DocumentationNodeWithParentInterface = {
            ...documentationNode,
            parent: parentDocumentationNode,
        };

        // Determine href
        let href: string;
        // If the node is the first content node, use the base URL path
        if(isFirstContentNode && !documentationNode.isHeader) {
            href = documentationSpecification.baseUrlPath;
            isFirstContentNode = false;
        }
        // Otherwise, build the path from the node
        else {
            const pathParts = buildPathFromNode(documentationNodeWithParent);
            href = documentationSpecification.baseUrlPath + '/' + pathParts.join('/');
        }

        const sideNavigationSection: SideNavigationSectionInterface = {
            title: documentationNode.title,
            href: href,
            isHeader: documentationNode.isHeader,
            icon: documentationNode.icon,
        };

        // If the node is a section and has children, process them recursively
        if(documentationNode.type === 'Section') {
            const sectionNode = documentationNode as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                sideNavigationSection.children = sectionNode.children.map(function (child) {
                    return processDocumentationNode(child, documentationNodeWithParent);
                });
            }
        }

        return sideNavigationSection;
    }

    // Process the top-level nodes
    return documentationSpecification.nodes.map(function (node) {
        return processDocumentationNode(node, null);
    });
}

// Function to generate a title based on the current URL path and documentation specification
export function getDocumentationHtmlTitle(
    documentationSpecification: DocumentationSpecificationInterface,
    currentUrlPath: string,
    rootTitle: string,
    separator = '•',
): string {
    // Find the node for the current URL path
    const documentationNode = findDocumentationNodeByUrlPath(
        documentationSpecification.nodes,
        documentationSpecification.baseUrlPath,
        currentUrlPath,
    );

    // Build title with parent categories
    let title = rootTitle;
    if(documentationNode) {
        let currentCategory: DocumentationNodeWithParentInterface | null = documentationNode;
        const titles = [];

        // Collect all titles starting from current category up to parents
        while(currentCategory) {
            if(currentCategory.title) {
                titles.push(currentCategory.title);
            }
            currentCategory = currentCategory.parent;
        }

        // Add titles to the page title if we have any
        if(titles.length > 0) {
            title = titles.join(' ' + separator + ' ') + ' • ' + title;
        }
    }

    return title;
}
