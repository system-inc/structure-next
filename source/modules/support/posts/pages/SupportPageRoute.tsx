// Dependencies - Main Components
import { SupportPage, SupportPageProperties } from '@structure/source/modules/support/posts/pages/SupportPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { PostTopicsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Interface for route configuration
export interface SupportPageRouteConfiguration {
    topicIds: string[];
    topicIconMapping?: SupportPageProperties['topicIconMapping'];
}

// Function to get server-side properties
export async function getSupportPageServerSideProperties(configuration: SupportPageRouteConfiguration) {
    const serverSideNetworkService = await getServerSideNetworkService();

    // console.log('[SupportPageRoute] configuration.topicIds:', configuration.topicIds);
    // console.log('[SupportPageRoute] typeof topicIds:', typeof configuration.topicIds);
    // console.log('[SupportPageRoute] Array.isArray(topicIds):', Array.isArray(configuration.topicIds));

    // PostTopics
    const postTopicsRequest = await serverSideNetworkService.graphQlRequest(PostTopicsDocument, {
        ids: configuration.topicIds,
    });

    console.log('[SupportPageRoute] postTopicsRequest.postTopics count:', postTopicsRequest.postTopics?.length);

    // Return the properties
    return {
        postTopics: postTopicsRequest.postTopics,
    };
}

// Metadata generator
export function generateSupportPageMetadata(title?: string) {
    return {
        title: title || 'Support',
    };
}

// Route component
export interface SupportPageRouteProperties {
    className?: string;
    topicIds: string[];
    topicIconMapping?: SupportPageProperties['topicIconMapping'];
    basePath?: string;
    title?: string;
    heading?: string;
    description?: string;
    searchPlaceholder?: string;
    showNeedMoreHelp?: boolean;
}
export async function SupportPageRoute(properties: SupportPageRouteProperties) {
    const serverSideProperties = await getSupportPageServerSideProperties({
        topicIds: properties.topicIds,
        topicIconMapping: properties.topicIconMapping,
    });

    return (
        <SupportPage
            className={properties.className}
            postTopics={serverSideProperties.postTopics}
            topicIconMapping={properties.topicIconMapping}
            basePath={properties.basePath}
            title={properties.title}
            heading={properties.heading}
            description={properties.description}
            searchPlaceholder={properties.searchPlaceholder}
            showNeedMoreHelp={properties.showNeedMoreHelp}
        />
    );
}
