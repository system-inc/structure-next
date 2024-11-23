// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';
import { graphql } from '../../../../../package.json';

// Configuration
const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    schema: graphql.projects.app.schema,
    documents: graphql.projects.app.documents,
    generates: {
        './source/api/': {
            preset: 'client',
            plugins: [
                {
                    'typescript-operation-metadata': {
                        metadata: ['./source/api/schemas/**/*.json'],
                    },
                },
            ],
        },
    },
};

// Export - Default
export default graphQlCodeGeneratorConfiguration;
