'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DocumentationSpecificationProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { SideNavigationLayout } from '@structure/source/layouts/side-navigation/SideNavigationLayout';
import { SideNavigation } from '@structure/source/common/navigation/side-navigation/SideNavigation';
import { DocumentationSettings } from '@structure/source/modules/documentation/settings/DocumentationSettings';

// Dependencies - Utilities
import { getSideNavigationSectionsFromDocumentationSpecification } from '@structure/source/modules/documentation/utilities/DocumentationUtilities';

// Component - DocumentationLayout
export interface DocumentationLayoutProperties {
    children: React.ReactNode;
    specification: DocumentationSpecificationProperties;
}
export function DocumentationLayout(properties: DocumentationLayoutProperties) {
    // Render the component
    return (
        <SideNavigationLayout
            identifier={properties.specification.identifier}
            topBar={true}
            topTitle={properties.specification.title}
            navigation={
                <nav className="px-4 py-4">
                    {/* Settings */}
                    {properties.specification.settingsDialogEnabled && (
                        <DocumentationSettings
                            className="mb-4"
                            documentationIdentifier={properties.specification.identifier}
                        />
                    )}

                    {/* Side Navigation */}
                    <SideNavigation
                        sections={getSideNavigationSectionsFromDocumentationSpecification(properties.specification)}
                    />
                </nav>
            }
            contentBody={properties.children}
        />
    );
}
