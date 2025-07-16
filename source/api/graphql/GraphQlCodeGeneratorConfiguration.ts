// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';
import { graphql } from '../../../../../package.json';

// Configuration
export const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    generates: {
        // App GraphQL files
        [graphql.projects.app.output]: {
            preset: 'client',
            schema: graphql.projects.app.schema,
            documents: graphql.projects.app.documents,
            plugins: [
                {
                    'typescript-operation-metadata': {
                        metadata: graphql.projects.app.metadata,
                    },
                },
            ],
            config: {
                useTypeImports: true,
                documentMode: 'string',
            },
        },
        // Structure GraphQL files
        [graphql.projects.structure.output]: {
            preset: 'client',
            schema: graphql.projects.structure.schema,
            documents: graphql.projects.structure.documents,
            plugins: [
                {
                    'typescript-operation-metadata': {
                        metadata: graphql.projects.structure.metadata,
                    },
                },
            ],
            config: {
                useTypeImports: true,
                documentMode: 'string',
            },
        },
    },
    ignoreNoDocuments: true,
};

// Export - Default
export default graphQlCodeGeneratorConfiguration;
