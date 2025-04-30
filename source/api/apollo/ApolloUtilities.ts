// Dependencies - API
import { ApolloError } from '@apollo/client';

// Interface - GraphQlValidationErrorConstraint
interface GraphQlValidationErrorConstraint {
    [constraintKey: string]: string;
}

// Interface - GraphQlValidationError
interface GraphQlValidationError {
    property: string;
    constraints: GraphQlValidationErrorConstraint;
    value?: unknown;
    children?: GraphQlValidationError[];
}

// Function to convert an Apollo error to a message
export const apolloErrorToMessage = function (apolloError?: ApolloError) {
    let errorMessage = 'Unknown error.';

    // If we have an error
    const errorObject = apolloError?.graphQLErrors;
    if(errorObject && errorObject.length > 0) {
        const error = errorObject[0];

        if(error) {
            if(error.extensions && error.extensions.validationErrors) {
                const validationErrors = error.extensions.validationErrors as GraphQlValidationError[];
                // console.log('validationErrors', validationErrors);

                // If we have a validation error
                if(validationErrors[0]) {
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
            }

            return error.message;
        }
    }

    return errorMessage;
};
