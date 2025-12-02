'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
// import { Button } from '@structure/source/components/buttons/Button';
import { Card } from '@structure/source/components/containers/Card';
// import { DeletePostTopicDialog } from '@structure/source/modules/post/topics/components/dialogs/DeletePostTopicDialog';

// Dependencies - API
import { PostTopicUpdateOperation, PostTopicByIdDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';
import { slug } from '@structure/source/utilities/type/String';

// Dependencies - Assets
// import { TrashIcon } from '@phosphor-icons/react/dist/ssr';

// Component - EditSupportPostTopicPage
export interface EditSupportPostTopicPageProperties {
    postTopicId: string;
}
export function EditSupportPostTopicPage(properties: EditSupportPostTopicPageProperties) {
    // State
    // const [deletePostTopicDialogOpen, setDeletePostTopicDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className="container items-center justify-center pt-8 pb-32">
            <div className="flex items-center justify-between">
                <h1 className="text-xl">Edit Topic</h1>
                {/* <Button
                    variant="DestructiveGhost"
                    size="Icon"
                    icon={TrashIcon}
                    onClick={function () {
                        setDeletePostTopicDialogOpen(true);
                    }}
                /> */}
                {/* <DeletePostTopicDialog
                    open={deletePostTopicDialogOpen}
                    onOpenChange={setDeletePostTopicDialogOpen}
                    postTopicId={properties.postTopicId}
                /> */}
            </div>

            <Card variant="A" className="mt-4">
                <GraphQlMutationForm
                    // showPreviewGraphQlMutationTip={true}
                    className="flex flex-col gap-4"
                    operation={PostTopicUpdateOperation}
                    schema={schema.object({
                        'input.title': schema.string(),
                        'input.slug': schema.string(),
                        'input.description': schema.string().maximumLength(128),
                    })}
                    fieldProperties={{
                        'input.title': {
                            order: 1,
                            tip: 'The topic name displayed in navigation and headings.',
                        },
                        'input.slug': {
                            order: 2,
                            tip: 'The URL-friendly identifier used in the topic link.',
                        },
                        'input.description': {
                            order: 3,
                            tip: 'A brief summary of what this topic covers.',
                        },
                    }}
                    linkedFields={[{ sourceField: 'input.title', targetField: 'input.slug', transform: slug }]}
                    hiddenFields={{
                        'input.id': properties.postTopicId,
                    }}
                    defaultValuesGraphQlQuery={{
                        document: PostTopicByIdDocument,
                        variables: { id: properties.postTopicId },
                    }}
                    submitButtonProperties={{ children: 'Save' }}
                />
            </Card>
        </div>
    );
}
