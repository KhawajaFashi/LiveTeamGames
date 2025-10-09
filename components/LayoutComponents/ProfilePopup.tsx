import Image from 'next/image';
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface ProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLDivElement | null>;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose, buttonRef }) => {
    const router = useRouter();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef?.current &&
                !buttonRef?.current.contains(event.target as Node)
            ) {
                onClose(); // close only if clicked outside popup AND button
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={popupRef}
            className="absolute top-16 right-6 z-50 bg-white rounded-lg shadow-lg border w-64"
        >
            <div className="bg-[#000f24] p-6 text-white">
                <div className="font-semibold text-sm">DemoSet20</div>
                <div className="text-xs text-gray-300">demoset20@cluetivity.com</div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700"
                    onClick={() => {
                        router.push('/profile/myprofile');
                        onClose();
                    }}
                >
                    <Image src="/profile.png" alt="User Icon" width={16} height={16} className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                </button>

                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700">
                    <Image src="/updates.png" alt="User Icon" width={16} height={16} className="w-4 h-4 text-gray-500" />

                    <span>Support</span>
                </button>


                <button
                    className="mx-4 px-3 py-2 rounded-sm text-left hover:bg-[#00adee] hover:text-white flex items-center space-x-3 text-xs font-bold border-gray-100 border-1"
                    onClick={async () => {
                        try {
                            await api.post('/user/logout');
                            router.push('/login');
                            onClose();
                        } catch (err) {
                            // Optionally handle error
                        }
                    }}
                >
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};
export default ProfilePopup;
