// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - API
import { networkService } from '@structure/source/services/network/NetworkService';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';

// Schema - supportTicketCreateRequestInputSchema
export const supportTicketCreateRequestInputSchema = schema.object({
    title: schema.string().notEmpty(),
    description: schema.string().notEmpty().optional(),
    emailAddress: schema.string().emailAddress(),
    content: schema.string().notEmpty(),
    type: schema.string().is('Contact').default('Contact'),
    contentType: schema.string().in(['PlainText', 'Html', 'Markdown']).default('Markdown'),
    attachmentFiles: schema.array(
        // Auto-defaults to []
        schema
            .file()
            .mimeType(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/json'])
            .maximumSize(1024 * 1024 * 5), // 5 MB
    ),
});

// Type - SupportTicketCreateRequestInputType
export type SupportTicketCreateRequestInputType = typeof supportTicketCreateRequestInputSchema.infer;

// Function to handle support ticket creation submission
async function handleSupportTicketCreateSubmit(input: SupportTicketCreateRequestInputType) {
    // Create new form data to handle the file uploads
    const formData = new FormData();

    // Append JSON data to the form data
    const { attachmentFiles, ...dataProperties } = input;
    for(const [key, value] of Object.entries(dataProperties)) {
        if(value !== undefined) {
            formData.append(key, String(value));
        }
    }

    // Append attachment files to the form data
    attachmentFiles.forEach(function (file) {
        formData.append('attachmentFiles', file);
    });

    // Send the request to the support ticket creation endpoint
    const response = await networkService.request(`https://${ProjectSettings.apis.base.host}/support/ticketCreate`, {
        method: 'POST',
        body: formData,
    });

    return response;
}

// Type - TicketMutationResponse
export type SupportTicketCreateResponseType = Awaited<ReturnType<typeof handleSupportTicketCreateSubmit>>;

// Hook - useSupportTicketCreateRequest
export function useSupportTicketCreateRequest() {
    return networkService.useWriteRequest({
        request: handleSupportTicketCreateSubmit,
    });
}
