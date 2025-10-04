import React, { useEffect, useRef } from 'react';
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
    onDeleteTeam
}) => {
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

    // Dynamic menu position: open above if near bottom of viewport
    const [menuPosition, setMenuPosition] = React.useState<'bottom' | 'top'>('bottom');

    React.useEffect(() => {
        if (open && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 280) { // menu height approx
                setMenuPosition('top');
            } else {
                setMenuPosition('bottom');
            }
        }
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={open ? onClose : onOpen} className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1">
                <svg className="w-4 h-4 hover:text-white text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                </svg>
            </button>
            {open && (
                <div
                    className={`absolute right-0 w-40 mr-8 mt-0 text-[13px] bg-white border rounded border-none shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] z-10`}
                    style={menuPosition === 'top' ? { bottom: '100%', marginBottom: '8px' } : { top: '100%', marginTop: '8px' }}
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
                </div>
            )}
        </div>
    );
};

export default OperatorActionsMenu;
