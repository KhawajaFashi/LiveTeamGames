"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from "react-dom";
import { useRouter } from 'next/navigation';
import { FaRegEdit } from 'react-icons/fa';
import { CgArrowsExchange } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';

interface RouteActionsMenuProps {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    gameID: string;
    routeID: string;
    onEdit?: () => void;
    onChangeType?: () => void;
    onDelete?: () => void;
}

const RouteActionsMenu: React.FC<RouteActionsMenuProps & { anchorRef?: React.RefObject<HTMLButtonElement> }> = ({ open, onOpen, onClose, gameID, routeID, onEdit, onChangeType, onDelete, anchorRef }) => {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

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

    useEffect(() => {
        if (open && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY - 5,
                left: (rect.left - 150),
            });
        }
    }, [open, anchorRef]);

    const handleEdit = () => {
        onClose();
        if (onEdit) onEdit();
    };
    const handleChangeType = () => {
        onClose();
        if (onChangeType) onChangeType();
    };
    const handleDelete = () => {
        onClose();
        if (onDelete) onDelete();
    };

    return (
        <>
            <button onClick={open ? onClose : onOpen} className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1" ref={anchorRef}>
                <svg className="w-5 h-5 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </button>
            {open && createPortal(
                <div
                    ref={menuRef}
                    className="absolute w-40 text-[13px] bg-white border rounded border-none shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] z-100"
                    style={{ top: coords.top, left: coords.left }}
                >
                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <FaRegEdit />
                        Edit
                    </button>
                    <button onClick={handleChangeType} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <CgArrowsExchange />
                        Change Type
                    </button>
                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                        <MdDelete />
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </>
    );
};

export default RouteActionsMenu;
