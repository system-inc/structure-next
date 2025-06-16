// Icon interface
export interface IconInterface {
    source: string;
    category: string;
    name: string;
    component: React.ComponentType;
}

// Placeholder Icons array - this should be populated with actual icon data
export const Icons: IconInterface[] = [];

// TODO: Generate this file automatically from the SVG files in the icons directory