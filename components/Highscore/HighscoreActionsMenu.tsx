"use client";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HighscoreActionsMenuProps {
    open: boolean;
    onClose: () => void;
    onShow: () => void;
    onEditName: () => void;
    onSave: () => void;
    onDownloadTeamData: () => void;
    onReset: () => void;
    onDelete: () => void;
    anchorRef?: React.RefObject<HTMLButtonElement> | null;
}

const HighscoreActionsMenu: React.FC<HighscoreActionsMenuProps> = ({
    open,
    onClose,
    onShow,
    onEditName,
    onSave,
    onDownloadTeamData,
    onReset,
    onDelete,
    anchorRef,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });

    // calculate position whenever `open` or anchor changes
    useEffect(() => {
        if (open && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY - 5, // below button
                left: 100, // aligned left to button
            });
        }
    }, [open, anchorRef]);

    // close on outside click
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                (!anchorRef?.current ||
                    !anchorRef.current.contains(event.target as Node))
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    return createPortal(
        <div
            ref={menuRef}
            className="absolute z-[9999] bg-white rounded-lg shadow-lg md:right-[50px] border border-gray-200 py-2 w-54"
            style={{
                position: "absolute",
                top: coords.top,
                right: coords.left,
            }}
        >
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50" onClick={onShow}>📄 Show</button>
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50" onClick={onEditName}>✏️ Edit Name</button>
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50" onClick={onSave}>💾 Save</button>
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50" onClick={onDownloadTeamData}>☁️ Download Team Data</button>
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50" onClick={onReset}>🔄 Reset</button>
            <button className="flex items-center px-4 py-2 w-full hover:bg-gray-50 text-red-500" onClick={onDelete}>🗑️ Delete</button>
        </div>,
        document.body
    );
};

export default HighscoreActionsMenu;
