// Dependencies - Structure Lint Rules
import NoInternalImportsRule from './NoInternalImportsRule.mjs';
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';
import ReactNoDestructuringProperties from './ReactNoDestructuringProperties.mjs';
import ReactNoDestructuringImport from './ReactNoDestructuringImport.mjs';
import ReactPropertiesParameterNameRule from './ReactPropertiesParameterNameRule.mjs';
import ReactNoArrowFunctionsAsHookParameters from './ReactNoArrowFunctionsAsHookParameters.mjs';
import ReactPropertiesTypeNamingRule from './ReactPropertiesTypeNamingRule.mjs';

// ESLint Structure Lint Rules
const StructureLintRules = {
    rules: {
        'no-internal-imports': NoInternalImportsRule,
        'no-structure-project-imports': NoStructureProjectImportsRule,
        'react-no-destructuring-properties': ReactNoDestructuringProperties,
        'react-no-destructuring-import': ReactNoDestructuringImport,
        'react-properties-parameter-name': ReactPropertiesParameterNameRule,
        'react-no-arrow-functions-as-hook-parameters': ReactNoArrowFunctionsAsHookParameters,
        'react-properties-type-naming': ReactPropertiesTypeNamingRule,
    },
};

// Export - Default
export default StructureLintRules;