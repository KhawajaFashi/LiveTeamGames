"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { createPortal } from "react-dom";


interface RouteActionsMenuProps {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    gameID: string;
    routeID: string;
    onDelete?: () => void;
    onDuplicate?: () => void;
    anchorRef?: React.RefObject<HTMLButtonElement> | null;
}

const RouteActionsMenu: React.FC<RouteActionsMenuProps> = ({ open, onOpen, onClose, gameID, routeID, onDelete, onDuplicate, anchorRef }) => {
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
    const handleDelete = () => {
        onClose();
        if (onDelete) onDelete();
    };
    const handleDuplicate = () => {
        onClose();
        if (onDuplicate) onDuplicate();
    };
    // Dynamic menu position: open above if near bottom of viewport
    const [menuPosition, setMenuPosition] = React.useState<'bottom' | 'top'>('bottom');
    const [coords, setCoords] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    useEffect(() => {
        if (open && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY - 5, // below button
                left: 100, // aligned left to button
            });
        }
    }, [open, anchorRef]);

   

    return createPortal(
        <div className="relative" ref={menuRef}
            style={{
                position: "absolute",
                top: coords.top,
                right: coords.left,
            }}
        >
            {open && (
                <div className="absolute right-0 mt-2  w-40 text-[13px] bg-white border rounded border-none shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] z-100"
                >
                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <FaRegEdit />
                        Edit Route
                    </button>
                    <button onClick={handleDuplicate} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <HiOutlineDuplicate />
                        Duplicate Route
                    </button>
                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                        <MdDelete />
                        Delete Route
                    </button>
                </div>
            )}
        </div>,
        document.body
    );
};

export default RouteActionsMenu;
