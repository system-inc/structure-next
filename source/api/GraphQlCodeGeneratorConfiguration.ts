// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';
import { graphql } from './../../../../package.json';

// Configuration
const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    schema: graphql.projects.app.schema,
    documents: graphql.projects.app.documents,
    generates: {
        './source/api/': {
            preset: 'client',
        },
    },
};

// Export - Default
export default graphQlCodeGeneratorConfiguration;
