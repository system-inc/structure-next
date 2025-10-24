import fs from 'fs';
import path from 'path';

/**
 * Recursively get all ops routes that contain a layout.tsx or page.tsx.
 * @param {string} dir - Directory path to search.
 * @param {string[]} routeList - Accumulated routes.
 * @return {string[]} List of routes.
 */
function getAllOpsRoutes(dir, routeList = []) {
    const filesAndDirs = fs.readdirSync(dir);

    filesAndDirs.forEach(function (item) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if(stat.isDirectory()) {
            // Continue searching in this directory
            getAllOpsRoutes(fullPath, routeList);
        }
        else {
            const dirName = path.dirname(fullPath);
            // Check if the directory contains layout.tsx or page.tsx
            if(item === 'layout.tsx' || item === 'page.tsx') {
                if(!routeList.includes(dirName)) {
                    // Convert file path to route
                    const route = dirName.replace(/^libraries\/structure\/app\/ops\//, '');
                    routeList.push(route);
                }
            }
        }
    });

    return routeList;
}

// const filePaths = getAllFilePaths();
const routes = getAllOpsRoutes('../libraries/structure/app/ops');
// console.log(routes);

routes.forEach(function (route) {
    // We need to replace
    // "../libraries/structure/app/ops/analytics/live"
    // to
    // "@structure/source/ops/pages/analytics/live"
    // So, let's replace everything up to the first instance of 'app/ops' with '@structure/app/ops'
    let structureImportPath = route.replace(/^.*app\/ops/, '@structure/app/ops');
    structureImportPath = structureImportPath + '/page';
    // console.log('structureImportPath', structureImportPath);

    // appOpsPageDirectory needs to be an absolute path to the directory at ../app/ops/*
    let appOpsPageDirectory = route.replace('libraries/structure/', '');
    appOpsPageDirectory = path.join(__dirname, appOpsPageDirectory);
    console.log('appOpsPageDirectory', appOpsPageDirectory);

    const content = `// Shim the default export from Structure
export * from '${structureImportPath}';
export { default } from '${structureImportPath}';
`;
    console.log('content', content);

    fs.mkdirSync(appOpsPageDirectory, { recursive: true });
    fs.writeFileSync(path.join(appOpsPageDirectory, 'page.tsx'), content);
});
