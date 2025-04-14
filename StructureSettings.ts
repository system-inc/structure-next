// Dependencies - Theme
import { Theme } from '@structure/source/theme/ThemeTypes';

// Types
interface ApiService {
    host: string;
    graphQlPath?: string;
    webSocketPath?: string;
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
        defaultTheme: Theme;
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

    internalAccessRoles?: string[];
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
            host: 'api.system.inc',
            graphQlPath: '/graphql',
            webSocketPath: '/web-socket/user/connect',
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
        defaultTheme: Theme.OperatingSystem,
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
