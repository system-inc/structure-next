// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';
import { graphql } from '../../../../../package.json';

// Configuration
export const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    generates: {
        // Structure GraphQL files (using structure schemas and documents)
        './libraries/structure/source/api/graphql/generated/': {
            preset: 'client',
            schema: graphql.projects.structure.schema,
            documents: graphql.projects.structure.documents,
            plugins: [
                {
                    'typescript-operation-metadata': {
                        metadata: ['./libraries/structure/source/api/graphql/schemas/**/*.json'],
                    },
                },
            ],
            config: {
                useTypeImports: true,
            },
        },
        // Project GraphQL files (using project schemas and documents)
        './source/api/graphql/generated/': {
            preset: 'client',
            schema: graphql.projects.app.schema,
            documents: graphql.projects.app.documents,
            plugins: [
                {
                    'typescript-operation-metadata': {
                        metadata: ['./source/api/schemas/**/*.json'],
                    },
                },
            ],
            config: {
                useTypeImports: true,
            },
        },
    },
};

// Export - Default
export default graphQlCodeGeneratorConfiguration;
