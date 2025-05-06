// Dependencies - API
import { ApolloError } from '@apollo/client';
import { extractValidationErrorsFromApolloError } from '@structure/source/api/graphql/GraphQlUtilities';

// Function to convert an Apollo error to a message
export const apolloErrorToMessage = function (apolloError?: ApolloError) {
    let errorMessage = 'Unknown error.';

    // If we have an error
    const errorObject = apolloError?.graphQLErrors;
    if(errorObject && errorObject.length > 0) {
        const error = errorObject[0];

        if(error) {
            const validationErrors = extractValidationErrorsFromApolloError(apolloError);

            // If we have validation errors
            if(validationErrors && validationErrors[0]) {
                const property = validationErrors[0].property;
                const constraints = validationErrors[0].constraints;

                if(property && constraints) {
                    const constraintKey = Object.keys(constraints)[0];
                    if(constraintKey) {
                        // const constraintValue = constraints[constraintKey];
                        errorMessage = `Invalid ${property}.`;
                    }
                }
            }

            return error.message;
        }
    }

    return errorMessage;
};
