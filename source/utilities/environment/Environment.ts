// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Function to check if the current environment is a production environment
export function inProductionEnvironment(): boolean {
    // If we are not in the browser
    if(typeof window === 'undefined') {
        // Check if we are in production environment during server-side rendering
        if(
            typeof process !== 'undefined' &&
            'env' in process &&
            'NODE_ENV' in process.env &&
            process.env.NODE_ENV === 'production'
        ) {
            return true;
        }

        return false;
    }

    // If we don't have environment settings, assume not production
    if(!ProjectSettings.environments?.production?.hosts) {
        return false;
    }

    // Get the hostname (without www. prefix if it exists)
    const hostname = window.location.hostname;

    // Check if the current hostname is in the list of production hosts
    return ProjectSettings.environments.production.hosts.includes(hostname);
}

// Function to check if the current environment is a development environment
export function inDevelopmentEnvironment(): boolean {
    return !inProductionEnvironment();
}
