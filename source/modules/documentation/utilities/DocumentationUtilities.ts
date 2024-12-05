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
    nodes: DocumentationNodeInterface[],
    baseUrlPath: string,
    urlPath: string,
    parent: DocumentationNodeWithParentInterface | null = null,
): DocumentationNodeWithParentInterface | null {
    // Base case - no nodes
    if(!nodes || nodes.length === 0) {
        return null;
    }

    // Normalize URL path (remove trailing slash)
    const normalizedUrlPath = urlPath.replace(/\/$/, '');

    // Search through each node
    for(const node of nodes) {
        // Create node with parent
        const nodeWithParent: DocumentationNodeWithParentInterface = {
            ...node,
            parent: parent,
        };

        // Build href by getting path from root to current node
        const pathParts = buildPathFromNode(nodeWithParent);
        const href = baseUrlPath + '/' + pathParts.join('/');
        // console.log('href', href);

        // Check if current node matches path
        if(href === normalizedUrlPath) {
            return nodeWithParent;
        }

        // If node is a section and has children, search them recursively
        if(node.type === 'Section') {
            const sectionNode = node as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                const foundInChildren = findDocumentationNodeByUrlPath(
                    sectionNode.children,
                    baseUrlPath,
                    urlPath,
                    nodeWithParent,
                );
                if(foundInChildren) {
                    return foundInChildren;
                }
            }
        }
    }

    return null;
}

// Function to generate SideNavigationSections from a DocumentationSpecification
export function getSideNavigationSectionsFromDocumentationSpecification(
    documentationSpecification: DocumentationSpecificationInterface,
): SideNavigationSectionInterface[] {
    // Helper function to process nodes recursively
    function processNode(
        node: DocumentationNodeInterface,
        parent: DocumentationNodeWithParentInterface | null = null,
    ): SideNavigationItemInterface {
        // Create node with parent for path building
        const nodeWithParent: DocumentationNodeWithParentInterface = {
            ...node,
            parent: parent,
        };

        // Build href by getting path from root to current node
        const pathParts = buildPathFromNode(nodeWithParent);
        const href = documentationSpecification.baseUrlPath + '/' + pathParts.join('/');

        const sideNavigationSection: SideNavigationSectionInterface = {
            title: node.title,
            href: href,
            isHeader: node.isHeader,
            icon: node.icon,
        };

        // If the node is a section and has children, process them recursively
        if(node.type === 'Section') {
            const sectionNode = node as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                sideNavigationSection.children = sectionNode.children.map(function (child) {
                    return processNode(child, nodeWithParent);
                });
            }
        }

        return sideNavigationSection;
    }

    // Process the top-level nodes
    return documentationSpecification.nodes.map(function (node) {
        return processNode(node, null);
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
    const node = findDocumentationNodeByUrlPath(
        documentationSpecification.nodes,
        documentationSpecification.baseUrlPath,
        currentUrlPath,
    );

    // Build title with parent categories
    let title = rootTitle;
    if(node) {
        let currentCategory: DocumentationNodeWithParentInterface | null = node;
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
