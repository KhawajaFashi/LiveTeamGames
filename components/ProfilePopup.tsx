import Image from 'next/image';
import React, { useRef, useEffect } from 'react';

interface ProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-6 z-50">
            <div
                ref={popupRef}
                className="bg-white rounded-lg shadow-lg border border-gray-200 w-64 overflow-hidden"
            >
                {/* User Info Header */}
                <div className="bg-[#000f24] p-6 text-white">
                    <div className="font-semibold text-sm">DemoSet20</div>
                    <div className="text-xs text-gray-300">demoset20@cluetivity.com</div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700">
                        <Image src="/profile.png" alt="User Icon" width={16} height={16} className="w-4 h-4 text-gray-500" />
                        <span>My Profile</span>
                    </button>

                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700">
                        <Image src="/updates.png" alt="User Icon" width={16} height={16} className="w-4 h-4 text-gray-500" />

                        <span>Support</span>
                    </button>


                    <button className="mx-4 px-3 py-2 rounded-sm text-left hover:bg-[#00adee] hover:text-white flex items-center space-x-3 text-xs font-bold border-gray-100 border-1">
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
