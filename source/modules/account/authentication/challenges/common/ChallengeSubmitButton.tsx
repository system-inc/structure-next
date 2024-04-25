import Button, { ButtonInterface } from '@structure/source/common/buttons/Button';
import React from 'react';

interface ChallengeSubmitButtonInterface {}

const ChallengeSubmitButton = React.forwardRef<HTMLElement, ChallengeSubmitButtonInterface>((properties, ref) => {
    return (
        <Button
            id="challenge-submit-button"
            ref={ref}
            {...properties}
            variant="contrast"
            className="mt-2 w-full text-center"
            type="submit"
        >
            Submit
        </Button>
    );
});
ChallengeSubmitButton.displayName = 'ChallengeSubmitButton';

export default ChallengeSubmitButton;
