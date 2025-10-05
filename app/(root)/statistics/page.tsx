"use client";
import FilterPopup from '@/components/Statistics/StatisticsFilterPopup';
import React, { useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, PieLabelRenderProps, TooltipProps } from 'recharts';

interface PieData extends Record<string, unknown> {
    name: string;
    value: number;
    status: 'Won' | 'Left';
}

interface BarData {
    name: string;
    value: number;
    game: string;
}

// Sample data for pie chart
const pieData: PieData[] = [
    { name: 'Games', value: 80, status: 'Left' },
    { name: 'Games', value: 20, status: 'Won' },
];

// Sample data for bar chart
const barData: BarData[] = [
    { name: 'May 2023', value: 5, game: 'Operation Mindfall' }
];

// Custom colors
const COLORS = ['#5B8FF9', '#00C49F'];
const BAR_COLOR = '#69b7eb';

export default function StatisticsPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterButtonRef = useRef<HTMLDivElement | null>(null);

    // Custom formatter for tooltip
    const CustomTooltip = (props: TooltipProps<number, string>) => {
        const t = props as unknown as TooltipProps<number, string> & { payload?: Array<{ payload?: PieData }> };
        const active = t.active;
        const payload = t.payload as Array<{ payload?: PieData }> | undefined;
        if (active && payload && payload.length) {
            const p = payload[0].payload as PieData;
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                    <p className="text-sm">{p.name}</p>
                    <p className="text-sm font-semibold">{p.value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full bg-[var(--color-background-alt)] p-6">
            {/* Header */}

            {/* Stats Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-white rounded-sm shadow-sm">
                    <div className="flex justify-between items-center p-5 pb-3 mb-6 border-b border-gray-200 w-full">
                        <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
                        <div
                            ref={filterButtonRef}
                            className="flex flex-col items-start gap-3">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="px-2 py-1 bg-[#00A3FF] text-white rounded-sm flex items-center gap-2 whitespace-nowrap"
                            >
                                Filter
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <FilterPopup isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} buttonRef={filterButtonRef} />
                        </div>
                    </div>
                    {/* Bar Chart Section */}
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <Tooltip cursor={false} />
                                <Bar dataKey="value">
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Game Legend */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: BAR_COLOR }} />
                        <span>Operation Mindfall</span>
                    </div>
                </div>

                {/* Pie Chart Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6 flex flex-col items-center justify-center">
                        <h2 className="text-6xl font-bold text-[#0D1B2A]">5</h2>
                        <p className="text-gray-600">Games</p>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: PieLabelRenderProps) => {
                                        const percent = Number(props.percent ?? 0);
                                        return `${(percent * 100).toFixed(1)}%`;
                                    }}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    formatter={(value: string, entry: unknown) => {
                                        // entry may be a legend item: try to read payload
                                        const payload = (entry as unknown as { payload?: { status?: string; value?: number } }).payload;
                                        return (
                                            <span className="text-gray-700">
                                                {payload?.status}: {payload?.value}%
                                            </span>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}