// Dependencies - React
import React from 'react';

// Dependencies - Assets
import {
    FileIcon,
    FilePdfIcon,
    ImageIcon,
    MicrosoftExcelLogoIcon,
    MicrosoftPowerpointLogoIcon,
    MicrosoftWordLogoIcon,
    VideoIcon,
    WaveformIcon,
} from '@phosphor-icons/react';

// Function to determine if a file is an image
export function isImageFile(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
}

// Function to get the appropriate icon component for a file type
export function iconForFileType(fileType: string): React.FunctionComponent<React.SVGProps<SVGSVGElement>> {
    switch(true) {
        case fileType.includes('image'):
            return ImageIcon;
        case fileType.includes('pdf'):
            return FilePdfIcon;
        case fileType.includes('audio'):
            return WaveformIcon;
        case fileType.includes('video'):
            return VideoIcon;
        case fileType.includes('word'):
            return MicrosoftWordLogoIcon;
        case fileType.includes('excel'):
            return MicrosoftExcelLogoIcon;
        case fileType.includes('powerpoint'):
            return MicrosoftPowerpointLogoIcon;
        default:
            return FileIcon;
    }
}

// Type for download input - can be string content, Blob, or File
export type DownloadableData = string | Blob | File;

// Interface for download options
export interface DownloadFileOptions {
    fileName: string;
    content?: DownloadableData; // For data downloads
    url?: string; // For URL downloads
    contentType?: string; // MIME type (only used when content is a string)
}

// Function to download a file in the browser
export function downloadFile(options: DownloadFileOptions): void {
    const fileName = options.fileName;
    const fileContent = options.content;
    const fileUrl = options.url;
    const mimeType = options.contentType;

    // Create a temporary link element
    const link = document.createElement('a');

    // Set the href based on whether we have content or a URL
    if(fileUrl) {
        // URL download
        link.href = fileUrl;
    }
    else if(fileContent !== undefined) {
        // Data download - create a Blob URL
        let blob: Blob;

        if(typeof fileContent === 'string') {
            // String content - create Blob with specified content type
            blob = new Blob([fileContent], { type: mimeType || 'application/octet-stream' });
        }
        else {
            // Already a Blob or File
            blob = fileContent;
        }

        link.href = URL.createObjectURL(blob);
    }
    else {
        throw new Error('Either content or url must be provided');
    }

    // Set the download attribute with the filename
    link.download = fileName;

    // Append the link to the document body, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the Blob URL if we created one
    if(fileContent !== undefined && !fileUrl) {
        URL.revokeObjectURL(link.href);
    }
}

// Function - bytesToScaledUnits
// Converts bytes to scaled units with appropriate metric prefixes
export function bytesToScaledUnits(
    bytes: number,
    options?: {
        decimals?: number; // Number of decimal places (default: 2)
        system?: 'Binary' | 'Decimal'; // Binary (1024) or Decimal (1000) (default: 'Binary')
        unitStyle?: 'Short' | 'Long' | 'Narrow'; // Short (KB), Long (kilobytes), Narrow (KB no space) (default: 'Short')
        maximumUnit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'; // Maximum unit to use (default: 'TB')
        minimumUnit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'; // Minimum unit to use (default: 'B')
        trimZeros?: boolean; // Remove trailing zeros (default: true)
        forceUnit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'; // Force specific unit regardless of size
        roundingMode?: 'Floor' | 'Ceil' | 'Round'; // How to round decimal values (default: 'Round')
    },
): string {
    // Type definitions
    type UnitName = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

    // Extract options with defaults
    const decimals = options?.decimals ?? 2;
    const system = options?.system ?? 'Binary';
    const unitStyle = options?.unitStyle ?? 'Short';
    const maximumUnit = options?.maximumUnit ?? 'TB';
    const minimumUnit = options?.minimumUnit ?? 'B';
    const trimZeros = options?.trimZeros ?? true;
    const forceUnit = options?.forceUnit;
    const roundingMode = options?.roundingMode ?? 'Round';

    // Helper - applyRounding
    function applyRounding(value: number, decimals: number, mode: 'Floor' | 'Ceil' | 'Round'): number {
        const multiplier = Math.pow(10, decimals);

        switch(mode) {
            case 'Floor':
                return Math.floor(value * multiplier) / multiplier;
            case 'Ceil':
                return Math.ceil(value * multiplier) / multiplier;
            case 'Round':
            default:
                return Math.round(value * multiplier) / multiplier;
        }
    }

    // Helper - formatOutput
    function formatOutput(
        value: number,
        unit: UnitName,
        style: 'Short' | 'Long' | 'Narrow',
        decimals: number,
        trimZeros: boolean,
    ): string {
        // Format the value with specified decimal places
        let formattedValue = value.toFixed(decimals);

        // Trim trailing zeros if requested
        if(trimZeros) {
            formattedValue = parseFloat(formattedValue).toString();
        }

        // Map short units to long form
        const unitMap: Record<UnitName, string> = {
            B: 'bytes',
            KB: 'kilobytes',
            MB: 'megabytes',
            GB: 'gigabytes',
            TB: 'terabytes',
            PB: 'petabytes',
        };

        // Determine unit string based on style
        let unitString: string;
        switch(style) {
            case 'Long':
                unitString = unitMap[unit];
                break;
            case 'Narrow':
                return formattedValue + unit;
            case 'Short':
            default:
                unitString = unit;
                break;
        }

        // Add space for Short and Long styles
        return formattedValue + ' ' + unitString;
    }

    // Handle zero bytes case
    if(bytes === 0) {
        const zeroUnit = forceUnit || minimumUnit;
        return formatOutput(0, zeroUnit, unitStyle, decimals, trimZeros);
    }

    // Define base (1024 for binary, 1000 for decimal)
    const base = system === 'Binary' ? 1024 : 1000;

    // Define unit array
    const units: UnitName[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    // Get unit boundaries
    const minimumUnitIndex = units.indexOf(minimumUnit);
    const maximumUnitIndex = units.indexOf(maximumUnit);

    // If forcing a specific unit
    if(forceUnit) {
        const forcedUnitIndex = units.indexOf(forceUnit);
        const value = bytes / Math.pow(base, forcedUnitIndex);
        const roundedValue = applyRounding(value, decimals, roundingMode);
        return formatOutput(roundedValue, forceUnit, unitStyle, decimals, trimZeros);
    }

    // Calculate which unit to use based on the size
    let unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

    // Clamp to minimum and maximum unit boundaries
    unitIndex = Math.max(minimumUnitIndex, Math.min(maximumUnitIndex, unitIndex));

    // Ensure unitIndex is within array bounds
    unitIndex = Math.max(0, Math.min(units.length - 1, unitIndex));

    // Convert bytes to the appropriate unit
    const value = bytes / Math.pow(base, unitIndex);
    const roundedValue = applyRounding(value, decimals, roundingMode);

    // Get the unit name (guaranteed to be defined after clamping)
    const unit = units[unitIndex]!;

    return formatOutput(roundedValue, unit, unitStyle, decimals, trimZeros);
}
