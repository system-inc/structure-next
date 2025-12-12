// Dependencies - Main Components
import { PostTopicsPage, PostTopicsPageProperties } from '@structure/source/modules/post/topics/pages/PostTopicsPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { PostTopicsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Interface for route configuration
export interface PostTopicsPageRouteConfiguration {
    topicIds: string[];
    topicIconMapping?: PostTopicsPageProperties['topicIconMapping'];
}

// Function to get server-side properties
export async function getPostTopicsPageServerSideProperties(configuration: PostTopicsPageRouteConfiguration) {
    const serverSideNetworkService = await getServerSideNetworkService();

    // PostTopics
    const postTopicsRequest = await serverSideNetworkService.graphQlRequest(PostTopicsDocument, {
        ids: configuration.topicIds,
    });

    console.log('[PostTopicsPageRoute] postTopicsRequest.postTopics count:', postTopicsRequest.postTopics?.length);

    // Return the properties
    return {
        postTopics: postTopicsRequest.postTopics,
    };
}

// Metadata generator
export function generatePostTopicsPageMetadata(title: string) {
    return {
        title: title,
    };
}

// Route component
export interface PostTopicsPageRouteProperties {
    className?: string;
    topicIds: string[];
    topicIconMapping?: PostTopicsPageProperties['topicIconMapping'];
    basePath: string;
    title: string;
    heading: string;
    description: string;
    searchPath: string;
    searchPlaceholder?: string;
    showNeedMoreHelp?: boolean;
}
export async function PostTopicsPageRoute(properties: PostTopicsPageRouteProperties) {
    const serverSideProperties = await getPostTopicsPageServerSideProperties({
        topicIds: properties.topicIds,
        topicIconMapping: properties.topicIconMapping,
    });

    return (
        <PostTopicsPage
            className={properties.className}
            postTopics={serverSideProperties.postTopics}
            topicIconMapping={properties.topicIconMapping}
            basePath={properties.basePath}
            title={properties.title}
            heading={properties.heading}
            description={properties.description}
            searchPath={properties.searchPath}
            searchPlaceholder={properties.searchPlaceholder}
            showNeedMoreHelp={properties.showNeedMoreHelp}
        />
    );
}
