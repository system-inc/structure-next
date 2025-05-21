// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';
import { graphql } from '../../../../../package.json';

// Configuration
export const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    schema: graphql.projects.app.schema,
    generates: {
        // Structure GraphQL files (using structure module documents)
        './libraries/structure/source/api/graphql/generated/': {
            preset: 'client',
            documents: ['./libraries/structure/source/modules/**/api/**/*.graphql'],
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
        // Project GraphQL files (using project module documents)
        './source/api/graphql/generated/': {
            preset: 'client',
            documents: ['./source/modules/**/api/**/*.graphql'],
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
