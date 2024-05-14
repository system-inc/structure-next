// TODO: This whole file
// TODO: I don't like using use client here as it prevents the home page from being rendered on the server
'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - React and Next.js

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';
// import { useStore } from '@structure/source/utilities/Store';

// Component - RootPage
export type HomePageProperties = {};
export function HomePage(properties: HomePageProperties) {
    // const setShowSignInSignUpModal = useStore((state) => state.setShowSignInSignUpModal);
    // const handleClick = () => {
    //     setShowSignInSignUpModal(true);
    // };

    // Render the component
    // TODO: Finalize this
    return (
        <>
            {/* Header */}
            <h1>Header - {StructureSettings.title}</h1>
            {/* <Button onClick={handleClick}>Show Sign In/Sign Up Modal</Button> */}
            {/* Content */}
            <h1>Content</h1>
            {/* Footer */}
            <h1>Footer</h1>
            <div></div>
        </>
    );
}

// Export - Default
export default HomePage;
