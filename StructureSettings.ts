// Dependencies
import ProjectSettings from '../../StructureSettings'; // Use relative path here for tailwind.config.js

// Types
interface ApiService {
    url: string;
}

interface AssetDetails {
    location: string;
}

interface ThemedAsset {
    light: AssetDetails;
    dark: AssetDetails;
}

interface LogoAsset extends ThemedAsset {
    width: number;
    height: number;
}

interface ServiceDetails {
    id: string;
}

interface Service {
    [key: string]: ServiceDetails;
}

interface Platform {
    title: string;
    url: string;
    type: string;
}

export interface StructureSettingsType {
    identifier: string;
    title: string;
    ownerDisplayName: string;
    tagline: string;
    description: string;
    url: string;
    assetsUrl: string;
    sourceCodeRepositoryUrls: {
        structure: string;
        project: string;
    };
    apis: {
        base: ApiService;
        [key: string]: ApiService;
    };
    theme?: {
        defaultClassName: string;
    };
    assets: {
        favicon: ThemedAsset;
        logo: LogoAsset;
    };
    services?: {
        [providerIdentifier: string]: Service;
    };
    platforms: {
        [platformIdentifier: string]: Platform;
    };
}

// Default Settings
let StructureSettings: StructureSettingsType = {
    identifier: 'system',
    title: 'Structure',
    ownerDisplayName: 'System, Inc.',
    tagline: 'React and Next.js Implementation for Base',
    description: 'A React and Next.js implementation for Base.',
    url: 'https://www.system.inc/',
    assetsUrl: 'https://assets.system.inc/',
    sourceCodeRepositoryUrls: {
        structure: 'https://github.com/system-inc/structure-next/',
        project: 'https://github.com/system-inc/structure-next-template/',
    },
    apis: {
        base: {
            url: 'https://api.system.inc/graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        },
    },
    theme: {
        defaultClassName: 'light',
    },
    assets: {
        favicon: {
            light: {
                location: '/images/icons/favicons/favicon-light.png',
            },
            dark: {
                location: '/images/icons/favicons/favicon-dark.png',
            },
        },
        logo: {
            light: {
                location: '/images/logos/logo-light.png',
            },
            dark: {
                location: '/images/logos/logo-dark.png',
            },
            width: 102,
            height: 37,
        },
    },
    services: {
        google: {
            analytics: {
                id: '',
            },
        },
    },
    platforms: {
        x: {
            title: 'X',
            url: 'https://x.com/systeminc',
            type: 'social',
        },
        instagram: {
            title: 'Instagram',
            url: 'https://www.instagram.com/systeminc',
            type: 'social',
        },
    },
};

// Merge Project Settings
if(ProjectSettings) {
    StructureSettings = {
        ...StructureSettings,
        ...ProjectSettings,
    };
}

// Export - Default
export default StructureSettings;
