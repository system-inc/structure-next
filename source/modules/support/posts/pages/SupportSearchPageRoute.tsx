// Dependencies - Main Components
import { SearchSupportPostsPage } from '@structure/source/modules/support/posts/pages/SearchSupportPostsPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { ColumnFilterConditionOperator, PostsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { getRequestCookiesHeaderString } from '@structure/source/utilities/next/NextHeaders';

// Function to get server-side properties
export async function getSupportSearchServerSideProperties(searchTerm: string) {
    const serverSideNetworkService = await getServerSideNetworkService();

    // Search
    const postsRequest = await serverSideNetworkService.graphQlRequest(
        PostsDocument,
        {
            pagination: {
                itemsPerPage: 25,
                filters: [
                    {
                        operator: ColumnFilterConditionOperator.Equal,
                        column: 'type',
                        value: 'SupportArticle',
                    },
                    {
                        operator: ColumnFilterConditionOperator.Like,
                        column: 'content',
                        value: '%' + searchTerm + '%',
                    },
                ],
            },
        },
        {
            headers: {
                cookie: await getRequestCookiesHeaderString(),
            },
        },
    );

    // Return the properties
    return {
        posts: postsRequest.posts.items,
    };
}

// Metadata generator
export function generateSupportSearchPageMetadata(searchTerm: string) {
    let title = searchTerm;
    title += ' • Search • Support';

    return {
        title: title,
    };
}

// Route component
export interface SupportSearchPageRouteProperties {
    className?: string;
    searchTerm: string;
}
export async function SupportSearchPageRoute(properties: SupportSearchPageRouteProperties) {
    const serverSideProperties = await getSupportSearchServerSideProperties(properties.searchTerm);

    return (
        <SearchSupportPostsPage
            className={properties.className}
            searchTerm={properties.searchTerm}
            posts={serverSideProperties.posts}
        />
    );
}
