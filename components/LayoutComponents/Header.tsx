"use client";
import React, { useEffect, useRef, useState } from 'react';
import { IoIosPerson } from "react-icons/io";
import ProfilePopup from './ProfilePopup';
import Image from 'next/image';

interface HeaderProps {
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileButtonRef = useRef<HTMLDivElement | null>(null);

    const toggleProfile = () => {
        console.log("Clicked on the button", isProfileOpen);
        setIsProfileOpen((prev) => !prev);

    };
    useEffect(() => {
        console.log("Clicked on the button after", !isProfileOpen);
    }, [isProfileOpen]);

    return (
        <header className="xl:bg-white h-16 shadow-md flex items-center max-[512px]:w-screen justify-between xl:justify-end bg-[#000f24] px-6 ">
            <div
                ref={profileButtonRef}
                className="cursor-pointer"
                onClick={toggleProfile}
            >
                <div className='hidden xl:flex items-center space-x-4'>
                    <IoIosPerson color="#00adee" size="30px" />
                </div>
            </div>

            <ProfilePopup
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                buttonRef={profileButtonRef}
            />
            <div className='flex justify-between xl:hidden  w-full'>
                <Image
                    src="/clutivity_logo.png"
                    alt="Logo"
                    width={2600}
                    height={2600}
                    className='w-32 h-10 ml-5'
                />
                <div className='flex space-x-4'>
                    <button
                        data-sidebar-toggle
                        aria-expanded={isSidebarOpen}
                        className={`text-white`}
                        onClick={() => onToggleSidebar && onToggleSidebar()}
                    >
                        <span className="group flex flex-col justify-between w-5 h-[18px] cursor-pointer ">
                            <span className={`block h-[1px] bg-white rounded transition-all duration-500 group-hover:w-5 w-3`}></span>
                            <span className="block h-[1px] bg-white rounded transition-all duration-500 w-5"></span>
                            <span className={`block h-[1px] bg-white rounded transition-all duration-500 'group-hover:w-5 w-4`}></span>
                        </span>
                    </button>
                    <div className="items-center flex space-x-4 cursor-pointer" onClick={toggleProfile}>
                        <IoIosPerson color='white' size='30px' />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
