'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DocumentationSpecificationInterface } from '@structure/source/modules/documentation/types/DocumentationSpecificationInterface';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { SideNavigationLayout } from '@structure/source/layouts/side-navigation/SideNavigationLayout';
import { SideNavigation } from '@structure/source/common/navigation/side-navigation/SideNavigation';
import { ApiKeyFormDialog } from '@structure/source/modules/documentation/forms/ApiKeyFormDialog';

// Dependencies - Shared State
import { useAtom } from 'jotai';
import { apiKeyAtom } from '@structure/source/modules/documentation/forms/ApiKeyFormDialog';

type DocumentationLayoutProps = {
    children: React.ReactNode;
    specification: DocumentationSpecificationInterface;
};
const DocumentationLayout = (props: DocumentationLayoutProps) => {
    // State
    const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = React.useState(false);
    const [apiKey] = useAtom(apiKeyAtom);

    return (
        <SideNavigationLayout
            topBar={true}
            identifier={props.specification.identifier}
            navigation={
                <nav className="px-4 py-4">
                    {/* API Key */}
                    <div className="mb-4">
                        <Button
                            className="w-full"
                            onClick={function () {
                                setIsApiKeyDialogOpen(true);
                            }}
                        >
                            Set API Key {apiKey ? `(${apiKey.slice(-4)})` : ''}
                        </Button>
                    </div>

                    <SideNavigation categories={props.specification.categories} />

                    {/* API Key */}
                    <ApiKeyFormDialog
                        isOpen={isApiKeyDialogOpen}
                        onClose={function () {
                            setIsApiKeyDialogOpen(false);
                        }}
                    />
                </nav>
            }
            contentBody={props.children}
        />
    );
};

export default DocumentationLayout;
