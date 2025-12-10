// Dependencies - React and Next.js
import { getRequestCookiesHeaderString } from '@structure/source/utilities/next/NextHeaders';
import { notFound } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { PublicProfilePage } from '@structure/source/modules/account/profiles/pages/PublicProfilePage';

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
                cookie: await getRequestCookiesHeaderString(),
            },
        },
    );
    // console.log('profilePublicData', profilePublicData);

    return { profilePublic: accountProfilePublicRequest?.accountProfilePublic };
}

// Metadata
export async function generateMetadata(properties: {
    params: Promise<{
        username: string;
    }>;
}) {
    // Await params (required in Next.js 15)
    const urlParameters = await properties.params;

    // Get the server-side properties
    const serverSideProperties = await getServerSideProperties(urlParameters.username);

    // If no profile was found, return "Not Found" title
    if(!serverSideProperties.profilePublic) {
        return {
            title: 'Not Found',
        };
    }

    // Build the title
    let title = '';

    // If there is a display name
    if(serverSideProperties.profilePublic.displayName) {
        title =
            serverSideProperties.profilePublic.displayName + ' (@' + serverSideProperties.profilePublic.username + ')';
    }
    // If there is no display name
    else {
        title = '@' + serverSideProperties.profilePublic.username;
    }

    return {
        title: title + ' • Profiles',
    };
}

// Page
export interface PublicProfilePageRouteProperties {
    params: Promise<{
        username: string;
    }>;
}
export async function PublicProfilePageRoute(properties: PublicProfilePageRouteProperties) {
    // Await params (required in Next.js 15)
    const urlParameters = await properties.params;

    // Get the server-side properties
    const serverSideProperties = await getServerSideProperties(urlParameters.username);

    // If no profile was found, return 404
    if(!serverSideProperties.profilePublic) {
        notFound();
    }

    // Render the component
    return <PublicProfilePage {...serverSideProperties} />;
}
