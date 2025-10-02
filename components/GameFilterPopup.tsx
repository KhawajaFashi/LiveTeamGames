"use client";
import React, { useEffect, useRef, useState } from "react";

interface FilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLDivElement | null>;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose, buttonRef }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [filters, setFilters] = useState<{
        route: string;
        language: string;
        numRiddles?: number | "";
        favourite?: boolean;
    }>({
        route: "",
        language: "English",
        numRiddles: "",
        favourite: false,
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
                        Status
                    </label>
                    <select
                        id="route"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-gray-500"
                        value={filters.route}
                        onChange={(e) => setFilters({ ...filters, route: e.target.value })}
                    >
                        <option value="">Select route</option>
                        <option value="Activated">Activated</option>
                        <option value="Deactivated">Deactivated</option>
                    </select>
                </div>


                {/* Language */}
                <div className="space-y-1">
                    <label htmlFor="language" className="block text-[13px] font-medium text-gray-700">
                        Language
                    </label>
                    <select
                        id="language"
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-gray-500"
                        value={filters.language}
                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    >
                        <option value="English">English</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>

                {/* Number of Riddles */}
                <div className="space-y-1">
                    <label htmlFor="numRiddles" className="block text-[13px] font-medium text-gray-700">
                        Number of Riddles
                    </label>
                    <input
                        id="numRiddles"
                        type="number"
                        min={1}
                        className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-gray-500"
                        value={filters.numRiddles ?? ""}
                        onChange={(e) =>
                            setFilters({ ...filters, numRiddles: e.target.value ? Number(e.target.value) : "" })
                        }
                        placeholder="Enter number"
                    />
                </div>

                {/* Favourite Checkbox */}
                <div className="flex items-center space-x-1">
                    <input
                        id="favourite"
                        type="checkbox"
                        checked={!!filters.favourite}
                        onChange={(e) => setFilters({ ...filters, favourite: e.target.checked })}
                        className="accent-blue-600"
                    />
                    <label htmlFor="favourite" className="text-[12px] font-normal text-gray-700">
                        Show Only Favourites
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    onClick={() => setFilters({
                        route: "",
                        language: "English",
                        numRiddles: "",
                        favourite: false,
                    })}
                    className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                    Reset
                </button>
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default FilterPopup;