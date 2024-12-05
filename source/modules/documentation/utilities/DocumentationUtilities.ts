// Dependencies - Types
import {
    DocumentationSpecificationInterface,
    DocumentationNodeInterface,
    DocumentationNodeWithParentInterface,
    SectionNodeInterface,
} from '@structure/source/modules/documentation/types/DocumentationTypes';
import { SideNavigationItemInterface } from '@structure/source/common/navigation/side-navigation/SideNavigationItem';
import { SideNavigationSectionInterface } from '@structure/source/common/navigation/side-navigation/SideNavigationSection';

// Function to find a documentation node by URL path
export function findDocumentationNodeByUrlPath(
    nodes: DocumentationNodeInterface[],
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

        // Check if current node matches path
        if(node.href === normalizedUrlPath) {
            return nodeWithParent;
        }

        // If node is a section and has children, search them recursively
        if(node.type === 'Section') {
            const sectionNode = node as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                const foundInChildren = findDocumentationNodeByUrlPath(sectionNode.children, urlPath, nodeWithParent);
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
    function processNode(node: DocumentationNodeInterface): SideNavigationItemInterface {
        const sideNavigationSection: SideNavigationSectionInterface = {
            title: node.title,
            href: node.href,
            isHeader: node.isHeader,
            icon: node.icon,
        };

        // If the node is a section and has children, process them recursively
        if(node.type === 'Section') {
            const sectionNode = node as SectionNodeInterface;
            if(sectionNode.children && sectionNode.children.length > 0) {
                sideNavigationSection.children = sectionNode.children.map(processNode);
            }
        }

        return sideNavigationSection;
    }

    // Process the top-level nodes
    return documentationSpecification.nodes.map(processNode);
}
