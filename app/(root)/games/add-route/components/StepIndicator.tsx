"use client";
import React from 'react';

interface Props { current: number; total: number }

const StepIndicator: React.FC<Props> = ({ current, total }) => {
    const steps = Array.from({ length: total }, (_, i) => i + 1);

    // Custom width calculation based on step and total
    const getIndicatorWidth = (current: number, total: number): string => {
        if (total === 3) {
            if (current === 1) return `${(current / (total + 18)) * 100}%`;
            if (current === 2) return `${(current / (total + 2.32)) * 100}%`;
            if (current === 3) return `${(current / (total + 1.17)) * 100}%`;
        }
        if (total === 2) {
            if (current == 1) return `${(current / (total + 18)) * 100}%`;
            return `${(current / (total + 1.65)) * 100}%`;
        }

        // Fallback: responsive default
        return `${(current / total) * 100}%`;
    };

    return (
        <div className='p-6'>
            <div className="w-full h-2 bg-gray-200 rounded-full flex items-center">
                <div
                    className="h-2 bg-sky-500 rounded-full transition-width"
                    style={{ width: getIndicatorWidth(current, total) }}
                />
                <div
                    className={`w-4 h-4 rounded-full ml-[-8px] flex-shrink-0 transition-colors bg-sky-500`}
                />
            </div>

            <div className="flex items-center md:flex-row max-md:gap-6 justify-center w-full flex-col md:justify-between mt-6">
                {steps.map((s, idx) => (
                    <div key={s} className={`flex text-center ${idx === 1 ? 'max-md:pr-[0.8rem]' :'max-md:pr-[2rem]'} max-md:justify-center max-md:w-full items-center gap-2 md:mr-auto mx-auto md:ml-10`}>
                        <div className={`md:mx-auto w-10 h-10 rounded-full ${s <= current ? 'bg-sky-500 text-white' : 'bg-[#e2e5ec] text-gray-500'} flex items-center justify-center font-semibold`}>{s}</div>
                        <div className='w-6 mt-0.5 border-2 border-[#e2e5ec] rounded-full'></div>
                        <div className="text-sm text-gray-600">{s === 1 ? 'Choose Route' : s === 2 ? `${total === 2 ? 'Route Settings' : 'Choose Template'}` : 'Route Settings'} </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
