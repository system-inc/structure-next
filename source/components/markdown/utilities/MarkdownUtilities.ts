// Interface - HastNode represents a node in the HAST (Hypertext Abstract Syntax Tree)
interface HastNode {
    type: string;
    properties?: { id?: string; href?: string; node?: unknown };
    children?: HastNode[];
}

// Function to recursively visit all nodes in the HAST tree
function visitNodes(node: HastNode, callback: (node: HastNode) => void) {
    callback(node);
    if(node.children) {
        node.children.forEach(function (child) {
            visitNodes(child, callback);
        });
    }
}

// Custom rehype plugin to transform footnote IDs and clean up AST nodes
// Transforms:
//   - citation-fn-1 → citation-1 (footnote definition at bottom)
//   - citation-fnref-1 → citation-1-link (inline superscript link)
export function rehypeCustomFootnoteIds() {
    return function (tree: HastNode) {
        visitNodes(tree, function (node) {
            if(node.type !== 'element' || !node.properties) return;

            // Transform footnote definition IDs (citation-fn-X → citation-X)
            if(typeof node.properties.id === 'string') {
                const fnMatch = node.properties.id.match(/^citation-fn-(\d+)$/);
                if(fnMatch) {
                    node.properties.id = `citation-${fnMatch[1]}`;
                }

                // Transform footnote reference IDs (citation-fnref-X → citation-X-link)
                const fnrefMatch = node.properties.id.match(/^citation-fnref-(\d+)$/);
                if(fnrefMatch) {
                    node.properties.id = `citation-${fnrefMatch[1]}-link`;
                }
            }

            // Transform hrefs to match new ID format
            if(typeof node.properties.href === 'string') {
                // Update links to footnote definitions (#citation-fn-X → #citation-X)
                const fnHrefMatch = node.properties.href.match(/^#citation-fn-(\d+)$/);
                if(fnHrefMatch) {
                    node.properties.href = `#citation-${fnHrefMatch[1]}`;
                }

                // Update back-links to references (#citation-fnref-X → #citation-X-link)
                const fnrefHrefMatch = node.properties.href.match(/^#citation-fnref-(\d+)$/);
                if(fnrefHrefMatch) {
                    node.properties.href = `#citation-${fnrefHrefMatch[1]}-link`;
                }
            }
        });
    };
}
