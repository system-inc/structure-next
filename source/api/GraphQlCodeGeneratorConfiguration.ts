// Dependencies
import { CodegenConfig as GraphQlCodeGeneratorConfiguration } from '@graphql-codegen/cli';

// Configuration
const graphQlCodeGeneratorConfiguration: GraphQlCodeGeneratorConfiguration = {
    schema: ['./source/api/schemas/**/*.graphql'],
    documents: ['./source/modules/**/api/**/*.ts', './libraries/structure/source/modules/**/api/**/*.ts'],
    generates: {
        './source/api/': {
            preset: 'client',
        },
    },
};

// Export - Default
export default graphQlCodeGeneratorConfiguration;
