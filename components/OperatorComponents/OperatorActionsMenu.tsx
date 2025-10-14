import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from "react-dom";
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsImages, BsCameraVideo } from 'react-icons/bs';

interface OperatorActionsMenuProps {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onTeamDetails?: () => void;
    onTeamPhotos?: () => void;
    onTeamVideos?: () => void;
    onEditTeamName?: () => void;
    onShowTeamInfo?: () => void;
    onDeleteTeam?: () => void;
    anchorRef?: React.RefObject<HTMLButtonElement | null> | null;
}

const OperatorActionsMenu: React.FC<OperatorActionsMenuProps> = ({
    open,
    onOpen,
    onClose,
    onTeamDetails,
    onTeamPhotos,
    onTeamVideos,
    onEditTeamName,
    onShowTeamInfo,
    onDeleteTeam,
    anchorRef
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
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
                left: rect.left - 150,
            });
        }
    }, [open, anchorRef]);

    return (
        <>
            <button onClick={open ? onClose : onOpen} className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1" ref={anchorRef}>
                <svg className="w-4 h-4 hover:text-white text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                </svg>
            </button>
            {open && createPortal(
                <div
                    ref={menuRef}
                    className="absolute w-40 text-[13px] bg-white border rounded border-none shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] z-100"
                    style={{ top: coords.top, left: coords.left }}
                >
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={onTeamDetails}>
                        <AiOutlineInfoCircle />
                        Team Details
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={onTeamPhotos}>
                        <BsImages />
                        Team Pictures
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={onTeamVideos}>
                        <BsCameraVideo />
                        Team Videos
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={onEditTeamName}>
                        <FaRegEdit />
                        Edit Team Name
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={onShowTeamInfo}>
                        <AiOutlineInfoCircle />
                        Show Team Info
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600" onClick={onDeleteTeam}>
                        <MdDelete />
                        Delete Team
                    </button>
                </div>,
                document.body
            )}
        </>
    );
};

export default OperatorActionsMenu;
