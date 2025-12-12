// Dependencies - Main Components
import { SearchPostsPage } from '@structure/source/modules/post/search/pages/SearchPostsPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { ColumnFilterConditionOperator, PostsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { getRequestCookiesHeaderString } from '@structure/source/utilities/next/NextHeaders';

// Function to get server-side properties
export async function getSearchPostsPageServerSideProperties(searchTerm: string) {
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
export function generateSearchPostsPageMetadata(searchTerm: string, titleSuffix: string) {
    let title = searchTerm;
    title += ' • Search • ' + titleSuffix;

    return {
        title: title,
    };
}

// Route component
export interface SearchPostsPageRouteProperties {
    className?: string;
    searchTerm: string;
    basePath: string;
    title: string;
    searchPath: string;
    showNeedMoreHelp?: boolean;
}
export async function SearchPostsPageRoute(properties: SearchPostsPageRouteProperties) {
    const serverSideProperties = await getSearchPostsPageServerSideProperties(properties.searchTerm);

    return (
        <SearchPostsPage
            className={properties.className}
            searchTerm={properties.searchTerm}
            posts={serverSideProperties.posts}
            basePath={properties.basePath}
            title={properties.title}
            searchPath={properties.searchPath}
            showNeedMoreHelp={properties.showNeedMoreHelp}
        />
    );
}
