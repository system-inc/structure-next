// Dependencies - React and Next.js
import Link from 'next/link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// NavigationLink
export interface InternalNavigationLinkInterface {
    title: string;
    href: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    active?: boolean;
    links?: InternalNavigationLinkInterface[];
}
export function InternalNavigationLink(properties: InternalNavigationLinkInterface) {
    // console.log('InternalNavigationLink', properties.title, 'active', properties.active);

    // The icon component to use
    const Icon = properties.icon;

    // Render the component
    return (
        <Link
            href={properties.href}
            className={mergeClassNames(
                'group flex items-center gap-x-2 rounded-md p-1.5 text-sm leading-6',
                properties.active
                    ? // If the live is active
                      'bg-light-4 text-dark dark:bg-dark-4 dark:text-light-4'
                    : // If the link is not active
                      'text-dark hover:bg-light-4 hover:text-dark dark:bg-transparent dark:text-light-4 dark:hover:bg-dark-4',
            )}
        >
            {Icon && (
                <div className="relative h-4 w-4">
                    <Icon className="h-full w-full" />
                </div>
            )}
            <p>{properties.title}</p>
        </Link>
    );
}

// Export - Default
export default InternalNavigationLink;
