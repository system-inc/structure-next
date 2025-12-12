// Interface - HastNode represents a node in the HAST (Hypertext Abstract Syntax Tree)
interface HastNode {
    type: string;
    tagName?: string;
    properties?: { id?: string; href?: string; node?: unknown; className?: string[]; 'data-faq-title'?: string };
    children?: HastNode[];
    value?: string;
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

// Helper to get text content from a node
function getNodeText(node: HastNode): string {
    if(node.value) return node.value;
    if(node.children) {
        return node.children.map(getNodeText).join('');
    }
    return '';
}

// Custom rehype plugin to transform FAQ sections into accordion-friendly structure
// Detects "## Frequently Asked Questions..." followed by "### Question" patterns
// Wraps them in a <div data-faq-section> with each Q&A in <div data-faq-item>
export function rehypeFaqAccordion() {
    return function (tree: HastNode) {
        if(!tree.children) return;

        const newChildren: HastNode[] = [];
        let i = 0;

        while(i < tree.children.length) {
            const node = tree.children[i];

            // Check if this is an h2 with "Frequently Asked Questions" text
            if(node?.type === 'element' && node.tagName === 'h2') {
                const text = getNodeText(node);
                if(text.toLowerCase().includes('frequently asked questions')) {
                    // Found FAQ section - collect all h3 Q&A pairs until next h2 or end
                    const faqTitle = text;
                    const faqItems: HastNode[] = [];
                    i++; // Move past the h2

                    while(i < tree.children.length) {
                        const current = tree.children[i];

                        // Stop if we hit another h2 (new section)
                        if(current?.type === 'element' && current.tagName === 'h2') {
                            break;
                        }

                        // If it's an h3, start collecting a Q&A item
                        if(current?.type === 'element' && current.tagName === 'h3') {
                            const question = getNodeText(current);
                            const answerNodes: HastNode[] = [];
                            i++; // Move past the h3

                            // Collect all nodes until next h3 or h2 as the answer
                            while(i < tree.children.length) {
                                const answerNode = tree.children[i];
                                if(
                                    answerNode?.type === 'element' &&
                                    (answerNode.tagName === 'h2' || answerNode.tagName === 'h3')
                                ) {
                                    break;
                                }
                                if(answerNode) {
                                    answerNodes.push(answerNode);
                                }
                                i++;
                            }

                            // Create the FAQ item wrapper
                            faqItems.push({
                                type: 'element',
                                tagName: 'div',
                                properties: {
                                    className: ['faq-item'],
                                    'data-faq-title': question,
                                },
                                children: answerNodes,
                            });
                        }
                        else {
                            // Non-h3 content before first question (skip or include)
                            i++;
                        }
                    }

                    // Create the FAQ section wrapper
                    newChildren.push({
                        type: 'element',
                        tagName: 'div',
                        properties: {
                            className: ['faq-section'],
                            'data-faq-title': faqTitle,
                        },
                        children: faqItems,
                    });

                    continue; // Don't increment i again, we're already positioned
                }
            }

            // Not an FAQ section, keep the node as-is
            if(node) {
                newChildren.push(node);
            }
            i++;
        }

        tree.children = newChildren;
    };
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
