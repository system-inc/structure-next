// Dependencies - Structure Lint Rules
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';
import ReactDestructuringPropertiesRule from './ReactDestructuringPropertiesRule.mjs';
import ReactNoDestructuringReactRule from './ReactNoDestructuringReactRule.mjs';
import ReactNoArrowFunctionsAsHookParametersRule from './ReactNoArrowFunctionsAsHookParametersRule.mjs';
import ReactPropertiesNamingRule from './ReactPropertiesNamingRule.mjs';
import ReactFunctionStyleRule from './ReactFunctionStyleRule.mjs';
import ReactExportRule from './ReactExportRule.mjs';

// ESLint Structure Lint Rules
const StructureLintRules = {
    rules: {
        'no-structure-project-imports-rule': NoStructureProjectImportsRule,
        'react-destructuring-properties-rule': ReactDestructuringPropertiesRule,
        'react-no-destructuring-react-rule': ReactNoDestructuringReactRule,
        'react-no-arrow-functions-as-hook-parameters-rule': ReactNoArrowFunctionsAsHookParametersRule,
        'react-properties-naming-rule': ReactPropertiesNamingRule,
        'react-function-style-rule': ReactFunctionStyleRule,
        'react-export-rule': ReactExportRule,
    },
};

// Export - Default
export default StructureLintRules;