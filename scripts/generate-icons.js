// This script will recurively read these folders:
// - assets/icons
// - libraries/structure/assets/icons/
// It will then create assets/icons/Icons.ts

// Dependencies - Node
const fs = require('fs');
const path = require('path');

// An array to store the icons
const icons = [];

// Recursively read the icons directory
function readIcons(directory, source) {
    // Read the directory
    const filesAndDirs = fs.readdirSync(directory);

    // Loop through the files and directories
    filesAndDirs.forEach(function (item) {
        // Get the full path
        const fullPath = path.join(directory, item);

        // Get the stats
        const stat = fs.statSync(fullPath);

        // Check if it's a directory
        if(stat.isDirectory()) {
            // Continue searching in this directory
            readIcons(fullPath, source);
        }
        // Check if it's a file
        else {
            const directoryName = path.dirname(fullPath);
            if(item.endsWith('.svg')) {
                // File in the project are imported using @project/assets/icons
                // Files in structure are imported using @structure/assets/icons
                let importPath = source === 'Project' ? '@project/assets/icons' : '@structure/assets/icons';
                importPath += directoryName.replace(/^.*assets\/icons/, '') + '/' + item;
                // console.log('importPath', importPath);

                let category = directory.replace(/^.*assets\/icons\//, '');
                category = category.charAt(0).toUpperCase() + category.slice(1);

                // Get the viewbox from the SVG
                let svgContent = fs.readFileSync(fullPath, 'utf8');
                // console.log('svgContent', svgContent);

                let viewBox = svgContent
                    .toLowerCase().match(/viewbox="([^"]*)"/)[1];
                // console.log('viewBox', viewBox);

                let validIcon = true;
                if(viewBox !== '0 0 100 100') {
                    validIcon = false;
                }

                const icon = {
                    name: item.replace('.svg', ''),
                    importPath: importPath,
                    path: fullPath,
                    category: category,
                    source: source,
                    valid: validIcon,
                };
                icons.push(icon);
            }
        }
    });
}

const scriptPath = path.dirname(__filename);
// console.log('Script path:', scriptPath);

const projectIconsPath = path.join(scriptPath, '../../../assets/icons');
console.log('Project icons path:', projectIconsPath);

const structureIconsPath = path.join(scriptPath, '../assets/icons');
console.log('Structure icons path:', structureIconsPath);

// Read the icons from the project
readIcons(projectIconsPath, 'Project');

// Read the icons from structure
readIcons(structureIconsPath, 'Structure');

console.log('Found icons:', icons.length);

// Generate the Icons.ts file
let iconsTsContent = '';

iconsTsContent += '// Dependencies - Assets\n';

// Loop over icons and add the imports
icons.forEach(function (icon) {
    iconsTsContent += `import ${icon.source}${icon.category}${icon.name} from '${icon.importPath}';\n`;
});
iconsTsContent += '\n';

// Add the interface
iconsTsContent += '// Interface - IconInterface\n';
iconsTsContent += `export interface IconInterface {
    name: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    importPath: string;
    category: string;
    source: 'Project' | 'Structure';
    valid: boolean;
}`;

// Loop over icons 
iconsTsContent += '\n';
iconsTsContent += '// Icons\n';
iconsTsContent += 'export const Icons: IconInterface[] = [\n';
icons.forEach(function (icon) {
    iconsTsContent += `    {
        name: '${icon.name}',
        icon: ${icon.source}${icon.category}${icon.name},
        importPath: '${icon.importPath}',
        category: '${icon.category}',
        source: '${icon.source}',
        valid: ${icon.valid},
    },\n`;
});
iconsTsContent += '];\n';

// Export
iconsTsContent += '\n';
iconsTsContent += '// Export - Default\n';
iconsTsContent += 'export default Icons;\n';

// Create the path for the Icons.ts file
const projectIconsTsPath = path.join(projectIconsPath, 'Icons.ts');
console.log('projectIconsTsPath', projectIconsTsPath);

// Write the file
fs.writeFileSync(projectIconsTsPath, iconsTsContent);

console.log('Icons.ts generated successfully');
