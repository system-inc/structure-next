/**
 * WebSocketSharedWorker Build Script
 * 
 * This script compiles the TypeScript files for the WebSocket SharedWorker
 * and generates a single JavaScript file that can be used as a SharedWorker.
 * 
 * Add this script to your package.json scripts section:
 * "build:websocketsharedworker": "node libraries/structure/source/api/web-sockets/shared-worker/scripts/BuildWebSocketSharedWorker.mjs"
 * 
 * Then use `npm run build:websocketsharedworker` to run the script.
 */

// Dependencies - Node
import NodeFileSystem from 'fs';
import NodePath from 'path';
import esbuild from 'esbuild';

// Variables
const currentDirectory = process.cwd();
const rootDirectory = NodePath.resolve(currentDirectory, 'libraries/structure');
const sharedWorkerDirectory = NodePath.resolve(rootDirectory, 'source/api/web-sockets/shared-worker');
const entryPoint = NodePath.resolve(sharedWorkerDirectory, 'WebSocketSharedWorker.ts');
const outputDirectory = NodePath.resolve(sharedWorkerDirectory, 'generated');
const outputFile = NodePath.resolve(outputDirectory, 'WebSocketSharedWorker.code.js');

// Function to ensure a directory exists
function ensureDirectoryExists(dir) {
    if(!NodeFileSystem.existsSync(dir)) {
        NodeFileSystem.mkdirSync(dir, { recursive: true });
    }
}

// Function to create a self-executing function wrapper for the SharedWorker
function createSharedWorkerWrapper(codeString) {
    const buildTimestamp = new Date().toISOString();

    return `// WebSocketSharedWorker Build Time: ${buildTimestamp}

${codeString}`;
}

// Function to build the WebSocketSharedWorker
async function buildWebSocketSharedWorker() {
    console.log('Building WebSocketSharedWorker...');

    try {
        // Ensure the output directory exists
        ensureDirectoryExists(outputDirectory);

        // Build using esbuild
        const result = await esbuild.build({
            entryPoints: [entryPoint],
            bundle: true,
            write: false, // Don't write to file, we'll do it with our wrapper
            format: 'iife', // Immediately-invoked function expression
            target: 'es2018', // Target ES2018 for good browser compatibility
            minify: true, // Minify for smaller file size
            treeShaking: true, // Enable tree shaking to eliminate dead code
            platform: 'browser',
            // Protect specific globals from being renamed or optimized away
            // This ensures SharedWorker-specific globals like 'self' are preserved
            keepNames: true,
            // Mark specific global variables as external to prevent minification issues
            external: ['self'],
            // Replace '@structure/' imports with relative paths
            plugins: [
                {
                    name: 'resolve-structure-imports',
                    setup(build) {
                        build.onResolve({ filter: /^@structure\// }, args => {
                            // console.log(`Resolving import: ${args.path}`);
                            const importPath = args.path.replace('@structure/', '');
                            // Handle paths like '@structure/source/api/...' by resolving to the full path
                            const fullPath = NodePath.resolve(rootDirectory, importPath);

                            // Add .ts extension if it doesn't have one and isn't a directory
                            let resolvedPath = fullPath;
                            if(!NodeFileSystem.existsSync(resolvedPath) && !resolvedPath.endsWith('.ts')) {
                                resolvedPath = `${resolvedPath}.ts`;
                            }

                            // console.log(`Resolved to: ${resolvedPath}`);
                            return { path: resolvedPath };
                        });
                    },
                },
            ],
        });

        // If there are any errors during the build, log them and throw an error
        if(result.errors.length > 0) {
            console.error('Build errors:', result.errors);
            throw new Error('esbuild failed');
        }

        // Get the bundled code
        const bundledCode = result.outputFiles[0].text;

        // Wrap the bundled code
        const finalCode = createSharedWorkerWrapper(bundledCode);

        // Write to output file
        NodeFileSystem.writeFileSync(outputFile, finalCode, 'utf8');

        console.log(`WebSocket SharedWorker built successfully: ${outputFile}`);
    } catch(error) {
        console.error('Error building WebSocket SharedWorker:', error);
        process.exit(1);
    }
}

// Run the build process
buildWebSocketSharedWorker().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
