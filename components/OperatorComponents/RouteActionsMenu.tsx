"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { HiOutlineDuplicate } from 'react-icons/hi';

interface RouteActionsMenuProps {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    gameID: string;
    routeID: string;
}

const RouteActionsMenu: React.FC<RouteActionsMenuProps> = ({ open, onOpen, onClose, gameID, routeID }) => {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);
    const handleEdit = () => {
        router.push(`/games/new-route?gameID=${gameID}&routeID=${routeID}`);
        onClose();
    };
    // Dynamic menu position: open above if near bottom of viewport
        const [menuPosition, setMenuPosition] = React.useState<'bottom' | 'top'>('bottom');
    
        React.useEffect(() => {
            if (open && menuRef.current) {
                const rect = menuRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                if (spaceBelow < 200) { // menu height approx
                    setMenuPosition('top');
                } else {
                    setMenuPosition('bottom');
                }
            }
        }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={open ? onClose : onOpen} className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-0.5">
                <svg className="w-5 h-5 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 mr-20 w-40 text-[13px] bg-white border rounded border-none shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] z-10"
                    style={menuPosition === 'top' ? { bottom: '100%', marginBottom: '8px' } : { top: '100%', marginTop: '8px' }}>
                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <FaRegEdit />
                        Edit Route
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <HiOutlineDuplicate />
                        Duplicate Route
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                        <MdDelete />
                        Delete Route
                    </button>
                </div>
            )}
        </div>
    );
};

export default RouteActionsMenu;
