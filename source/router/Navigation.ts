// Framework-independent navigation abstraction
//
// This module provides a standardized interface for navigation functionality that:
// 1. Decouples components from Next.js-specific APIs for better framework independence
// 2. Uses consistent naming conventions (useUrlPath vs usePathname, useUrlParameters vs useParams)
// 3. Provides a single point of control for navigation behavior across the entire application
// 4. Enables easier migration to different routing solutions in the future
// 5. Ensures all navigation imports go through this centralized abstraction layer
//
// All components should import navigation utilities from this module instead of 'next/navigation'
// to maintain consistency and enable future framework flexibility.

export {
    redirect,
    useRouter,
    usePathname as useUrlPath,
    useParams as useUrlParameters,
    useSearchParams as useUrlSearchParameters,
    RedirectType,
    notFound,
} from 'next/navigation';
