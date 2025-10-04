"use client";
import React from 'react';
import { RouteType } from '../types';

interface Props { value: RouteType; onChange: (v: RouteType) => void }

const options: { value: RouteType; label: string }[] = [
    { value: 'template', label: 'Route From Template' },
    { value: 'new', label: 'New Empty Route' },
    { value: 'shared', label: 'Copy from shared Route' }
];

const RouteTypeSelect: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div>
            <h3 className="text-lg font-medium mb-3">Choose Route</h3>

            <div className="pt-6">
                <div className="flex max-md:flex-col items-start gap-6">
                    <label className="w-56 text-sm text-gray-700">Route Type :</label>
                    <div className="flex-1">
                        <div className="relative">
                            <select
                                aria-label="Route Type"
                                value={value}
                                onChange={(e) => onChange(e.target.value as RouteType)}
                                className="w-full border border-gray-200 text-[13px] rounded px-3 py-1 appearance-none focus:outline-none focus:ring-1 focus:ring-sky-400"
                            >
                                {options.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>

                            {/* caret */}
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteTypeSelect;
