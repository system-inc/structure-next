import { ThemeMode } from './source/theme/Theme';

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

// Interface - StructureSettingsInterface
export interface StructureSettingsInterface {
    identifier: string;
    title: string;
    ownerDisplayName: string;
    tagline: string;
    description: string;
    url: string;
    apis: {
        base: ApiService;
        [key: string]: ApiService;
    };
    modules: {
        engagement: boolean;
        accounts: boolean;
        support: boolean;
        posts: boolean;
        commerce: boolean;
    };
    theme?: {
        defaultClassName: ThemeMode;
    };
    assets: {
        url: string;
        favicon: ThemedAsset;
        logo: LogoAsset;
    };
    sourceCodeRepositories: {
        structure: {
            url: string;
        };
        project: {
            url: string;
        };
    };

    services?: {
        [providerIdentifier: string]: Service;
    };
    platforms: {
        [platformIdentifier: string]: Platform;
    };
}

// Default - StructureSettings
export const StructureSettings: StructureSettingsInterface = {
    identifier: 'system',
    title: 'Structure',
    ownerDisplayName: 'System, Inc.',
    tagline: 'React and Next.js Implementation for Base',
    description: 'A React and Next.js implementation for Base.',
    url: 'https://www.system.inc/',
    apis: {
        base: {
            url: 'https://api.system.inc/graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        },
    },
    assets: {
        url: 'https://assets.system.inc/',
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
    sourceCodeRepositories: {
        structure: {
            url: 'https://github.com/system-inc/structure-next/',
        },
        project: {
            url: 'https://github.com/system-inc/structure-next-template/',
        },
    },
    modules: {
        accounts: true,
        engagement: true,
        support: true,
        posts: true,
        commerce: true,
    },
    theme: {
        defaultClassName: 'light',
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

// Export - Default
export default StructureSettings;
