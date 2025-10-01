import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export interface SubNavItemProps {
    label: string;
    href: string;
    isActive?: boolean;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ label, href, isActive = false }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Check if this submenu item is active based on both pathname and query parameter
    const TypeName = searchParams?.get('name') || '';
    const currentSection = pathname?.split('?')[0]; // Get the base path without query parameters
    const targetSection = href.split('?')[0]; // Get the target path without query parameters

    const isCurrentActive = isActive || (
        currentSection === targetSection && // Check if we're in the correct section
        ((label === 'Magic Portal' && TypeName === 'magic-portal') ||
            (label === 'Operation Mindfall' && TypeName === 'operation-mindfall') ||
            (label === 'Blackout' && TypeName === 'blackout'))
    );

    return (
        <Link href={href}>
            <div className={`px-4 py-1 cursor-pointer transition-colors text-sm group ${isCurrentActive
                ? 'text-[#00adee]'
                : 'text-gray-300 hover:text-[rgb(128,128,128)]'
                }`}>
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-1 h-1 rounded-full transition-all duration-500 ${isCurrentActive
                            ? 'bg-[#00adee]'
                            : 'bg-white group-hover:bg-[rgb(128,128,128)]'
                            }`}
                    ></div>
                    <span>{label}</span>
                </div>
            </div>
        </Link>
    );
};

export default SubNavItem;
