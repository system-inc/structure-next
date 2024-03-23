const fs = require('fs');
const path = require('path');

/**
 * Recursively get all internal routes that contain a layout.tsx or page.tsx.
 * @param {string} dir - Directory path to search.
 * @param {string[]} routeList - Accumulated routes.
 * @return {string[]} List of routes.
 */
function getAllInternalRoutes(dir, routeList = []) {
    const filesAndDirs = fs.readdirSync(dir);

    filesAndDirs.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if(stat.isDirectory()) {
            // Continue searching in this directory
            getAllInternalRoutes(fullPath, routeList);
        } else {
            const dirName = path.dirname(fullPath);
            // Check if the directory contains layout.tsx or page.tsx
            if(item === 'layout.tsx' || item === 'page.tsx') {
                if(!routeList.includes(dirName)) {
                    // Convert file path to route
                    const route = dirName.replace(/^libraries\/structure\/app\/internal\//, '');
                    routeList.push(route);
                }
            }
        }
    });

    return routeList;
}

// const filePaths = getAllFilePaths();
const routes = getAllInternalRoutes('../libraries/structure/app/internal');
// console.log(routes);

routes.forEach(route => {
    // We need to replace 
    // "../libraries/structure/app/internal/analytics/live"
    // to
    // "@structure/source/internal/pages/analytics/live"
    // So, let's replace everything up to the first instance of 'app/internal' with '@structure/app/internal'
    let structureImportPath = route.replace(/^.*app\/internal/, '@structure/app/internal');
    structureImportPath = structureImportPath + '/page';
    // console.log('structureImportPath', structureImportPath);

    // appInternalPageDirectory needs to be an absolute path to the directory at ../app/internal/*
    let appInternalPageDirectory = route.replace('libraries/structure/', '');
    appInternalPageDirectory = path.join(__dirname, appInternalPageDirectory);
    console.log('appInternalPageDirectory', appInternalPageDirectory);

    const content = `// Shim the default export from Structure
export * from '${structureImportPath}';
export { default } from '${structureImportPath}';
`;
    console.log('content', content);

    fs.mkdirSync(appInternalPageDirectory, { recursive: true });
    fs.writeFileSync(path.join(appInternalPageDirectory, 'page.tsx'), content);
});
