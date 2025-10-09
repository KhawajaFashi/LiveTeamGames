import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SubNavItem from './SubNavItem';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    hasChevron?: boolean;
    isCollapsed?: boolean;
    href?: string;
    children?: React.ReactNode;
    pathname?: string;
    expandedItem?: string | null;
    setExpandedItem?: (item: string | null) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, hasChevron = false, isCollapsed = false, href, children, pathname, expandedItem, setExpandedItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [userManuallyClosed, setUserManuallyClosed] = useState(false);
    const [maxHeight, setMaxHeight] = useState('0px');
    const childrenRef = React.useRef<HTMLDivElement>(null);

    // Check if we're on any games page to keep Games menu open
    const isOnGamesPage = pathname === '/games';
    const shouldKeepGamesOpen = label === 'Games' && isOnGamesPage;

    const isOnOperatorPage = pathname === '/operator';
    const shouldKeepOperatorOpen = label === 'Live Operator' && isOnOperatorPage;

    const isOnHighScorePage = pathname === '/highscores';
    const shouldKeepHighScoreOpen = label === 'Highscores' && isOnHighScorePage;

    // Auto-expand menu when on same pages and handle collapsing when another item is expanded
    useEffect(() => {
        // If this item is the expanded item, expand it
        if (expandedItem === label) {
            setIsExpanded(true);
            setUserManuallyClosed(false);
        }
        // If another item is expanded, collapse this one
        else if (expandedItem && expandedItem !== label) {
            setIsExpanded(false);
            setUserManuallyClosed(true);
        }
        // Auto-expand based on page URL (only if no item is manually expanded)
        else if (!expandedItem) {
            if (shouldKeepGamesOpen && !userManuallyClosed) {
                setIsExpanded(true);
            }
            if (shouldKeepOperatorOpen && !userManuallyClosed) {
                setIsExpanded(true);
            }
            if (shouldKeepHighScoreOpen && !userManuallyClosed) {
                setIsExpanded(true);
            }
        }
    }, [shouldKeepGamesOpen, shouldKeepOperatorOpen, shouldKeepHighScoreOpen, userManuallyClosed, expandedItem, label]);

    // Reset manual close state when navigating away from games
    useEffect(() => {
        if (!isOnGamesPage && label === 'Games') {
            setUserManuallyClosed(false);
        }
        if (!isOnOperatorPage && label === 'Live Operator') {
            setUserManuallyClosed(false);
        }
        if (!isOnHighScorePage && label === 'Highscores') {
            setUserManuallyClosed(false);
        }
    }, [isOnGamesPage, isOnOperatorPage, isOnHighScorePage, label]);

    // Animate maxHeight for children expansion/collapse
    useEffect(() => {
        if (childrenRef.current) {
            if (isExpanded && !isCollapsed) {
                setMaxHeight(childrenRef.current.scrollHeight + 'px');
            } else {
                setMaxHeight('0px');
            }
        }
    }, [isExpanded, isCollapsed, children]);

    const handleClick = () => {
        if (hasChevron && !isCollapsed) {

            // If we're clicking the currently expanded item
            if (expandedItem === label) {
                if (setExpandedItem) setExpandedItem(null);
                setIsExpanded(false);
                setUserManuallyClosed(true);
            }
            // If we're clicking a different item
            else {
                if (setExpandedItem) setExpandedItem(label);
                setIsExpanded(true);
                setUserManuallyClosed(false);
            }
        }
    };

    const content = (
        <div
            className={`flex items-center justify-between px-6 py-2 rounded-lg cursor-pointer transition-colors ${isActive
                ? 'text-[var(--color-primary)]'
                : 'text-white hover:text-[var(--color-secondary)]'
                } ${!isCollapsed ? 'hover:bg-[rgba(128,128,128,0.3)]' : ''}`}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-3">
                <span className="text-md">{icon}</span>
                {!isCollapsed && <span style={{ fontSize: '12px' }}>{label}</span>}
            </div>
            {hasChevron && !isCollapsed && (
                <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </div>
    );


    return (
        <div>
            {href ? (
                <Link href={href} target={`${href === "" ? '_blank' : ''}`}>
                    {content}
                </Link>
            ) : (
                content
            )}
            {/* Animated children expansion */}
            <div
                ref={childrenRef}
                style={{
                    maxHeight: children && isExpanded && !isCollapsed ? maxHeight : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className={`ml-6 ${children && isExpanded && !isCollapsed ? 'mt-2' : ''} space-y-1`}
            >
                {children}
            </div>
        </div>
    );
};


interface CollapsibleSidebarProps {
    isSidebarOpen?: boolean;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ isSidebarOpen = true }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className={`bg-[var(--color-background-dark)] h-full flex flex-col transition-[var(--transition-normal)] ${isCollapsed ? 'w-16' : ''
            } ${!isSidebarOpen ? 'max-xl:hidden' : 'max-xl:fixed max-xl:z-10'}`}>
            {/* Logo Section */}
            <div className="xl:flex items-center justify-between px-4 py-2 hidden">
                {!isCollapsed && (
                    <Image
                        src="/clutivity_logo.png"
                        alt="Logo"
                        width={2600}
                        height={2600}
                        className='w-48 h-10 mr-6'
                    />
                )}
                <button className={`text-white ${isCollapsed ? 'p-2.5' : ''}`} onClick={toggleSidebar} >
                    <span className="group flex flex-col justify-between w-5 h-[18px] cursor-pointer ">
                        <span className={`block h-[1px] bg-white rounded transition-all duration-500 ${isCollapsed ? 'group-hover:w-5 w-3' : 'group-hover:w-5 w-3'
                            }`}></span>
                        <span className="block h-[1px] bg-white rounded transition-all duration-500 w-5"></span>
                        <span className={`block h-[1px] bg-white rounded transition-all duration-500 ${isCollapsed ? 'group-hover:w-5 w-4' : 'group-hover:w-5 w-4'
                            }`}></span>
                    </span>
                </button>
            </div>
            {/* Navigation Items */}
            <nav className='max-xl:pt-5'>
                <NavItem
                    icon={
                        <i className="m-menu__link-icon nyicn">
                            <svg className='w-5 h-5' fill='white' data-name="Capa 1" id="Capa_1" viewBox="0 0 512 458.05" xmlns="http://www.w3.org/2000/svg">
                                <defs></defs>
                                <title>computer</title>
                                <path className="cls-1" d="M440.43,27H71.57C37,27,0,45.8,0,98.55v247.3c0,52.74,37,71.57,71.57,71.57H208.1V463H185.42a11,11,0,1,0,0,22H330.76a11,11,0,1,0,0-22H303.9V417.42H440.43c52.74,0,71.57-37,71.57-71.57V98.55C512,45.8,475,27,440.43,27ZM281.88,463H230.12V417.42h51.75V463ZM490,345.85c0,14.86-4.84,49.55-49.55,49.55H71.57C56.71,395.4,22,390.55,22,345.85V330.1H490Zm0-37.66H22V99c0-44.7,34.68-49.55,49.55-49.55H440.43C455.29,49.44,490,54.28,490,99Z" transform="translate(0 -26.98)"></path>
                                <path className="cls-1" d="M434.5,78.95a11,11,0,0,0-15.42,2.19v0h.55L337.48,191.26l-38.54-50.1a11,11,0,0,0-17-.55L219.22,212l-46-78.62a11,11,0,0,0-18.83-.11L78.4,256a11,11,0,1,0,18.72,11l66.06-107.69,44,75.86A11,11,0,0,0,224.95,237L289,165.27l39.31,51.09a12.77,12.77,0,0,0,8.81,4.29,11,11,0,0,0,8.7-4.4L436.69,94.36A11,11,0,0,0,434.5,78.95Z" transform="translate(0 -26.98)"></path>
                            </svg>
                        </i>
                    }
                    label="Dashboard"
                    href="/dashboard"
                    isActive={pathname === '/dashboard'}
                    isCollapsed={isCollapsed}
                    pathname={pathname || ''}
                />

                <NavItem
                    icon={
                        <i className="m-menu__link-icon nyicn">
                            <svg className='w-5 h-5' fill='white' data-name="Capa 1" id="Capa_1" viewBox="0 0 512 336.28" xmlns="http://www.w3.org/2000/svg">
                                <defs></defs>
                                <title>console</title>
                                <path className="cls-1" d="M511.73,320.42c-1.28-29.34-6.38-61.86-14-92.47-7.65-29.34-17.22-56.76-28.7-77.8-44.64-78.44-93.11-66.32-151.14-51-18.49,4.46-38.26,9.57-58.67,11.48h-6.38c-20.41-1.91-40.18-7-58.67-11.48C136.11,84.47,87.64,71.71,43,150.79c-11.48,21-21.68,48.47-28.7,77.8C6.65,259.2,1.55,291.73.28,321.06-1,353.58,2.19,377.18,9.2,393.76q10.52,23,30.61,28.7C51.93,425.65,66,424.37,80.63,418c24.87-10.2,53.57-31.89,81.63-58C182,340.83,219,331.26,256,331.26s74,9.57,93.74,28.7c28.06,26.15,56.76,47.83,81.63,58,14.67,5.74,28.7,7.65,40.81,4.46,12.75-3.83,23.6-12.75,30.61-29.34C509.81,377.18,513,353.58,511.73,320.42Zm-30.61,63.77c-3.83,8.93-8.93,14-15.31,15.94-7,1.91-15.94.64-26.15-3.19-22.32-8.93-48.47-28.7-74-52.93-24.23-24.23-67-36.35-109.69-36.35s-85.45,12.12-110.33,35.07c-26.15,24.23-52.29,44.64-74,52.93-10.2,3.83-19.13,5.74-26.15,3.19-6.38-1.91-11.48-7-15.31-15.94C25.15,370.8,22.6,351,23.87,321.7a439.88,439.88,0,0,1,13.39-88c7-27.42,15.94-52.93,26.78-72.06C99.12,98.5,139.94,108.7,188.4,121.46c19.77,5.1,40.18,10.2,62.5,12.12h9.57c23-1.91,43.36-7,63.13-12.12,48.47-12.12,89.28-23,124.36,40.18,10.84,19.13,19.77,44,26.78,72.06,7,29.34,12.12,59.95,13.39,88C489.41,351,486.85,370.8,481.12,384.19Z" transform="translate(0 -87.86)"></path>
                                <path className="cls-1" d="M197.33,196.07c-6.38-5.74-14-10.2-23-10.84a36.29,36.29,0,0,0-10.2-22.32l-.64-.64a36.12,36.12,0,0,0-26.15-10.84,37.65,37.65,0,0,0-26.15,10.84,37.07,37.07,0,0,0-10.84,23c-8.93.64-16.58,4.46-23,10.2l-.64.64A36.12,36.12,0,0,0,66,222.21,37.65,37.65,0,0,0,76.8,248.36a35.55,35.55,0,0,0,23.6,10.84,34,34,0,0,0,10.84,23A36.12,36.12,0,0,0,137.39,293a37.65,37.65,0,0,0,26.15-10.84c5.74-6.38,10.2-14,10.84-23a34,34,0,0,0,23-10.84,36.12,36.12,0,0,0,10.84-26.15A37.65,37.65,0,0,0,197.33,196.07Zm-15.94,35.71a13,13,0,0,1-9.57,3.83h-8.93a12.11,12.11,0,0,0-12.12,12.12V256A13.39,13.39,0,1,1,124,256v-8.93A12.11,12.11,0,0,0,111.88,235h-8.93a13.08,13.08,0,0,1-9.57-22.32L94,212a15.24,15.24,0,0,1,8.93-3.19h8.93A12.11,12.11,0,0,0,124,196.71v-8.93a13.53,13.53,0,0,1,23-9.57l.64.64a15.24,15.24,0,0,1,3.19,8.93v8.93a12.11,12.11,0,0,0,12.12,12.12h8.93a13.53,13.53,0,0,1,9.57,23Z" transform="translate(0 -87.86)"></path>
                                <circle className="cls-1" cx="366.96" cy="89.08" r="22.32"></circle>
                                <circle className="cls-1" cx="366.96" cy="179.63" r="22.32"></circle>
                                <circle className="cls-1" cx="321.69" cy="134.35" r="22.32"></circle>
                                <circle className="cls-1" cx="412.24" cy="134.35" r="22.32"></circle>
                            </svg>
                        </i>
                    }
                    label="Games"
                    hasChevron={true}
                    isActive={pathname?.startsWith('/games')}
                    isCollapsed={isCollapsed}
                    pathname={pathname || ''}
                    expandedItem={expandedItem}
                    setExpandedItem={setExpandedItem}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <SubNavItem label="Game1" href="/games?name=game1" />
                        <SubNavItem label="Game2" href="/games?name=game2" />
                        <SubNavItem label="Game3" href="/games?name=game3" />
                    </Suspense>
                </NavItem>

                <NavItem
                    icon={
                        <i className="m-menu__link-icon nyicn">
                            <svg className='w-5 h-5' fill='white' data-name="Layer 1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <defs></defs>
                                <title>operator</title>
                                <path className="cls-1" d="M486.4,425c-50.93-27-90-42.15-124.77-48l3.6-4.95a6.64,6.64,0,0,0,1.71-6.83l-8-32q4.35-6.15,8.19-12.69c31.8-10.82,47.88-29.12,50.58-56.05,14-.73,26-13.2,26-27.27v-64A27.52,27.52,0,0,0,418,146C416.1,96.67,394.37,0,256,0S95.89,96.67,94,146a27.5,27.5,0,0,0-25.75,27.26v64c0,14.51,12.8,27.31,28.16,27.31h12.8a26,26,0,0,0,13.16-3.67,186.61,186.61,0,0,0,30.67,72.37l-8,32a11.47,11.47,0,0,0,1.71,6.83l3.6,4.95c-34.78,5.81-73.84,21-124.77,48C9.39,432.64,0,448.85,0,466.77v36.69C0,508.59,3.41,512,8.53,512H503.47c5.12,0,8.53-3.41,8.53-8.53V466.77C512,449.71,501.76,433.49,486.4,425ZM256,405.44l20.43,46.83H235.24Zm-27,63.89h53.9l5,25.6h-64ZM345.6,349.87,349,365.23l-8.72,12a7.61,7.61,0,0,0-1.52,1.68L303.28,428,292,443.49l-23-51.76c28.06-3.42,53-17.72,73.08-38.21Q343.86,351.73,345.6,349.87Zm33.32-53.08a184.68,184.68,0,0,0,10.73-36.15,26.81,26.81,0,0,0,10.94,3.73C399.11,276.42,393.75,287.81,378.92,296.78Zm46.89-124.41v64a10.38,10.38,0,0,1-10.24,10.24h-12.8a10.38,10.38,0,0,1-10.24-10.24v-64a10.38,10.38,0,0,1,10.24-10.24h12.8A10.38,10.38,0,0,1,425.81,172.37ZM256,17.07c52.6,0,141.12,17.17,144.92,129a27.13,27.13,0,0,0-10.1,3.12c-10.38-65-67-115-134.83-115s-124.43,50.06-134.82,115a26.79,26.79,0,0,0-10.1-3.1C114.88,34.24,203.4,17.07,256,17.07ZM118.61,236.37a10.38,10.38,0,0,1-10.24,10.24H95.57a10.38,10.38,0,0,1-10.24-10.24v-64a10.38,10.38,0,0,1,10.24-10.24h12.8a10.38,10.38,0,0,1,10.24,10.24Zm17.92-65.71C136.53,105,190.29,51.2,256,51.2S375.47,105,375.47,170.67V230.4a157.93,157.93,0,0,1-19.27,75.89c-20.37,5.91-49.67,9.45-91.67,9.45-5.12,0-8.53,3.41-8.53,8.53s3.41,8.53,8.53,8.53c30.74,0,56.46-1.89,77.51-5.83l-1.57,1.57a143.06,143.06,0,0,1-13.56,15.65c-20.09,18.72-44.06,30.06-67.15,31.18a9.62,9.62,0,0,0-3.77-.75,8.17,8.17,0,0,0-3.55.76c-14.14-.65-28.6-5.13-42.32-12.79-13.89-8-27-19.49-38.61-34L169,326l-.5-.17a157.22,157.22,0,0,1-31.93-95.41V170.67ZM243,391.73l-23,51.76L208.72,428l-35.49-49.15c-.27-.27-.57-.54-.88-.81L163,365.23l3.41-15.36c1.15,1.24,2.33,2.46,3.51,3.65C189.94,374,214.93,388.31,243,391.73Zm-225.92,75a29.29,29.29,0,0,1,16.21-26.45c54.39-28.9,93.55-43.4,128.43-47.73l50.92,70-6.46,32.33H17.07Zm477.87,28.16H305.83l-6.46-32.33,51.47-70.78c34.76,5.24,74.61,19.74,127.88,47.64,10.24,6,16.21,16.21,16.21,27.31v28.16Z" transform="translate(0 0)"></path>
                            </svg>
                        </i>
                    }
                    label="Live Operator"
                    hasChevron={true}
                    isActive={pathname?.startsWith('/operator')}
                    isCollapsed={isCollapsed}
                    pathname={pathname || ''}
                    expandedItem={expandedItem}
                    setExpandedItem={setExpandedItem}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <SubNavItem label="Game1" href="/operator?name=game1" />
                        <SubNavItem label="Game2" href="/operator?name=game2" />
                        <SubNavItem label="Game3" href="/operator?name=game3" />
                    </Suspense>
                </NavItem>

                <NavItem
                    icon={
                        <i className="m-menu__link-icon nyicn">
                            <svg className='w-5 h-5' fill='white' data-name="Layer 1" id="Layer_1" viewBox="0 0 421.86 512" xmlns="http://www.w3.org/2000/svg">
                                <defs></defs>
                                <title>trophy (1)</title>
                                <path className="cls-1" d="M405.23,20.61a61.73,61.73,0,0,0-14.75,1.85L394.29,38c30.25-7.42,56.62,15.59,56.62,44.32,0,67.29-76.62,116.88-108.57,126.22l4.49,15.36C387.41,212,466.92,156.62,466.93,82.3A61.77,61.77,0,0,0,405.23,20.61Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M61.06,82.3c0-28.73,26.37-51.78,56.62-44.31l3.83-15.54c-40-9.84-76.45,21-76.45,59.85,0,74.32,79.52,129.72,120.08,141.58l4.49-15.36C137.68,199.18,61.06,149.59,61.06,82.3Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M283.74,297.8H228.25a8,8,0,0,0-8,8v30.36a8,8,0,0,0,9.69,7.82,128.47,128.47,0,0,1,52.11,0,8,8,0,0,0,9.69-7.82V305.8A8,8,0,0,0,283.74,297.8Zm-8,28.82a147,147,0,0,0-39.49,0V313.8h39.49Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M364,466.45H148a8,8,0,0,0-8,8V504a8,8,0,0,0,8,8H364a8,8,0,0,0,8-8V474.45A8,8,0,0,0,364,466.45ZM356,496H156V482.45H356Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M350.12,353.74H161.87a8,8,0,0,0-8,8V474.45a8,8,0,0,0,8,8H350.12a8,8,0,0,0,8-8V361.74A8,8,0,0,0,350.12,353.74Zm-8,112.71H169.87V369.74H342.12Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M318.13,385.73H193.87a8,8,0,0,0-8,8v48.71a8,8,0,0,0,8,8H318.13a8,8,0,0,0,8-8V393.73A8,8,0,0,0,318.13,385.73Zm-8,48.71H201.87V401.73H310.13Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M397,4a13.4,13.4,0,0,0-9.6-4H124.61a13.56,13.56,0,0,0-13.53,13.63c.06,5.45.27,10.81.52,16.91.2,4.93.48,9.81.81,14.66,4,59.25,17.19,113.38,38.18,156.56,3.09,6.35,6.42,12.58,9.9,18.48,16,27.22,34.39,46.75,54.59,58.06a8,8,0,0,0,6.85.46c1.86.06,4,.06,6.3.06h61.94a8.05,8.05,0,0,0,6.72-.51c20.19-11.3,38.56-30.83,54.59-58.06,3.46-5.9,6.78-12.11,9.89-18.47,21-43.2,34.21-97.34,38.19-156.57.32-4.86.6-9.72.8-14.69.23-5.59.46-11.19.51-16.86A13.38,13.38,0,0,0,397,4Zm-12.6,25.86c-.21,4.79-.46,9.53-.78,14.25-3.84,57.19-16.5,109.28-36.62,150.64-2.91,6-6,11.83-9.29,17.36-13.65,23.18-29.5,40.63-46,50.68H220.31c-16.51-10.06-32.37-27.5-46-50.69-3.26-5.54-6.39-11.38-9.3-17.35-20.1-41.34-32.76-93.43-36.62-150.64-.31-4.71-.58-9.46-.81-15-.18-4.38-.36-8.75-.44-13.17h257.7C384.76,20.66,384.57,25.27,384.39,29.89Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M352.11,34.64c-.13,2.51-.27,4.88-.43,7.22-3.34,49.57-14.62,96.29-31.77,131.55-2.4,4.93-5,9.81-7.75,14.48-9.48,16.1-20.1,28.59-30.71,36.14l9.28,13c12.43-8.85,24.6-23,35.22-41.06,3-5,5.78-10.3,8.35-15.6,18-37.08,29.86-85.9,33.34-137.5.16-2.44.3-4.86.45-7.45Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M283.74,262.82H227.89c-13.46,0-14.8,26.1-14.8,26.37s1.57,24.62,15.16,24.62h55.86c13.23,0,14.8-24.37,14.8-24.62S297.57,262.82,283.74,262.82Zm-2.92,35H231.17a34.93,34.93,0,0,1-2.09-8.61,44.5,44.5,0,0,1,2.33-10.38h49.17a44.15,44.15,0,0,1,2.33,10.36A34.43,34.43,0,0,1,280.82,297.81Z" transform="translate(-45.07 0)"></path>
                                <path className="cls-1" d="M285.43,328.34a144.74,144.74,0,0,0-58.86,0c-26.5,5.74-42.33,18.22-42.33,33.39a8,8,0,0,0,8,8H319.76a8,8,0,0,0,8-8C327.76,346.55,311.93,334.07,285.43,328.34Zm-79.54,25.39c4.94-3.72,13.06-7.37,24.06-9.75a128.43,128.43,0,0,1,52.1,0c11,2.38,19.12,6,24.06,9.75Z" transform="translate(-45.07 0)"></path>
                            </svg>
                        </i>
                    }
                    label="Highscores"
                    hasChevron={true}
                    isActive={pathname?.startsWith('/highscores')}
                    isCollapsed={isCollapsed}
                    pathname={pathname || ''}
                    expandedItem={expandedItem}
                    setExpandedItem={setExpandedItem}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <SubNavItem label="Game1" href="/highscores?name=game1" />
                        <SubNavItem label="Game2" href="/highscores?name=game2" />
                        <SubNavItem label="Game3" href="/highscores?name=game3" />
                    </Suspense>
                </NavItem>

                <NavItem
                    icon={
                        <Image src="/stats.png" alt='stats' width={1000} height={1000} className='w-5 h-5'
                            style={{
                                filter: 'hue-rotate(90deg) sepia(50%) brightness(120%)'
                            }}
                        />
                    }
                    label="Statistics"
                    href="/statistics"
                    isActive={pathname === '/statistics'}
                    isCollapsed={isCollapsed}
                    pathname={pathname || ''}
                />

                <NavItem
                    icon={
                        <i className="m-menu__link-icon nyicn">
                            <svg className="w-5 h-5" fill="white" data-name="Layer 1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <defs></defs>
                                <title>question</title>
                                <path className="cls-1" d="M268,120.47c-18.07-6-39.15,0-54.21,12s-24.09,30.12-24.09,51.2c0,9,6,15.06,15.06,15.06s15.06-6,15.06-15.06,3-21.08,12-27.11,18.07-9,30.12-6c15.06,3,24.09,15.06,27.11,27.11,3,15.06,0,27.11-12,36.14a89.82,89.82,0,0,0-36.14,72.28c0,9,6,15.06,15.06,15.06s15.06-6,12-15.06c0-18.07,12-36.14,27.11-48.19,21.08-18.07,30.12-42.17,24.09-66.26-6-27.11-27.11-45.18-51.2-51.2Z" transform="translate(0 0)"></path>
                                <path className="cls-1" d="M244,364.42c-3,3-3,9-3,12s0,6,3,9,9,6,12,6,9-3,9-6c3,0,6-6,6-9,0-6-3-9-6-12a14.55,14.55,0,0,0-21.08,0Z" transform="translate(0 0)"></path>
                                <path className="cls-1" d="M256,0A256,256,0,1,0,512,256,255.78,255.78,0,0,0,256,0Zm0,481.88C132.52,481.88,30.12,379.48,30.12,256S132.52,30.12,256,30.12,481.88,132.52,481.88,256,379.48,481.88,256,481.88Z" transform="translate(0 0)"></path>
                            </svg>
                        </i>
                    }
                    label="Help"
                    href="https://cluetivity.zendesk.com/hc/en-us"
                    isCollapsed={isCollapsed}
                />
            </nav>
        </div>
    );
};

export default CollapsibleSidebar;
