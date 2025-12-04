'use client'; // This hook uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - API
import { networkService } from '@structure/source/services/network/NetworkService';
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Hook - useAccountProfileImageUploadRequest
export function useAccountProfileImageUploadRequest() {
    // Hooks
    const account = useAccount();

    return networkService.useWriteRequest({
        request: async function (imageBlob: Blob) {
            // Upload image to server
            const response = await networkService.request(
                `https://${ProjectSettings.apis.base.host}/accounts/profiles/images`,
                {
                    method: 'POST',
                    body: imageBlob,
                    headers: {
                        'Content-Type': 'image/jpeg',
                    },
                },
            );

            // Parse the response JSON
            const uploadResponse = (await response.json()) as {
                original: { url: string; name: string };
                transformed?: Array<{ url: string; name: string }>;
            };

            // Transform response to GqlMediaObject format and update account
            if(uploadResponse?.original && uploadResponse.transformed?.length) {
                const newImages = [
                    { url: uploadResponse.original.url, variant: uploadResponse.original.name },
                    ...uploadResponse.transformed.map(function (image) {
                        return { url: image.url, variant: image.name };
                    }),
                ];

                // Update account atom with new profile images
                if(account.data?.profile) {
                    account.setData({
                        profile: {
                            ...account.data.profile,
                            images: newImages,
                        },
                    });
                }
            }

            return uploadResponse;
        },
    });
}
