// Dependencies - Structure Lint Rules
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';
import ReactDestructuringPropertiesRule from './ReactDestructuringPropertiesRule.mjs';
import ReactNoDestructuringReactRule from './ReactNoDestructuringReactRule.mjs';
import ReactNoArrowFunctionsAsHookParametersRule from './ReactNoArrowFunctionsAsHookParametersRule.mjs';
import ReactNamingConventionsRule from './ReactNamingConventionsRule.mjs';
import ReactFunctionStyleRule from './ReactFunctionStyleRule.mjs';
import ReactExportRule from './ReactExportRule.mjs';
import ReactImportRule from './ReactImportRule.mjs';
import ReactFileOrganizationRule from './ReactFileOrganizationRule.mjs';

// ESLint Structure Lint Rules
const StructureLintRules = {
    rules: {
        'no-structure-project-imports-rule': NoStructureProjectImportsRule,
        'react-destructuring-properties-rule': ReactDestructuringPropertiesRule,
        'react-no-destructuring-react-rule': ReactNoDestructuringReactRule,
        'react-no-arrow-functions-as-hook-parameters-rule': ReactNoArrowFunctionsAsHookParametersRule,
        'react-naming-conventions-rule': ReactNamingConventionsRule,
        'react-function-style-rule': ReactFunctionStyleRule,
        'react-export-rule': ReactExportRule,
        'react-import-rule': ReactImportRule,
        'react-file-organization-rule': ReactFileOrganizationRule,
    },
};

// Export - Default
export default StructureLintRules;
