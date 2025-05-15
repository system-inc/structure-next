// Dependecies - Structure Rules
import NoInternalImportsRule from './NoInternalImportsRule.mjs';
import NoStructureProjectImportsRule from './NoStructureProjectImportsRule.mjs';

// ESLint Structure Rules
const StructureRules = {
    rules: {
        'no-internal-imports': NoInternalImportsRule,
        'no-structure-project-imports': NoStructureProjectImportsRule,
    },
};

// Export - Default
export default StructureRules;
