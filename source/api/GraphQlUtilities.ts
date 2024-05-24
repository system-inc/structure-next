// Dependencies - API
import { ApolloError } from '@apollo/client';

// Function to convert an Apollo error to a message
export const apolloErrorToMessage = function (mutationError?: ApolloError) {
    let errorObject = mutationError?.graphQLErrors;

    if(errorObject && errorObject.length > 0) {
        const error = errorObject[0];

        if(error) {
            if(error.extensions && error.extensions.validationErrors) {
                const validationErrors = error.extensions.validationErrors as Array<any>;
                // console.log('validationErrors', validationErrors);

                if(validationErrors.length > 0) {
                    const property = validationErrors[0].property;
                    const constraints = validationErrors[0].constraints;

                    if(property && constraints) {
                        const constraintKey = Object.keys(constraints)[0];
                        if(constraintKey) {
                            const constraintValue = constraints[constraintKey];

                            return `Invalid ${property}.`;
                        }
                    }
                }
            }

            return error.message;
        }
    }

    return 'Unknown error.';
};
