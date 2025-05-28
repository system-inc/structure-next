// Dependencies - Structure Lint Rules
import NoInternalImportsRule from './NoInternalImportsRule.mjs';
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';
import ReactDestructuringPropertiesRule from './ReactDestructuringPropertiesRule.mjs';
import ReactNoDestructuringReactRule from './ReactNoDestructuringReactRule.mjs';
import ReactPropertiesParameterNameRule from './ReactPropertiesParameterNameRule.mjs';
import ReactNoArrowFunctionsAsHookParametersRule from './ReactNoArrowFunctionsAsHookParametersRule.mjs';
import ReactPropertiesTypeNamingRule from './ReactPropertiesTypeNamingRule.mjs';
import ReactFunctionStyleRule from './ReactFunctionStyleRule.mjs';
import ReactExportRule from './ReactExportRule.mjs';

// ESLint Structure Lint Rules
const StructureLintRules = {
    rules: {
        'no-internal-imports-rule': NoInternalImportsRule,
        'no-structure-project-imports-rule': NoStructureProjectImportsRule,
        'react-destructuring-properties-rule': ReactDestructuringPropertiesRule,
        'react-no-destructuring-react-rule': ReactNoDestructuringReactRule,
        'react-properties-parameter-name-rule': ReactPropertiesParameterNameRule,
        'react-no-arrow-functions-as-hook-parameters-rule': ReactNoArrowFunctionsAsHookParametersRule,
        'react-properties-type-naming-rule': ReactPropertiesTypeNamingRule,
        'react-function-style-rule': ReactFunctionStyleRule,
        'react-export-rule': ReactExportRule,
    },
};

// Export - Default
export default StructureLintRules;