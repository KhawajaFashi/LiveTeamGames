"use client";
import React, { useRef, useState, useEffect } from 'react';
import { GameData } from '../lib/gameConfig';
import FilterPopup from '@/components/GameFilterPopup';
import Link from 'next/link';
import RouteActionsMenu from '@/components/OperatorComponents/RouteActionsMenu';
import api from '@/utils/axios';

interface GameTableProps {
    gameData: GameData;
    gameType: string;
}

const GameTable: React.FC<GameTableProps> = ({ gameData, gameType }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterButtonRef = useRef<HTMLDivElement | null>(null);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    // keep a copy of the raw fetched routes so we can re-filter without refetching
    const [rawRows, setRawRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{ route: string; language: string; numRiddles?: number | ""; favourite?: boolean }>({ route: '', language: '', numRiddles: '', favourite: false });

    useEffect(() => {
        const fetch_data = async () => {
            setLoading(true);
            setError(null);
            await api.get(`/games/fetch_data?gameName=${encodeURIComponent(gameType)}`)
                .then(res => {
                    if (res.data.success && Array.isArray(res.data.data)) {
                        const mappedRows = res.data.data.map((route: any) => ({
                            name: route.name || '-',
                            count: route.numberOfItems ?? '-',
                            lang: route.lang || '-',
                            status: route.active,
                            lastEdited: route.updatedAt ? new Date(route.updatedAt).toLocaleString() : '-',
                            _id: route._id,
                            riddles: route.riddle ? (Array.isArray(route.riddle) ? route.riddle : [route.riddle]) : [],
                            favourite: route.favourite,
                        }));
                        setRawRows(mappedRows);
                        setRows(mappedRows);
                        // setCheckedItems(Array(mappedRows.length).fill(false));
                        console.log('Fetched rows:', mappedRows);
                        // setFavourites();

                    } else {
                        setRows([]);
                    }
                })
                .catch(() => setError('Failed to fetch routes'))
                .finally(() => setLoading(false));
        };
        fetch_data();
    }, [gameType]);

    // Recompute displayed rows whenever rawRows or activeFilters change
    useEffect(() => {
        if (!rawRows || rawRows.length === 0) {
            setRows([]);
            return;
        }

        const filtered = rawRows.filter(r => {
            // route filter checks status selection (Activated/Deactivated)
            if (activeFilters.route) {
                const wantActive = activeFilters.route === 'Activated';
                console.log(wantActive, r.status);
                // The mapped r.status uses 'green' for active and 'red' for inactive
                if (wantActive && r.status !== true) return false;
                if (!wantActive && r.status !== false) return false;
            }

            // language filter
            if (activeFilters.language && activeFilters.language !== '') {
                if (activeFilters.language !== r.lang) return false;
            }

            // numRiddles filter
            if (activeFilters.numRiddles !== undefined && activeFilters.numRiddles !== '') {
                const want = Number(activeFilters.numRiddles as any);
                if (Number(r.count) !== want) return false;
            }

            // favourite filter
            if (activeFilters.favourite) {
                if (!r.favourite) return false;
            }

            return true;
        });

        setRows(filtered);
    }, [rawRows, activeFilters]);

    // Helper for riddles table (for RouteTable)
    // You can pass rows[index].riddles to RouteTable as needed

    return (
        <div className="bg-white shadow-sm flex flex-col w-full">
            {/* Controls Section */}
            <div className="flex max-lg:flex-col max-lg:gap-3 justify-between items-center p-6 font-semibold">
                {/* Filter Dropdown */}
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
                        onApply={(filters) => {
                            // store active filters and compute filtered rows
                            setActiveFilters(filters);
                        }}
                    />
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder={gameData?.searchPlaceholder}
                        className="pl-10 pr-4 py-1 border border-gray-300 rounded-lg w-64 max-[350px]:w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Animate Showdown Button */}
                <button className="px-3 py-1 bg-[#00A3FF] text-white rounded-sm">
                    <Link href={`/games/add-route?gameID=${gameType}`}>
                        Add new Route
                    </Link>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto mx-5 h-[35rem] rounded-sm ">
                <table className="w-full">
                    {/* Table Header */}
                    <thead className="bg-[#000f24] text-white">
                        <tr>
                            <th className="px-6 py-4 text-center text-sm font-medium">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </th>
                            <th className="px-6 py-2 text-left text-sm font-medium">{gameData?.columns?.name}</th>
                            <th className="px-6 py-2 text-left text-sm font-medium">{gameData?.columns?.count}</th>
                            <th className="px-6 py-2 text-left text-sm font-medium">{gameData?.columns?.lang}</th>
                            <th className="px-6 py-2 text-left text-sm font-medium">
                                <div className="flex items-center space-x-1">
                                    <span>{gameData?.columns?.status}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </th>
                            <th className="px-6 py-2 text-left text-sm font-medium">
                                <div className="flex items-center space-x-1">
                                    <span>{gameData?.columns?.lastEdited}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                            </th>
                            <th className="px-6 py-2 text-left text-sm font-medium">{gameData?.columns?.action}</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={7} className="text-center text-red-600 py-8">{error}</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-8">No routes found.</td></tr>
                        ) : rows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-2" onClick={async () => {
                                    try {
                                        // Send toggle request
                                        const res = await api.post('/games/toggle_favourite', { routeId: row._id });
                                        // Update state immutably
                                        setRows(prevRows =>
                                            prevRows.map(r =>
                                                r._id === row._id ? { ...r, favourite: !r.favourite } : r
                                            )
                                        );
                                        setRawRows(prevRows =>
                                            prevRows.map(r =>
                                                r._id === row._id ? { ...r, favourite: !r.favourite } : r
                                            )
                                        );
                                        console.log(res.data);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}>
                                    <svg className={`w-4 h-4 ${row.favourite === true ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </td>
                                <td className="px-6 py-2 text-sm text-gray-900">{row.name ?? '-'}</td>
                                <td className="px-10 py-2 text-sm text-blue-600 font-medium">{row.count ?? '-'}</td>
                                <td className="px-6 py-2 text-sm text-blue-600 font-medium">{row.lang ?? '-'}</td>
                                <td className="px-10 py-2">
                                    <input
                                        type="checkbox"
                                        checked={row.status || false}
                                        onClick={async () => {
                                            try {
                                                // Send toggle request
                                                const res = await api.post('/games/toggle_status', { routeId: row._id });
                                                // Update state immutably
                                                setRows(prevRows =>
                                                    prevRows.map(r =>
                                                        r._id === row._id ? { ...r, status: !r.status } : r
                                                    )
                                                );
                                                setRawRows(prevRows =>
                                                    prevRows.map(r =>
                                                        r._id === row._id ? { ...r, status: !r.status } : r
                                                    )
                                                );
                                                console.log(res.data);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        className="w-4 h-4 rounded-lg accent-red-600 cursor-pointer"
                                    />
                                </td>

                                <td className="px-6 py-2 text-sm text-gray-900">{row.lastEdited ?? '-'}</td>
                                <td className="px-6 py-2 relative">
                                    <RouteActionsMenu
                                        open={menuOpenIdx === index}
                                        onOpen={() => setMenuOpenIdx(index)}
                                        onClose={() => setMenuOpenIdx(null)}
                                        gameID={gameType}
                                        routeID={row.name}
                                        onDelete={() => { setDeleteOpen(true); setDeleteIdx(index); setDeleteConfirm(''); setMenuOpenIdx(null); }}
                                        onDuplicate={async () => {
                                            try {
                                                // call backend to duplicate route by id
                                                const res = await api.post('/games/duplicate_route', { _id: row._id });
                                                if (res.data && res.data.success && res.data.data) {
                                                    // append duplicated route to rows (map backend shape)
                                                    const newRoute = res.data.data;
                                                    const mapped = {
                                                        name: newRoute.name || '-',
                                                        count: newRoute.numberOfItems ?? '-',
                                                        lang: newRoute.lang || '-',
                                                        status: newRoute.active === true ? 'green' : (newRoute.active === false ? 'red' : 'yellow'),
                                                        lastEdited: newRoute.updatedAt ? new Date(newRoute.updatedAt).toLocaleString() : '-',
                                                        _id: newRoute._id,
                                                        riddles: newRoute.riddle ? (Array.isArray(newRoute.riddle) ? newRoute.riddle : [newRoute.riddle]) : [],
                                                        favourite: newRoute.favourite,
                                                    };
                                                    setRows(prev => [mapped, ...prev]);
                                                } else {
                                                    console.error('Duplicate failed', res.data);
                                                }
                                            } catch (err) {
                                                console.error('Error duplicating route', err);
                                            }
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Delete Route Modal */}
            {deleteOpen && deleteIdx !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
                    <div className="bg-white rounded-lg shadow-xl w-[420px] max-w-full p-0 relative">
                        <div className="flex flex-col items-center justify-center px-8 pt-8 pb-2">
                            <div className="mb-4">
                                <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                                    <circle cx="32" cy="32" r="30" stroke="#FF3366" strokeWidth="4" fill="#fff" />
                                    <text x="32" y="44" textAnchor="middle" fontSize="40" fill="#FF3366">!</text>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-center mb-2">Are you sure you want to delete this route?</h2>
                            <div className="text-gray-700 text-center mb-2">Name: <span className="font-semibold">{rows[deleteIdx].name}</span></div>
                            <div className="text-gray-500 text-center mb-4">Type <span className="font-bold">DELETE</span> to confirm</div>
                            <input
                                className="border px-3 py-2 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded mb-4 text-center"
                                value={deleteConfirm}
                                onChange={e => setDeleteConfirm(e.target.value)}
                                placeholder="Type DELETE to confirm"
                            />
                            <div className="flex items-center justify-center gap-2 my-4">
                                <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setDeleteOpen(false)}>Cancel</button>
                                <button
                                    className={`px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5] ${deleteConfirm !== 'DELETE' || deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                                    onClick={async () => {
                                        if (deleteIdx === null) return;
                                        const target = rows[deleteIdx];
                                        if (!target || !target._id) {
                                            // fallback: remove locally
                                            setRows(prev => prev.filter((_, idx) => idx !== deleteIdx));
                                            setDeleteOpen(false);
                                            return;
                                        }
                                        try {
                                            setDeleteLoading(true);
                                            const res = await api.delete('/games/delete_route', { data: { _id: target._id } });
                                            if (res.data && res.data.success) {
                                                setRows(prev => prev.filter(r => r._id !== target._id));
                                                setDeleteOpen(false);
                                            } else {
                                                console.error('Delete route failed', res.data);
                                            }
                                        } catch (err) {
                                            console.error('Error deleting route', err);
                                        } finally {
                                            setDeleteLoading(false);
                                            setDeleteConfirm('');
                                        }
                                    }}
                                >{deleteLoading ? 'Deleting...' : 'Yes, delete it!'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameTable;
