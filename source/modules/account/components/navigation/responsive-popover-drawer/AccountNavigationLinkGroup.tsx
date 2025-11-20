// // NOTE: This file is currently unused as the Account Navigation does not have link groups yet

// 'use client';

// import React from 'react';
// import { Link } from '@structure/source/components/navigation/Link';
// import { CaretRightIcon } from '@phosphor-icons/react';
// import { motion } from 'motion/react';
// import { Collapsible, transition as collapsibleTransition } from '@project/app/_components/containers/Collapsible';
// import { navigationLinks } from '@project/app/(main-layout)/_layout/navigation/data/NavigationLinks';

// export function AccountNavigationCollapsible(linkGroup: (typeof navigationLinks)[number] & { type: 'group' }) {
//     const [open, setOpen] = React.useState(false);

//     return (
//         <Collapsible
//             open={open}
//             onOpenChange={setOpen}
//             className="w-full"
//             trigger={
//                 <button className="inline-flex w-full items-center justify-start rounded p-3 font-medium capitalize transition-colors hover:bg-white-900 active:bg-white-900 dark:hover:bg-light-50 dark:active:bg-light-50 [&_svg]:inline-block">
//                     <linkGroup.icon className="mr-3 size-3" />
//                     {linkGroup.title}
//                     <span className="inline-flex grow items-center justify-end">
//                         <motion.span
//                             animate={{
//                                 transform: `rotate(${open ? 90 : 0}deg)`,
//                             }}
//                             transition={collapsibleTransition}
//                             className={'relative flex items-center justify-center'}
//                         >
//                             <CaretRightIcon className="size-4 content--4" />
//                         </motion.span>
//                     </span>
//                 </button>
//             }
//             content={
//                 <div className="ml-7 flex flex-col gap-2 pt-2 content--4 transition-colors">
//                     {linkGroup.links.map(function (link, linkIndex) {
//                         return (
//                             <li key={linkIndex} className="w-full">
//                                 <Link
//                                     href={link.href}
//                                     // onClick={() => setOpen(false)}
//                                     className="block rounded p-3 font-medium capitalize transition-colors hover:bg-white-900 active:bg-white-900 dark:hover:bg-light-50 dark:active:bg-light-50 [&_svg]:mr-3 [&_svg]:inline-block"
//                                 >
//                                     {link.icon && <link.icon />}
//                                     {link.title}
//                                 </Link>
//                             </li>
//                         );
//                     })}
//                 </div>
//             }
//         />
//     );
// }
