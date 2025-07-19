// Dependencies - React and Next.js
import { getRequestCookiesHeaderString } from '@structure/source/utilities/next/NextHeaders';

// Dependencies - Main Components
import { PublicProfilePage } from '@structure/source/modules/account/pages/profiles/PublicProfilePage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { AccountProfilePublicDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Function to get server-side properties
async function getServerSideProperties(username: string) {
    const serverSideNetworkService = await getServerSideNetworkService();

    const accountProfilePublicRequest = await serverSideNetworkService.graphQlRequest(
        AccountProfilePublicDocument,
        {
            username: username,
        },
        {
            headers: {
                cookie: getRequestCookiesHeaderString(),
            },
        },
    );
    // console.log('profilePublicData', profilePublicData);

    return { profilePublic: accountProfilePublicRequest?.accountProfilePublic };
}

// Metadata
export async function generateMetadata(properties: {
    params: {
        username: string;
    };
}) {
    // Get the server-side properties
    const serverSideProperties = await getServerSideProperties(properties.params.username);

    // Build the title
    let title = '';

    // If there is a display name
    if(serverSideProperties.profilePublic?.displayName) {
        title =
            serverSideProperties.profilePublic?.displayName + ' (@' + serverSideProperties.profilePublic.username + ')';
    }
    // If there is no display name
    else {
        title = '@' + serverSideProperties.profilePublic?.username;
    }

    return {
        title: title + ' • Profiles',
    };
}

// Page
export interface PublicProfilePageRouteProperties {
    params: {
        username: string;
    };
}
export async function PublicProfilePageRoute(properties: PublicProfilePageRouteProperties) {
    // Get the server-side properties
    const serverSideProperties = await getServerSideProperties(properties.params.username);

    // Render the component
    return <PublicProfilePage {...serverSideProperties} />;
}
