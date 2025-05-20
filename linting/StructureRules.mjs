// Dependencies - Structure Rules
import NoInternalImportsRule from './NoInternalImportsRule.mjs';
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';
import NoPropertiesDestructuringRule from './NoPropertiesDestructuringRule.mjs';
import NoReactDestructuringRule from './NoReactDestructuringRule.mjs';
import UsePropertiesNameRule from './UsePropertiesNameRule.mjs';

// ESLint Structure Rules
const StructureRules = {
    rules: {
        'no-internal-imports': NoInternalImportsRule,
        'no-structure-project-imports': NoStructureProjectImportsRule,
        'no-properties-destructuring': NoPropertiesDestructuringRule,
        'no-react-destructuring': NoReactDestructuringRule,
        'use-properties-name': UsePropertiesNameRule,
    },
};

// Export - Default
export default StructureRules;