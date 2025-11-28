'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Color Data - Semantic Scale Steps
const semanticSteps = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// Color Data - Content Scale (light mode hex / dark mode hex)
const contentColors: Record<string, { light: string; dark: string; lightPrimitive: string; darkPrimitive: string }> = {
    '-3': { light: '#000000', dark: '#ffffff', lightPrimitive: 'black-1000', darkPrimitive: 'white-1000' },
    '-2': { light: '#040404', dark: '#fbfbfb', lightPrimitive: 'black-950', darkPrimitive: 'white-950' },
    '-1': { light: '#080808', dark: '#f7f7f7', lightPrimitive: 'black-900', darkPrimitive: 'white-900' },
    '0': { light: '#101010', dark: '#e7e7e7', lightPrimitive: 'black-800', darkPrimitive: 'white-700' },
    '1': { light: '#282828', dark: '#cfcfcf', lightPrimitive: 'black-500', darkPrimitive: 'white-400' },
    '2': { light: '#404040', dark: '#b7b7b7', lightPrimitive: 'black-200', darkPrimitive: 'white-100' },
    '3': { light: '#585858', dark: '#a7a7a7', lightPrimitive: 'gray-1000', darkPrimitive: 'gray-100' },
    '4': { light: '#707070', dark: '#878787', lightPrimitive: 'gray-700', darkPrimitive: 'gray-400' },
    '5': { light: '#878787', dark: '#707070', lightPrimitive: 'gray-400', darkPrimitive: 'gray-700' },
    '6': { light: '#9f9f9f', dark: '#585858', lightPrimitive: 'gray-100', darkPrimitive: 'gray-1000' },
    '7': { light: '#b7b7b7', dark: '#404040', lightPrimitive: 'white-100', darkPrimitive: 'black-200' },
    '8': { light: '#cfcfcf', dark: '#282828', lightPrimitive: 'white-400', darkPrimitive: 'black-500' },
    '9': { light: '#e7e7e7', dark: '#101010', lightPrimitive: 'white-700', darkPrimitive: 'black-800' },
    '10': { light: '#ffffff', dark: '#000000', lightPrimitive: 'white-1000', darkPrimitive: 'black-1000' },
};

// Color Data - Background Scale
const backgroundColors: Record<string, { light: string; dark: string; lightPrimitive: string; darkPrimitive: string }> =
    {
        '-3': { light: '#ffffff', dark: '#0c0c0c', lightPrimitive: 'white-1000', darkPrimitive: 'black-850' },
        '-2': { light: '#ffffff', dark: '#101010', lightPrimitive: 'white-1000', darkPrimitive: 'black-800' },
        '-1': { light: '#ffffff', dark: '#141414', lightPrimitive: 'white-1000', darkPrimitive: 'black-750' },
        '0': { light: '#ffffff', dark: '#181818', lightPrimitive: 'white-1000', darkPrimitive: 'black-700' },
        '1': { light: '#fbfbfb', dark: '#1c1c1c', lightPrimitive: 'white-950', darkPrimitive: 'black-650' },
        '2': { light: '#f7f7f7', dark: '#202020', lightPrimitive: 'white-900', darkPrimitive: 'black-600' },
        '3': { light: '#f3f3f3', dark: '#242424', lightPrimitive: 'white-850', darkPrimitive: 'black-550' },
        '4': { light: '#efefef', dark: '#282828', lightPrimitive: 'white-800', darkPrimitive: 'black-500' },
        '5': { light: '#ebebeb', dark: '#2c2c2c', lightPrimitive: 'white-750', darkPrimitive: 'black-450' },
        '6': { light: '#e7e7e7', dark: '#303030', lightPrimitive: 'white-700', darkPrimitive: 'black-400' },
        '7': { light: '#e3e3e3', dark: '#343434', lightPrimitive: 'white-650', darkPrimitive: 'black-350' },
        '8': { light: '#dfdfdf', dark: '#383838', lightPrimitive: 'white-600', darkPrimitive: 'black-300' },
        '9': { light: '#dbdbdb', dark: '#3c3c3c', lightPrimitive: 'white-550', darkPrimitive: 'black-250' },
        '10': { light: '#d7d7d7', dark: '#404040', lightPrimitive: 'white-500', darkPrimitive: 'black-200' },
    };

// Color Data - Border Scale
const borderColors: Record<string, { light: string; dark: string; lightPrimitive: string; darkPrimitive: string }> = {
    '-3': { light: '#ebebeb', dark: '#282828', lightPrimitive: 'white-750', darkPrimitive: 'black-500' },
    '-2': { light: '#e7e7e7', dark: '#2c2c2c', lightPrimitive: 'white-700', darkPrimitive: 'black-450' },
    '-1': { light: '#e3e3e3', dark: '#303030', lightPrimitive: 'white-650', darkPrimitive: 'black-400' },
    '0': { light: '#dfdfdf', dark: '#343434', lightPrimitive: 'white-600', darkPrimitive: 'black-350' },
    '1': { light: '#dbdbdb', dark: '#383838', lightPrimitive: 'white-550', darkPrimitive: 'black-300' },
    '2': { light: '#d7d7d7', dark: '#3c3c3c', lightPrimitive: 'white-500', darkPrimitive: 'black-250' },
    '3': { light: '#d3d3d3', dark: '#404040', lightPrimitive: 'white-450', darkPrimitive: 'black-200' },
    '4': { light: '#cfcfcf', dark: '#444444', lightPrimitive: 'white-400', darkPrimitive: 'black-150' },
    '5': { light: '#cbcbcb', dark: '#484848', lightPrimitive: 'white-350', darkPrimitive: 'black-100' },
    '6': { light: '#c7c7c7', dark: '#4c4c4c', lightPrimitive: 'white-300', darkPrimitive: 'black-50' },
    '7': { light: '#c3c3c3', dark: '#505050', lightPrimitive: 'white-250', darkPrimitive: 'black-0' },
    '8': { light: '#bfbfbf', dark: '#585858', lightPrimitive: 'white-200', darkPrimitive: 'gray-1000' },
    '9': { light: '#bbbbbb', dark: '#5c5c5c', lightPrimitive: 'white-150', darkPrimitive: 'gray-950' },
    '10': { light: '#b7b7b7', dark: '#606060', lightPrimitive: 'white-100', darkPrimitive: 'gray-900' },
};

// Color Data - Primitive Scales
const primitiveScaleSteps = [
    '0',
    '50',
    '100',
    '150',
    '200',
    '250',
    '300',
    '350',
    '400',
    '450',
    '500',
    '550',
    '600',
    '650',
    '700',
    '750',
    '800',
    '850',
    '900',
    '950',
    '1000',
];

const whiteScale: Record<string, string> = {
    '0': '#afafaf',
    '50': '#b3b3b3',
    '100': '#b7b7b7',
    '150': '#bbbbbb',
    '200': '#bfbfbf',
    '250': '#c3c3c3',
    '300': '#c7c7c7',
    '350': '#cbcbcb',
    '400': '#cfcfcf',
    '450': '#d3d3d3',
    '500': '#d7d7d7',
    '550': '#dbdbdb',
    '600': '#dfdfdf',
    '650': '#e3e3e3',
    '700': '#e7e7e7',
    '750': '#ebebeb',
    '800': '#efefef',
    '850': '#f3f3f3',
    '900': '#f7f7f7',
    '950': '#fbfbfb',
    '1000': '#ffffff',
};

const grayScale: Record<string, string> = {
    '0': '#a7a7a7',
    '50': '#a3a3a3',
    '100': '#9f9f9f',
    '150': '#9b9b9b',
    '200': '#979797',
    '250': '#939393',
    '300': '#8f8f8f',
    '350': '#8b8b8b',
    '400': '#878787',
    '450': '#838383',
    '500': '#808080',
    '550': '#7c7c7c',
    '600': '#787878',
    '650': '#747474',
    '700': '#707070',
    '750': '#6c6c6c',
    '800': '#686868',
    '850': '#646464',
    '900': '#606060',
    '950': '#5c5c5c',
    '1000': '#585858',
};

const blackScale: Record<string, string> = {
    '0': '#505050',
    '50': '#4c4c4c',
    '100': '#484848',
    '150': '#444444',
    '200': '#404040',
    '250': '#3c3c3c',
    '300': '#383838',
    '350': '#343434',
    '400': '#303030',
    '450': '#2c2c2c',
    '500': '#282828',
    '550': '#242424',
    '600': '#202020',
    '650': '#1c1c1c',
    '700': '#181818',
    '750': '#141414',
    '800': '#101010',
    '850': '#0c0c0c',
    '900': '#080808',
    '950': '#040404',
    '1000': '#000000',
};

const blueScale: Record<string, string> = {
    '0': '#f0f7ff',
    '50': '#e6f1ff',
    '100': '#dbeafe',
    '150': '#cee3fe',
    '200': '#bfdbfe',
    '250': '#abd0fe',
    '300': '#93c5fd',
    '350': '#7db6fc',
    '400': '#60a5fa',
    '450': '#5095f8',
    '500': '#3b82f6',
    '550': '#3174f1',
    '600': '#2563eb',
    '650': '#2159e2',
    '700': '#1d4ed8',
    '750': '#1e47c5',
    '800': '#1e40af',
    '850': '#1e3d9e',
    '900': '#1e3a8a',
    '950': '#172554',
    '1000': '#0f172a',
};

// Semantic State Colors
const semanticStates = {
    informative: { light: '#2563eb', dark: '#60a5fa', name: 'Blue' },
    positive: { light: '#16a34a', dark: '#4ade80', name: 'Green' },
    warning: { light: '#ea580c', dark: '#fb923c', name: 'Orange' },
    negative: { light: '#dc2626', dark: '#f87171', name: 'Red' },
};

// Color Scale Generator Steps (0-1000 in 50 increments)
const generatorSteps = [
    '0',
    '50',
    '100',
    '150',
    '200',
    '250',
    '300',
    '350',
    '400',
    '450',
    '500',
    '550',
    '600',
    '650',
    '700',
    '750',
    '800',
    '850',
    '900',
    '950',
    '1000',
];

// Tailwind CSS default color scales (50-950)
const tailwindColors: Record<string, Record<string, string>> = {
    blue: {
        '50': '#eff6ff',
        '100': '#dbeafe',
        '200': '#bfdbfe',
        '300': '#93c5fd',
        '400': '#60a5fa',
        '500': '#3b82f6',
        '600': '#2563eb',
        '700': '#1d4ed8',
        '800': '#1e40af',
        '900': '#1e3a8a',
        '950': '#172554',
    },
    green: {
        '50': '#f0fdf4',
        '100': '#dcfce7',
        '200': '#bbf7d0',
        '300': '#86efac',
        '400': '#4ade80',
        '500': '#22c55e',
        '600': '#16a34a',
        '700': '#15803d',
        '800': '#166534',
        '900': '#14532d',
        '950': '#052e16',
    },
    red: {
        '50': '#fef2f2',
        '100': '#fee2e2',
        '200': '#fecaca',
        '300': '#fca5a5',
        '400': '#f87171',
        '500': '#ef4444',
        '600': '#dc2626',
        '700': '#b91c1c',
        '800': '#991b1b',
        '900': '#7f1d1d',
        '950': '#450a0a',
    },
    orange: {
        '50': '#fff7ed',
        '100': '#ffedd5',
        '200': '#fed7aa',
        '300': '#fdba74',
        '400': '#fb923c',
        '500': '#f97316',
        '600': '#ea580c',
        '700': '#c2410c',
        '800': '#9a3412',
        '900': '#7c2d12',
        '950': '#431407',
    },
    purple: {
        '50': '#faf5ff',
        '100': '#f3e8ff',
        '200': '#e9d5ff',
        '300': '#d8b4fe',
        '400': '#c084fc',
        '500': '#a855f7',
        '600': '#9333ea',
        '700': '#7e22ce',
        '800': '#6b21a8',
        '900': '#581c87',
        '950': '#3b0764',
    },
    pink: {
        '50': '#fdf2f8',
        '100': '#fce7f3',
        '200': '#fbcfe8',
        '300': '#f9a8d4',
        '400': '#f472b6',
        '500': '#ec4899',
        '600': '#db2777',
        '700': '#be185d',
        '800': '#9d174d',
        '900': '#831843',
        '950': '#500724',
    },
    teal: {
        '50': '#f0fdfa',
        '100': '#ccfbf1',
        '200': '#99f6e4',
        '300': '#5eead4',
        '400': '#2dd4bf',
        '500': '#14b8a6',
        '600': '#0d9488',
        '700': '#0f766e',
        '800': '#115e59',
        '900': '#134e4a',
        '950': '#042f2e',
    },
    yellow: {
        '50': '#fefce8',
        '100': '#fef9c3',
        '200': '#fef08a',
        '300': '#fde047',
        '400': '#facc15',
        '500': '#eab308',
        '600': '#ca8a04',
        '700': '#a16207',
        '800': '#854d0e',
        '900': '#713f12',
        '950': '#422006',
    },
    gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
    },
    slate: {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617',
    },
    indigo: {
        '50': '#eef2ff',
        '100': '#e0e7ff',
        '200': '#c7d2fe',
        '300': '#a5b4fc',
        '400': '#818cf8',
        '500': '#6366f1',
        '600': '#4f46e5',
        '700': '#4338ca',
        '800': '#3730a3',
        '900': '#312e81',
        '950': '#1e1b4b',
    },
    cyan: {
        '50': '#ecfeff',
        '100': '#cffafe',
        '200': '#a5f3fc',
        '300': '#67e8f9',
        '400': '#22d3ee',
        '500': '#06b6d4',
        '600': '#0891b2',
        '700': '#0e7490',
        '800': '#155e75',
        '900': '#164e63',
        '950': '#083344',
    },
    emerald: {
        '50': '#ecfdf5',
        '100': '#d1fae5',
        '200': '#a7f3d0',
        '300': '#6ee7b7',
        '400': '#34d399',
        '500': '#10b981',
        '600': '#059669',
        '700': '#047857',
        '800': '#065f46',
        '900': '#064e3b',
        '950': '#022c22',
    },
    amber: {
        '50': '#fffbeb',
        '100': '#fef3c7',
        '200': '#fde68a',
        '300': '#fcd34d',
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309',
        '800': '#92400e',
        '900': '#78350f',
        '950': '#451a03',
    },
    rose: {
        '50': '#fff1f2',
        '100': '#ffe4e6',
        '200': '#fecdd3',
        '300': '#fda4af',
        '400': '#fb7185',
        '500': '#f43f5e',
        '600': '#e11d48',
        '700': '#be123c',
        '800': '#9f1239',
        '900': '#881337',
        '950': '#4c0519',
    },
    violet: {
        '50': '#f5f3ff',
        '100': '#ede9fe',
        '200': '#ddd6fe',
        '300': '#c4b5fd',
        '400': '#a78bfa',
        '500': '#8b5cf6',
        '600': '#7c3aed',
        '700': '#6d28d9',
        '800': '#5b21b6',
        '900': '#4c1d95',
        '950': '#2e1065',
    },
};

// Tailwind step mapping to our 0-1000 scale
const tailwindSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

// Utility - Convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!result) return { h: 0, s: 0, l: 50 };

    const r = parseInt(result[1]!, 16) / 255;
    const g = parseInt(result[2]!, 16) / 255;
    const b = parseInt(result[3]!, 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if(max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

// Utility - Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if(0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if(60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if(120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if(180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if(240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if(300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = function (n: number) {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Utility - Generate color scale from a base color
function generateColorScale(baseHex: string): Record<string, string> {
    const baseHsl = hexToHsl(baseHex);
    const scale: Record<string, string> = {};

    // 500 is the base color
    // Lower numbers = lighter (higher lightness)
    // Higher numbers = darker (lower lightness)
    generatorSteps.forEach(function (step) {
        const stepNum = parseInt(step);

        // Calculate lightness adjustment
        // At step 0: lightness should be very high (around 95-98%)
        // At step 500: lightness is base
        // At step 1000: lightness should be very low (around 5-10%)

        let lightness: number;
        let saturation = baseHsl.s;

        if(stepNum <= 500) {
            // Lighter shades (0-500)
            // Map 0-500 to high-base lightness
            const factor = stepNum / 500;
            const maxLight = 97; // Lightest possible
            lightness = maxLight - factor * (maxLight - baseHsl.l);
            // Reduce saturation slightly for very light colors
            saturation = baseHsl.s * (0.3 + factor * 0.7);
        }
        else {
            // Darker shades (500-1000)
            // Map 500-1000 to base-low lightness
            const factor = (stepNum - 500) / 500;
            const minLight = 8; // Darkest possible
            lightness = baseHsl.l - factor * (baseHsl.l - minLight);
            // Adjust saturation for dark colors
            saturation = baseHsl.s * (1 - factor * 0.3);
        }

        scale[step] = hslToHex(baseHsl.h, saturation, lightness);
    });

    return scale;
}

// Utility - Generate CSS variable output
function generateCssOutput(scaleName: string, scale: Record<string, string>): string {
    let output = `/* ${scaleName} Scale */\n`;
    generatorSteps.forEach(function (step) {
        output += `--color-${scaleName.toLowerCase()}-${step}: ${scale[step]};\n`;
    });
    return output;
}

// Component - Section Header
function SectionHeader(properties: { title: string; description?: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-base font-semibold content--0">{properties.title}</h2>
            {properties.description && <p className="mt-1 text-sm content--3">{properties.description}</p>}
        </div>
    );
}

// Component - Color Scale Generator
function ColorScaleGenerator() {
    const [scaleName, setScaleName] = React.useState('custom');
    const [baseColor, setBaseColor] = React.useState('#3b82f6'); // Default to blue-500
    const [generatedScale, setGeneratedScale] = React.useState<Record<string, string>>({});
    const [showCss, setShowCss] = React.useState(false);

    // Button preview state - Light mode
    const [lightBgStep, setLightBgStep] = React.useState('650');
    const [lightBorderStep, setLightBorderStep] = React.useState('750');
    const [lightHoverBgStep, setLightHoverBgStep] = React.useState('600');
    const [lightHoverBorderStep, setLightHoverBorderStep] = React.useState('700');
    const [lightActiveBgStep, setLightActiveBgStep] = React.useState('500');
    const [lightActiveBorderStep, setLightActiveBorderStep] = React.useState('600');

    // Button preview state - Dark mode
    const [darkBgStep, setDarkBgStep] = React.useState('900');
    const [darkBorderStep, setDarkBorderStep] = React.useState('800');
    const [darkHoverBgStep, setDarkHoverBgStep] = React.useState('850');
    const [darkHoverBorderStep, setDarkHoverBorderStep] = React.useState('750');
    const [darkActiveBgStep, setDarkActiveBgStep] = React.useState('800');
    const [darkActiveBorderStep, setDarkActiveBorderStep] = React.useState('700');

    // Active property selection for click-to-set
    type ButtonProperty =
        | 'lightBg'
        | 'lightBorder'
        | 'lightHoverBg'
        | 'lightHoverBorder'
        | 'lightActiveBg'
        | 'lightActiveBorder'
        | 'darkBg'
        | 'darkBorder'
        | 'darkHoverBg'
        | 'darkHoverBorder'
        | 'darkActiveBg'
        | 'darkActiveBorder';
    const [activeProperty, setActiveProperty] = React.useState<ButtonProperty>('lightBg');

    // Handle swatch click - sets the active property to the clicked step
    function handleSwatchClick(step: string) {
        switch(activeProperty) {
            case 'lightBg':
                setLightBgStep(step);
                break;
            case 'lightBorder':
                setLightBorderStep(step);
                break;
            case 'lightHoverBg':
                setLightHoverBgStep(step);
                break;
            case 'lightHoverBorder':
                setLightHoverBorderStep(step);
                break;
            case 'lightActiveBg':
                setLightActiveBgStep(step);
                break;
            case 'lightActiveBorder':
                setLightActiveBorderStep(step);
                break;
            case 'darkBg':
                setDarkBgStep(step);
                break;
            case 'darkBorder':
                setDarkBorderStep(step);
                break;
            case 'darkHoverBg':
                setDarkHoverBgStep(step);
                break;
            case 'darkHoverBorder':
                setDarkHoverBorderStep(step);
                break;
            case 'darkActiveBg':
                setDarkActiveBgStep(step);
                break;
            case 'darkActiveBorder':
                setDarkActiveBorderStep(step);
                break;
        }
    }

    // Generate scale on mount and when base color changes
    React.useEffect(
        function () {
            const scale = generateColorScale(baseColor);
            setGeneratedScale(scale);
        },
        [baseColor],
    );

    // Handle base color change
    function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
        setBaseColor(event.target.value);
    }

    // Handle scale name change
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setScaleName(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    }

    // Copy CSS to clipboard
    function handleCopyCss() {
        const css = generateCssOutput(scaleName, generatedScale);
        navigator.clipboard.writeText(css);
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
                {/* Color Picker */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs content--3">Base Color (500)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={baseColor}
                            onChange={handleColorChange}
                            className="h-10 w-16 cursor-pointer rounded border border--0 background--0"
                        />
                        <input
                            type="text"
                            value={baseColor}
                            onChange={function (event) {
                                const value = event.target.value;
                                if(/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                    setBaseColor(value);
                                }
                            }}
                            className="h-10 w-24 rounded border border--0 background--1 px-2 font-mono text-sm content--0"
                            placeholder="#000000"
                        />
                    </div>
                </div>

                {/* Scale Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs content--3">Scale Name</label>
                    <input
                        type="text"
                        value={scaleName}
                        onChange={handleNameChange}
                        className="h-10 w-32 rounded border border--0 background--1 px-2 font-mono text-sm content--0"
                        placeholder="custom"
                    />
                </div>

                {/* Preset Colors */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs content--3">Presets</label>
                    <div className="flex gap-1">
                        {[
                            { color: '#3b82f6', name: 'Blue' },
                            { color: '#22c55e', name: 'Green' },
                            { color: '#ef4444', name: 'Red' },
                            { color: '#f97316', name: 'Orange' },
                            { color: '#a855f7', name: 'Purple' },
                            { color: '#ec4899', name: 'Pink' },
                            { color: '#14b8a6', name: 'Teal' },
                            { color: '#eab308', name: 'Yellow' },
                        ].map(function (preset) {
                            return (
                                <button
                                    key={preset.color}
                                    onClick={function () {
                                        setBaseColor(preset.color);
                                        setScaleName(preset.name.toLowerCase());
                                    }}
                                    className="h-8 w-8 rounded border border--0 transition-transform hover:scale-110"
                                    style={{ backgroundColor: preset.color }}
                                    title={preset.name}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Generated Scale Preview */}
            <div className="overflow-hidden rounded-lg border border--0">
                {/* Generated scale label */}
                <div className="flex items-center background--1 px-3 py-1.5">
                    <span className="text-xs font-medium content--1">Generated</span>
                    <span className="ml-2 font-mono text-xs content--3">{scaleName}</span>
                </div>

                {/* Full width gradient bar */}
                <div className="flex h-12">
                    {generatorSteps.map(function (step) {
                        const color = generatedScale[step];
                        return (
                            <div
                                key={step}
                                className="group relative flex-1 cursor-pointer"
                                style={{ backgroundColor: color }}
                                title={`${step}: ${color}`}
                            >
                                {/* Tooltip on hover */}
                                <div className="absolute inset-x-0 bottom-full z-10 mb-1 hidden group-hover:block">
                                    <div className="mx-auto w-max rounded border border--0 background--0 px-2 py-1 font-mono text-[10px] content--0 shadow--3">
                                        {step}: {color}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Step labels */}
                <div className="flex background--1 py-1">
                    {generatorSteps.map(function (step) {
                        return (
                            <div key={step} className="flex-1 text-center">
                                <span className="font-mono text-[9px] content--4">{step}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Tailwind comparison scale */}
                {tailwindColors[scaleName] && (
                    <>
                        {/* Tailwind scale label */}
                        <div className="flex items-center border-t border--0 background--1 px-3 py-1.5">
                            <span className="text-xs font-medium content--1">Tailwind</span>
                            <span className="ml-2 font-mono text-xs content--3">{scaleName}</span>
                        </div>

                        {/* Tailwind gradient bar - aligned to our scale */}
                        <div className="flex h-12">
                            {generatorSteps.map(function (step) {
                                // Map our steps to Tailwind steps
                                const tailwindScale = tailwindColors[scaleName];
                                const hasTailwindColor = tailwindScale && tailwindSteps.includes(step);
                                const color = hasTailwindColor ? tailwindScale[step] : undefined;

                                return (
                                    <div
                                        key={step}
                                        className="group relative flex-1"
                                        style={{
                                            backgroundColor: color,
                                        }}
                                        title={color ? `${step}: ${color}` : `${step}: (no Tailwind value)`}
                                    >
                                        {/* Show gap indicator for steps Tailwind doesn't have */}
                                        {!hasTailwindColor && (
                                            <div className="flex h-full items-center justify-center background--2">
                                                <span className="text-[8px] content--4">—</span>
                                            </div>
                                        )}
                                        {/* Tooltip on hover */}
                                        {color && (
                                            <div className="absolute inset-x-0 bottom-full z-10 mb-1 hidden group-hover:block">
                                                <div className="mx-auto w-max rounded border border--0 background--0 px-2 py-1 font-mono text-[10px] content--0 shadow--3">
                                                    {step}: {color}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tailwind step labels */}
                        <div className="flex background--1 py-1">
                            {generatorSteps.map(function (step) {
                                const hasTailwindColor = tailwindSteps.includes(step);
                                return (
                                    <div key={step} className="flex-1 text-center">
                                        <span
                                            className={`font-mono text-[9px] ${
                                                hasTailwindColor ? 'content--4' : 'content--6'
                                            }`}
                                        >
                                            {hasTailwindColor ? step : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Detailed Swatches - Click to set active property */}
            <div className="grid grid-cols-7 gap-2">
                {generatorSteps.map(function (step) {
                    const color = generatedScale[step];
                    const stepNum = parseInt(step);
                    const isLight = stepNum < 400;

                    // Check if this step is used by any property
                    const isLightBg = lightBgStep === step;
                    const isLightBorder = lightBorderStep === step;
                    const isLightHoverBg = lightHoverBgStep === step;
                    const isLightHoverBorder = lightHoverBorderStep === step;
                    const isLightActiveBg = lightActiveBgStep === step;
                    const isLightActiveBorder = lightActiveBorderStep === step;
                    const isDarkBg = darkBgStep === step;
                    const isDarkBorder = darkBorderStep === step;
                    const isDarkHoverBg = darkHoverBgStep === step;
                    const isDarkHoverBorder = darkHoverBorderStep === step;
                    const isDarkActiveBg = darkActiveBgStep === step;
                    const isDarkActiveBorder = darkActiveBorderStep === step;

                    // Check if active property matches this step
                    const isActiveStep =
                        (activeProperty === 'lightBg' && isLightBg) ||
                        (activeProperty === 'lightBorder' && isLightBorder) ||
                        (activeProperty === 'lightHoverBg' && isLightHoverBg) ||
                        (activeProperty === 'lightHoverBorder' && isLightHoverBorder) ||
                        (activeProperty === 'lightActiveBg' && isLightActiveBg) ||
                        (activeProperty === 'lightActiveBorder' && isLightActiveBorder) ||
                        (activeProperty === 'darkBg' && isDarkBg) ||
                        (activeProperty === 'darkBorder' && isDarkBorder) ||
                        (activeProperty === 'darkHoverBg' && isDarkHoverBg) ||
                        (activeProperty === 'darkHoverBorder' && isDarkHoverBorder) ||
                        (activeProperty === 'darkActiveBg' && isDarkActiveBg) ||
                        (activeProperty === 'darkActiveBorder' && isDarkActiveBorder);

                    return (
                        <button
                            key={step}
                            type="button"
                            onClick={function () {
                                handleSwatchClick(step);
                            }}
                            className="overflow-hidden rounded-lg border-2 text-left transition-all hover:scale-105"
                            style={{
                                backgroundColor: color,
                                borderColor: isActiveStep ? '#3b82f6' : 'transparent',
                            }}
                        >
                            <div className="flex h-16 flex-col justify-end p-2">
                                <p
                                    className="font-mono text-[10px] font-medium"
                                    style={{ color: isLight ? '#000000' : '#ffffff' }}
                                >
                                    {step}
                                </p>
                                <p
                                    className="font-mono text-[9px]"
                                    style={{ color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}
                                >
                                    {color}
                                </p>
                                {/* Indicators for which properties use this step */}
                                <div className="mt-1 flex flex-wrap gap-0.5">
                                    {isLightBg && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" title="Light BG" />
                                    )}
                                    {isLightBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-white"
                                            title="Light Border"
                                        />
                                    )}
                                    {isLightHoverBg && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" title="Light Hover BG" />
                                    )}
                                    {isLightHoverBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-white/60"
                                            title="Light Hover Border"
                                        />
                                    )}
                                    {isLightActiveBg && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full bg-white/40"
                                            title="Light Active BG"
                                        />
                                    )}
                                    {isLightActiveBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-white/40"
                                            title="Light Active Border"
                                        />
                                    )}
                                    {isDarkBg && <span className="h-1.5 w-1.5 rounded-full bg-black" title="Dark BG" />}
                                    {isDarkBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-black"
                                            title="Dark Border"
                                        />
                                    )}
                                    {isDarkHoverBg && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-black/60" title="Dark Hover BG" />
                                    )}
                                    {isDarkHoverBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-black/60"
                                            title="Dark Hover Border"
                                        />
                                    )}
                                    {isDarkActiveBg && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-black/40" title="Dark Active BG" />
                                    )}
                                    {isDarkActiveBorder && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full border border-black/40"
                                            title="Dark Active Border"
                                        />
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Button Preview */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium content--1">
                    Button Preview — Click a property below, then click a swatch above
                </h3>

                {/* Helper Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Sync Buttons */}
                    <div className="flex items-center gap-1 rounded border border--0 p-1">
                        <span className="px-2 text-xs content--3">Sync:</span>
                        <button
                            type="button"
                            onClick={function () {
                                setDarkBgStep(lightBgStep);
                                setDarkBorderStep(lightBorderStep);
                                setDarkHoverBgStep(lightHoverBgStep);
                                setDarkHoverBorderStep(lightHoverBorderStep);
                                setDarkActiveBgStep(lightActiveBgStep);
                                setDarkActiveBorderStep(lightActiveBorderStep);
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            Light → Dark
                        </button>
                        <button
                            type="button"
                            onClick={function () {
                                setLightBgStep(darkBgStep);
                                setLightBorderStep(darkBorderStep);
                                setLightHoverBgStep(darkHoverBgStep);
                                setLightHoverBorderStep(darkHoverBorderStep);
                                setLightActiveBgStep(darkActiveBgStep);
                                setLightActiveBorderStep(darkActiveBorderStep);
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            Dark → Light
                        </button>
                    </div>

                    {/* Shift Buttons */}
                    <div className="flex items-center gap-1 rounded border border--0 p-1">
                        <span className="px-2 text-xs content--3">Shift Light:</span>
                        <button
                            type="button"
                            onClick={function () {
                                const shift = function (step: string) {
                                    const newVal = Math.max(0, parseInt(step) - 50);
                                    return String(newVal);
                                };
                                setLightBgStep(shift(lightBgStep));
                                setLightBorderStep(shift(lightBorderStep));
                                setLightHoverBgStep(shift(lightHoverBgStep));
                                setLightHoverBorderStep(shift(lightHoverBorderStep));
                                setLightActiveBgStep(shift(lightActiveBgStep));
                                setLightActiveBorderStep(shift(lightActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            −50
                        </button>
                        <button
                            type="button"
                            onClick={function () {
                                const shift = function (step: string) {
                                    const newVal = Math.min(1000, parseInt(step) + 50);
                                    return String(newVal);
                                };
                                setLightBgStep(shift(lightBgStep));
                                setLightBorderStep(shift(lightBorderStep));
                                setLightHoverBgStep(shift(lightHoverBgStep));
                                setLightHoverBorderStep(shift(lightHoverBorderStep));
                                setLightActiveBgStep(shift(lightActiveBgStep));
                                setLightActiveBorderStep(shift(lightActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            +50
                        </button>
                    </div>

                    <div className="flex items-center gap-1 rounded border border--0 p-1">
                        <span className="px-2 text-xs content--3">Shift Dark:</span>
                        <button
                            type="button"
                            onClick={function () {
                                const shift = function (step: string) {
                                    const newVal = Math.max(0, parseInt(step) - 50);
                                    return String(newVal);
                                };
                                setDarkBgStep(shift(darkBgStep));
                                setDarkBorderStep(shift(darkBorderStep));
                                setDarkHoverBgStep(shift(darkHoverBgStep));
                                setDarkHoverBorderStep(shift(darkHoverBorderStep));
                                setDarkActiveBgStep(shift(darkActiveBgStep));
                                setDarkActiveBorderStep(shift(darkActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            −50
                        </button>
                        <button
                            type="button"
                            onClick={function () {
                                const shift = function (step: string) {
                                    const newVal = Math.min(1000, parseInt(step) + 50);
                                    return String(newVal);
                                };
                                setDarkBgStep(shift(darkBgStep));
                                setDarkBorderStep(shift(darkBorderStep));
                                setDarkHoverBgStep(shift(darkHoverBgStep));
                                setDarkHoverBorderStep(shift(darkHoverBorderStep));
                                setDarkActiveBgStep(shift(darkActiveBgStep));
                                setDarkActiveBorderStep(shift(darkActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            +50
                        </button>
                    </div>

                    {/* Mirror/Flip Buttons */}
                    <div className="flex items-center gap-1 rounded border border--0 p-1">
                        <span className="px-2 text-xs content--3">Mirror (500):</span>
                        <button
                            type="button"
                            onClick={function () {
                                const mirror = function (step: string) {
                                    // Mirror around 500: 600 → 400, 700 → 300, etc.
                                    const val = parseInt(step);
                                    const mirrored = 1000 - val;
                                    return String(Math.max(0, Math.min(1000, mirrored)));
                                };
                                setLightBgStep(mirror(lightBgStep));
                                setLightBorderStep(mirror(lightBorderStep));
                                setLightHoverBgStep(mirror(lightHoverBgStep));
                                setLightHoverBorderStep(mirror(lightHoverBorderStep));
                                setLightActiveBgStep(mirror(lightActiveBgStep));
                                setLightActiveBorderStep(mirror(lightActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            Flip Light
                        </button>
                        <button
                            type="button"
                            onClick={function () {
                                const mirror = function (step: string) {
                                    const val = parseInt(step);
                                    const mirrored = 1000 - val;
                                    return String(Math.max(0, Math.min(1000, mirrored)));
                                };
                                setDarkBgStep(mirror(darkBgStep));
                                setDarkBorderStep(mirror(darkBorderStep));
                                setDarkHoverBgStep(mirror(darkHoverBgStep));
                                setDarkHoverBorderStep(mirror(darkHoverBorderStep));
                                setDarkActiveBgStep(mirror(darkActiveBgStep));
                                setDarkActiveBorderStep(mirror(darkActiveBorderStep));
                            }}
                            className="rounded background--2 px-2 py-1 text-xs font-medium content--1 transition-colors hover:background--3"
                        >
                            Flip Dark
                        </button>
                    </div>
                </div>

                {/* Light/Dark Mode Preview Boxes with individual controls */}
                <div className="flex gap-4">
                    {/* Light Mode Column */}
                    <div className="flex-1 space-y-3">
                        {/* Light Mode Property Buttons - 2 column grid */}
                        <div className="grid grid-cols-2 gap-1">
                            {/* Default Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[lightBgStep] }}
                                />
                                BG: {lightBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[lightBorderStep] }}
                                />
                                Border: {lightBorderStep}
                            </button>
                            {/* Hover Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightHoverBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightHoverBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[lightHoverBgStep] }}
                                />
                                Hover BG: {lightHoverBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightHoverBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightHoverBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[lightHoverBorderStep] }}
                                />
                                Hover Border: {lightHoverBorderStep}
                            </button>
                            {/* Active Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightActiveBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightActiveBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[lightActiveBgStep] }}
                                />
                                Active BG: {lightActiveBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('lightActiveBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'lightActiveBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[lightActiveBorderStep] }}
                                />
                                Active Border: {lightActiveBorderStep}
                            </button>
                        </div>

                        {/* Light Mode Box */}
                        <div className="rounded-lg border border--0 background--0 p-8 scheme-light">
                            <p className="mb-4 text-center text-xs font-medium content--2">Light Mode</p>
                            <div className="flex justify-center">
                                <button
                                    className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        backgroundColor: generatedScale[lightBgStep],
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: generatedScale[lightBorderStep],
                                        color: '#ffffff',
                                    }}
                                    onMouseEnter={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[lightHoverBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[lightHoverBorderStep] || '';
                                    }}
                                    onMouseLeave={function (event) {
                                        event.currentTarget.style.backgroundColor = generatedScale[lightBgStep] || '';
                                        event.currentTarget.style.borderColor = generatedScale[lightBorderStep] || '';
                                    }}
                                    onMouseDown={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[lightActiveBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[lightActiveBorderStep] || '';
                                    }}
                                    onMouseUp={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[lightHoverBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[lightHoverBorderStep] || '';
                                    }}
                                >
                                    Button Text
                                </button>
                            </div>
                            <p className="mt-4 text-center font-mono text-[10px] content--4">
                                bg: {lightBgStep} / border: {lightBorderStep}
                            </p>
                        </div>
                    </div>

                    {/* Dark Mode Column */}
                    <div className="flex-1 space-y-3">
                        {/* Dark Mode Property Buttons - 2 column grid */}
                        <div className="grid grid-cols-2 gap-1">
                            {/* Default Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[darkBgStep] }}
                                />
                                BG: {darkBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[darkBorderStep] }}
                                />
                                Border: {darkBorderStep}
                            </button>
                            {/* Hover Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkHoverBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkHoverBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[darkHoverBgStep] }}
                                />
                                Hover BG: {darkHoverBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkHoverBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkHoverBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[darkHoverBorderStep] }}
                                />
                                Hover Border: {darkHoverBorderStep}
                            </button>
                            {/* Active Row */}
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkActiveBg');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkActiveBg'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border border-white/30"
                                    style={{ backgroundColor: generatedScale[darkActiveBgStep] }}
                                />
                                Active BG: {darkActiveBgStep}
                            </button>
                            <button
                                type="button"
                                onClick={function () {
                                    setActiveProperty('darkActiveBorder');
                                }}
                                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    activeProperty === 'darkActiveBorder'
                                        ? 'bg-blue-500 text-white'
                                        : 'background--2 content--1 hover:background--3'
                                }`}
                            >
                                <span
                                    className="h-3 w-3 rounded border-2"
                                    style={{ borderColor: generatedScale[darkActiveBorderStep] }}
                                />
                                Active Border: {darkActiveBorderStep}
                            </button>
                        </div>

                        {/* Dark Mode Box */}
                        <div className="rounded-lg border border--0 background--0 p-8 scheme-dark">
                            <p className="mb-4 text-center text-xs font-medium content--2">Dark Mode</p>
                            <div className="flex justify-center">
                                <button
                                    className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        backgroundColor: generatedScale[darkBgStep],
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: generatedScale[darkBorderStep],
                                        color: '#ffffff',
                                    }}
                                    onMouseEnter={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[darkHoverBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[darkHoverBorderStep] || '';
                                    }}
                                    onMouseLeave={function (event) {
                                        event.currentTarget.style.backgroundColor = generatedScale[darkBgStep] || '';
                                        event.currentTarget.style.borderColor = generatedScale[darkBorderStep] || '';
                                    }}
                                    onMouseDown={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[darkActiveBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[darkActiveBorderStep] || '';
                                    }}
                                    onMouseUp={function (event) {
                                        event.currentTarget.style.backgroundColor =
                                            generatedScale[darkHoverBgStep] || '';
                                        event.currentTarget.style.borderColor =
                                            generatedScale[darkHoverBorderStep] || '';
                                    }}
                                >
                                    Button Text
                                </button>
                            </div>
                            <p className="mt-4 text-center font-mono text-[10px] content--4">
                                bg: {darkBgStep} / border: {darkBorderStep}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Output */}
            <div>
                <button
                    onClick={function () {
                        setShowCss(!showCss);
                    }}
                    className="text-sm content--1 transition-colors hover:content--0"
                >
                    {showCss ? 'Hide' : 'Show'} CSS Variables
                </button>

                {showCss && (
                    <div className="relative mt-3">
                        <pre className="overflow-x-auto rounded-lg border border--0 background--2 p-4 font-mono text-xs content--1">
                            {generateCssOutput(scaleName, generatedScale)}
                        </pre>
                        <button
                            onClick={handleCopyCss}
                            className="absolute top-2 right-2 rounded-md background--3 px-2 py-1 text-xs content--1 transition-colors hover:background--4"
                        >
                            Copy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Component - Color Swatch Row (side-by-side light/dark)
function ColorSwatchRow(properties: {
    step: string;
    lightHex: string;
    darkHex: string;
    lightPrimitive: string;
    darkPrimitive: string;
    type: 'content' | 'background' | 'border';
}) {
    const displayStep = properties.step.startsWith('-') ? `-${properties.step}` : `--${properties.step}`;

    return (
        <div className="flex items-stretch gap-2">
            {/* Step Label */}
            <div className="flex w-12 shrink-0 items-center justify-end pr-2">
                <span className="font-mono text-xs content--3">{displayStep}</span>
            </div>

            {/* Light Mode Swatch */}
            <div className="flex flex-1 items-center gap-2 rounded-md background--1 p-2 scheme-light">
                {properties.type === 'content' && (
                    <div className="h-8 w-8 shrink-0 rounded" style={{ backgroundColor: properties.lightHex }} />
                )}
                {properties.type === 'background' && (
                    <div
                        className="h-8 w-8 shrink-0 rounded border border--0"
                        style={{ backgroundColor: properties.lightHex }}
                    />
                )}
                {properties.type === 'border' && (
                    <div
                        className="h-8 w-8 shrink-0 rounded background--0"
                        style={{ border: `2px solid ${properties.lightHex}` }}
                    />
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs content--0">{properties.lightHex}</p>
                    <p className="truncate font-mono text-[10px] content--4">{properties.lightPrimitive}</p>
                </div>
            </div>

            {/* Dark Mode Swatch */}
            <div className="flex flex-1 items-center gap-2 rounded-md background--1 p-2 scheme-dark">
                {properties.type === 'content' && (
                    <div className="h-8 w-8 shrink-0 rounded" style={{ backgroundColor: properties.darkHex }} />
                )}
                {properties.type === 'background' && (
                    <div
                        className="h-8 w-8 shrink-0 rounded border border--0"
                        style={{ backgroundColor: properties.darkHex }}
                    />
                )}
                {properties.type === 'border' && (
                    <div
                        className="h-8 w-8 shrink-0 rounded background--0"
                        style={{ border: `2px solid ${properties.darkHex}` }}
                    />
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs content--0">{properties.darkHex}</p>
                    <p className="truncate font-mono text-[10px] content--4">{properties.darkPrimitive}</p>
                </div>
            </div>
        </div>
    );
}

// Component - Primitive Scale Bar
function PrimitiveScaleBar(properties: {
    title: string;
    scale: Record<string, string>;
    steps: string[];
    showOnDark?: boolean;
}) {
    return (
        <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium content--1">{properties.title}</h3>
            <div
                className={`rounded-lg p-3 ${
                    properties.showOnDark ? 'background--0 scheme-dark' : 'background--0 scheme-light'
                }`}
            >
                {/* Gradient Bar */}
                <div className="flex h-10 overflow-hidden rounded-md">
                    {properties.steps.map(function (step) {
                        return (
                            <div
                                key={step}
                                className="flex-1"
                                style={{ backgroundColor: properties.scale[step] }}
                                title={`${step}: ${properties.scale[step]}`}
                            />
                        );
                    })}
                </div>
                {/* Labels */}
                <div className="mt-1 flex">
                    <span className="font-mono text-[10px] content--3">0</span>
                    <span className="flex-1" />
                    <span className="font-mono text-[10px] content--3">500</span>
                    <span className="flex-1" />
                    <span className="font-mono text-[10px] content--3">1000</span>
                </div>
            </div>
        </div>
    );
}

// Component - Semantic State Card
function SemanticStateCard(properties: { name: string; stateKey: string; lightColor: string; darkColor: string }) {
    return (
        <div className="overflow-hidden rounded-lg border border--0">
            <div className="background--1 p-3">
                <h4 className="text-sm font-medium content--0 capitalize">{properties.name}</h4>
            </div>
            <div className="flex">
                {/* Light Mode */}
                <div className="flex-1 background--0 p-3 scheme-light">
                    <div className="space-y-2">
                        <div className="h-6 rounded" style={{ backgroundColor: properties.lightColor }} />
                        <div
                            className="h-6 rounded background--1"
                            style={{ border: `2px solid ${properties.lightColor}` }}
                        />
                        <p style={{ color: properties.lightColor }} className="text-sm font-medium">
                            Sample text
                        </p>
                    </div>
                    <p className="mt-2 font-mono text-[10px] content--4">{properties.lightColor}</p>
                </div>
                {/* Dark Mode */}
                <div className="flex-1 background--0 p-3 scheme-dark">
                    <div className="space-y-2">
                        <div className="h-6 rounded" style={{ backgroundColor: properties.darkColor }} />
                        <div
                            className="h-6 rounded background--1"
                            style={{ border: `2px solid ${properties.darkColor}` }}
                        />
                        <p style={{ color: properties.darkColor }} className="text-sm font-medium">
                            Sample text
                        </p>
                    </div>
                    <p className="mt-2 font-mono text-[10px] content--4">{properties.darkColor}</p>
                </div>
            </div>
        </div>
    );
}

// Component - OpsDesignColorsPage
export function OpsDesignColorsPage() {
    // Render the component
    return (
        <div className="space-y-12">
            {/* Section 0: Color Scale Generator */}
            <section>
                <SectionHeader
                    title="Color Scale Generator"
                    description="Generate a complete 0-1000 color scale from a single base color. Pick your brand color at the 500 position and the scale expands in both directions."
                />
                <ColorScaleGenerator />
            </section>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs content--3">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border--0 background--1 scheme-light" />
                    <span>Light Mode</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border--0 background--1 scheme-dark" />
                    <span>Dark Mode</span>
                </div>
            </div>

            {/* Section 1: Semantic Utilities */}
            <section>
                <SectionHeader
                    title="Semantic Utilities"
                    description="Design system color scales for content, backgrounds, and borders. Scale goes from ---3 (beyond base) through --0 (base) to --10 (maximum)."
                />

                {/* Content Colors */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium content--1">
                        Content <span className="font-mono content--4">content--*</span>
                    </h3>
                    <div className="space-y-1">
                        {semanticSteps.map(function (step) {
                            const data = contentColors[step]!;
                            return (
                                <ColorSwatchRow
                                    key={step}
                                    step={step}
                                    lightHex={data.light}
                                    darkHex={data.dark}
                                    lightPrimitive={data.lightPrimitive}
                                    darkPrimitive={data.darkPrimitive}
                                    type="content"
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Background Colors */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium content--1">
                        Background <span className="font-mono content--4">background--*</span>
                    </h3>
                    <div className="space-y-1">
                        {semanticSteps.map(function (step) {
                            const data = backgroundColors[step]!;
                            return (
                                <ColorSwatchRow
                                    key={step}
                                    step={step}
                                    lightHex={data.light}
                                    darkHex={data.dark}
                                    lightPrimitive={data.lightPrimitive}
                                    darkPrimitive={data.darkPrimitive}
                                    type="background"
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Border Colors */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium content--1">
                        Border <span className="font-mono content--4">border--*</span>
                    </h3>
                    <div className="space-y-1">
                        {semanticSteps.map(function (step) {
                            const data = borderColors[step]!;
                            return (
                                <ColorSwatchRow
                                    key={step}
                                    step={step}
                                    lightHex={data.light}
                                    darkHex={data.dark}
                                    lightPrimitive={data.lightPrimitive}
                                    darkPrimitive={data.darkPrimitive}
                                    type="border"
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section 2: Semantic States */}
            <section>
                <SectionHeader
                    title="Semantic States"
                    description="Status colors for feedback, alerts, and interactive states."
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(semanticStates).map(function ([key, value]) {
                        return (
                            <SemanticStateCard
                                key={key}
                                name={key}
                                stateKey={key}
                                lightColor={value.light}
                                darkColor={value.dark}
                            />
                        );
                    })}
                </div>

                {/* Special States */}
                <div className="mt-6">
                    <h3 className="mb-3 text-sm font-medium content--1">Special States</h3>
                    <div className="flex gap-4">
                        <div className="flex-1 rounded-lg border border--0 background--0 p-4 scheme-light">
                            <p className="mb-1 text-sm content--placeholder">Placeholder text</p>
                            <p className="font-mono text-[10px] content--4">content--placeholder</p>
                        </div>
                        <div className="flex-1 rounded-lg border border--0 background--0 p-4 scheme-dark">
                            <p className="mb-1 text-sm content--placeholder">Placeholder text</p>
                            <p className="font-mono text-[10px] content--4">content--placeholder</p>
                        </div>
                    </div>
                    <div className="mt-2 flex gap-4">
                        <div className="flex-1 rounded-lg border border--0 background--0 p-4 scheme-light">
                            <p className="mb-1 text-sm content--disabled">Disabled text</p>
                            <p className="font-mono text-[10px] content--4">content--disabled</p>
                        </div>
                        <div className="flex-1 rounded-lg border border--0 background--0 p-4 scheme-dark">
                            <p className="mb-1 text-sm content--disabled">Disabled text</p>
                            <p className="font-mono text-[10px] content--4">content--disabled</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Brand Colors */}
            <section>
                <SectionHeader title="Brand Colors" description="Primary brand color scale and interactive states." />
                <PrimitiveScaleBar title="Blue Scale" scale={blueScale} steps={primitiveScaleSteps} />

                {/* Brand States */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border--0 p-4">
                        <div className="mb-2 scheme-light">
                            <div className="h-10 rounded bg-brand" />
                        </div>
                        <div className="scheme-dark">
                            <div className="h-10 rounded bg-brand" />
                        </div>
                        <p className="mt-2 text-center font-mono text-xs content--3">brand</p>
                    </div>
                    <div className="rounded-lg border border--0 p-4">
                        <div className="mb-2 scheme-light">
                            <div className="h-10 rounded bg-brand-hover" />
                        </div>
                        <div className="scheme-dark">
                            <div className="h-10 rounded bg-brand-hover" />
                        </div>
                        <p className="mt-2 text-center font-mono text-xs content--3">brand-hover</p>
                    </div>
                    <div className="rounded-lg border border--0 p-4">
                        <div className="mb-2 scheme-light">
                            <div className="h-10 rounded bg-brand-active" />
                        </div>
                        <div className="scheme-dark">
                            <div className="h-10 rounded bg-brand-active" />
                        </div>
                        <p className="mt-2 text-center font-mono text-xs content--3">brand-active</p>
                    </div>
                </div>
            </section>

            {/* Section 4: Primitive Scales */}
            <section>
                <SectionHeader
                    title="Primitive Scales"
                    description="Raw color scales from 0-1000 used to build semantic utilities."
                />
                <PrimitiveScaleBar
                    title="White Scale (darkest to lightest)"
                    scale={whiteScale}
                    steps={primitiveScaleSteps}
                />
                <PrimitiveScaleBar
                    title="Gray Scale (lightest to darkest)"
                    scale={grayScale}
                    steps={primitiveScaleSteps}
                />
                <PrimitiveScaleBar
                    title="Black Scale (lightest to darkest)"
                    scale={blackScale}
                    steps={primitiveScaleSteps}
                />

                {/* Transparency Scales */}
                <div className="mt-6">
                    <h3 className="mb-3 text-sm font-medium content--1">Transparency Scales</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg background--0 p-4 scheme-dark">
                            <p className="mb-2 text-xs content--0">Light Scale (on dark)</p>
                            <div className="flex h-8 overflow-hidden rounded-md">
                                {['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'].map(
                                    function (step) {
                                        const opacity = parseInt(step) / 1000;
                                        return (
                                            <div
                                                key={step}
                                                className="flex-1"
                                                style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
                                                title={`light-${step}`}
                                            />
                                        );
                                    },
                                )}
                            </div>
                            <div className="mt-1 flex font-mono text-[10px] content--4">
                                <span>0%</span>
                                <span className="flex-1" />
                                <span>50%</span>
                                <span className="flex-1" />
                                <span>100%</span>
                            </div>
                        </div>
                        <div className="rounded-lg background--0 p-4 scheme-light">
                            <p className="mb-2 text-xs content--0">Dark Scale (on light)</p>
                            <div className="flex h-8 overflow-hidden rounded-md">
                                {['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'].map(
                                    function (step) {
                                        const opacity = parseInt(step) / 1000;
                                        return (
                                            <div
                                                key={step}
                                                className="flex-1"
                                                style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
                                                title={`dark-${step}`}
                                            />
                                        );
                                    },
                                )}
                            </div>
                            <div className="mt-1 flex font-mono text-[10px] content--4">
                                <span>0%</span>
                                <span className="flex-1" />
                                <span>50%</span>
                                <span className="flex-1" />
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Cross-Category Utilities */}
            <section>
                <SectionHeader
                    title="Cross-Category Utilities"
                    description="Advanced utilities that mix color categories."
                />
                <div className="rounded-lg border border--0 background--1 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="mb-1 font-mono content--0">border-content--*</p>
                            <p className="text-xs content--3">Use content colors for borders</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono content--0">background-content--*</p>
                            <p className="text-xs content--3">Use content colors for backgrounds</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono content--0">background-border--*</p>
                            <p className="text-xs content--3">Use border colors for backgrounds</p>
                        </div>
                        <div>
                            <p className="mb-1 font-mono content--0">content-background--*</p>
                            <p className="text-xs content--3">Use background colors for text</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
