// Dependencies - Main Components
import {
    AuthenticationInterface,
    Authentication,
} from '@structure/source/modules/account/pages/authentication/components/Authentication';
import { ThemeToggle } from '@structure/source/theme/ThemeToggle';

// Component - AuthenticationPage
export interface AuthenticationPageInterface {
    scope: AuthenticationInterface['scope'];
}
export function AuthenticationPage(properties: AuthenticationPageInterface) {
    // Render the component
    return (
        <>
            {/* Theme Toggle */}
            <div className="fixed right-5 top-5 z-10">
                <ThemeToggle />
            </div>

            {/* Authentication */}
            <div className="flex h-full min-h-screen w-full flex-col items-center justify-center py-12">
                <Authentication className="min-w-96 px-5 md:max-w-md" scope={properties.scope} />
            </div>
        </>
    );
}

// Export - Default
export default AuthenticationPage;
