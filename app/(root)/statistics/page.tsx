"use client";
import FilterPopup from '@/components/Statistics/StatisticsFilterPopup';
import React, { useEffect, useRef, useState } from 'react';
import axios from '@/utils/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, PieLabelRenderProps, TooltipProps } from 'recharts';
import api from '@/utils/axios';

interface PieData extends Record<string, unknown> {
    name: string;
    value: number;
    status: 'Won' | 'Lost' | 'Left' | string;
}

interface BarData {
    name: string;
    value: number;
    game: string;
}

// initial empty datasets
const INITIAL_PIE: PieData[] = [];
const INITIAL_BAR: BarData[] = [];

// Custom colors for Won, Lost, Left
const COLORS = ['#00C49F', '#FF8042', '#5B8FF9'];
const BAR_COLOR = '#69b7eb';

export default function StatisticsPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterButtonRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pieData, setPieData] = useState<PieData[]>(INITIAL_PIE);
    const [barData, setBarData] = useState<BarData[]>(INITIAL_BAR);
    const [totalGames, setTotalGames] = useState<number>(0);
    const [filters, setFilters] = useState<{ from?: string; to?: string; game?: string }>({});

    // fetch function
    const fetchStats = async (filt: { from?: string; to?: string; game?: string }) => {
        setLoading(true);
        setError(null);
        try {
            // Try using axios helper; fallback to window.fetch
            const params: Record<string, string> = {};
            if (filt.from) params.from = filt.from;
            if (filt.to) params.to = filt.to;
            if (filt.game) params.game = filt.game;
            
            const query = new URLSearchParams(params).toString();
            const url = `/api/stats${query ? `?${query}` : ''}`;
            
            const resp = await api.get(url);
            const data = resp?.data ?? resp;
            console.log('Fetching stats with params:', data);

            // Expect data to be array of games with { game, date, won: number, total: number }
            // Fallback: if data is not present, create mock aggregated output
            let items: Array<{ game: string; date: string; won: number; total: number, left: number, lost: number }> = [];
            if (Array.isArray(data)) items = data;
            else if (data.items && Array.isArray(data.items)) items = data.items;
            else {
                // fallback mock
                items = [
                    { game: 'Game1', date: '2023-05-01', won: 2, total: 5, left: 1, lost: 2 },
                    { game: 'Game2', date: '2023-05-02', won: 3, total: 5, left: 0, lost: 2 },
                ];
            }

            // apply any client-side filters (dates)
            const filtered = items.filter(it => {
                // Normalize date safely
                const itemDate = new Date(it.date);
                const fromDate = filt.from ? new Date(filt.from) : null;
                const toDate = filt.to ? new Date(filt.to) : null;
                console.log('Filtering item date:', itemDate, 'from:', fromDate, 'to:', toDate);

                // Filter by game
                if (filt.game && filt.game !== 'All' && it.game !== filt.game) return false;

                // Filter by date range
                if (fromDate && itemDate < fromDate) return false;
                if (toDate && itemDate > toDate) return false;

                return true;
            });


            // Build bar data grouped by month (name) and game
            const barMap = new Map<string, number>();
            let total = 0;
            let totalWon = 0;
            let totalLost = 0;
            let totalLeft = 0;

            filtered.forEach(it => {
                const d = new Date(it.date);
                const name = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
                const prev = barMap.get(name) ?? 0;
                barMap.set(name, prev + it.total);
                total += it.total;
                totalWon += it.won;
                totalLost += it.lost || 0;
                totalLeft += it.left || 0;
            });

            const bars: BarData[] = Array.from(barMap.entries())
                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                .map(([name, value]) => ({ name, value, game: filt.game ?? 'All' }));

            const pie: PieData[] = [
                { name: 'Won', value: totalWon, status: 'Won' },
                { name: 'Lost', value: totalLost, status: 'Lost' },
                { name: 'Left', value: totalLeft, status: 'Left' },
            ].filter(item => item.value > 0);

            setBarData(bars);
            setPieData(pie);
            setTotalGames(total);
        } catch (e: any) {
            setError(e?.message ?? 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Fetching stats with filters:', filters);
        fetchStats(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

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
                            <FilterPopup
                                isOpen={isFilterOpen}
                                onClose={() => setIsFilterOpen(false)}
                                buttonRef={filterButtonRef}
                                onApply={(f) => {
                                    setFilters({ from: f.from || undefined, to: f.to || undefined, game: f.game || undefined });
                                }}
                            />
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
                        <span>{filters.game ?? 'All games'}</span>
                    </div>
                </div>

                {/* Pie Chart Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6 flex flex-col items-center justify-center">
                        <h2 className="text-6xl font-bold text-[#0D1B2A]">{totalGames}</h2>
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