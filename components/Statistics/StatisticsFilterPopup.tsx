"use client";
import React, { useEffect, useRef, useState } from "react";

interface FilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLDivElement | null>;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose, buttonRef }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [filters, setFilters] = useState({
        types: "Real Games",
        from: "",
        to: "",
        games: "Operation Mindfall",
    });

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
            className={`absolute bg-white p-3 rounded-md shadow-[0px_-1px_3px_1px_rgba(0,0,0,0.3)] w-[250px] max-sm:w-[220px] transform transition-all duration-500 translate-y-9 max-lg:-translate-x-25 max-sm:-translate-x-17 max-[400px]:-translate-x-15 ${isOpen ? 'opacity-100 z-50' : 'opacity-0 hidden pointer-events-none'
                }`}
        >
            {/* Filter Form */}
            <div className="space-y-3">
                {/* Route */}
                <div className="space-y-1">
                    <label htmlFor="route" className="block text-[13px] font-medium text-gray-700">
                        Types
                    </label>
                    <select
                        id="route"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00A3FF] text-[12px] text-gray-500"
                        value={filters.types}
                        onChange={(e) => setFilters({ ...filters, types: e.target.value })}
                    >
                        <option value="route1">Real Games</option>
                        <option value="route2">Test Games</option>
                    </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                    <label htmlFor="date" className="block text-[13px] font-medium text-gray-700">
                        From
                    </label>
                    <input
                        type="date"
                        id="date"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00A3FF] text-[12px] text-gray-500"
                        value={filters.from}
                        onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                    />
                </div>

                {/* Date */}
                <div className="space-y-1">
                    <label htmlFor="date" className="block text-[13px] font-medium text-gray-700">
                        To
                    </label>
                    <input
                        type="date"
                        id="date"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00A3FF] text-[12px] text-gray-500"
                        value={filters.to}
                        onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                    />
                </div>

                {/* Status */}
                <div className="space-y-1">
                    <label htmlFor="status" className="block text-[13px] font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="status"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00A3FF] text-[12px] text-gray-500"
                        value={filters.games}
                        onChange={(e) => setFilters({ ...filters, games: e.target.value })}
                    >
                        <option value="operation-mindfall">Operation Mindfall</option>
                        <option value="magic-portal">Magic Portal</option>
                        <option value="blackout">BlackOut</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm font-medium text-white bg-[#00A3FF] rounded-md"
                >
                    Filter
                </button>
            </div>
        </div>
    );
};

export default FilterPopup;