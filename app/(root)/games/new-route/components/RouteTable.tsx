"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';
import RouteActionsMenu from '@/app/(root)/games/new-route/components/RouteActionsMenu';
import { useCallback } from 'react';
import BackButton from './BackButton';
import { FaGear } from 'react-icons/fa6';
import { PiGearBold } from 'react-icons/pi';

// Example riddle data
const initialRiddles = [
    { no: 1, name: 'The Professor', episode: 1, type: 'AR Professor' },
    { no: 2, name: 'Hidden Location', episode: 2, type: 'LB Photo Quest' },
    { no: 3, name: 'Sea Letter', episode: 3, type: 'AP Bottle Message (Letter)' },
    { no: 4, name: "The Kraken's Secret", episode: 4, type: 'AR Chest (Octopus)' },
    { no: 5, name: 'Color Clues', episode: 5, type: 'MG Team Photo (Colors)' },
    { no: 6, name: 'The Forgotten Map', episode: 6, type: 'AR LBR Treasure Map' },
    { no: 7, name: 'The Lost Treasure', episode: 7, type: 'AP Final Treasure' },
    { no: 8, name: 'Proof of Legends', episode: 8, type: 'MG Team Photo (Final)' },
];

interface RouteTableProps {
    gameID: string;
    routeID: string;
}

const RouteTable: React.FC<RouteTableProps> = ({ gameID, routeID }) => {
    // Delete modal state
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    // Change Type modal state
    const [changeTypeOpen, setChangeTypeOpen] = useState(false);
    const [changeCategory, setChangeCategory] = useState('Standard');
    const [changeType, setChangeType] = useState('Augmented Reality');
    const [changeRiddle, setChangeRiddle] = useState('Spectacular Start');
    const [updateTexts, setUpdateTexts] = useState(true);
    const [keepTextContents, setKeepTextContents] = useState(false);
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const router = useRouter();
    // Riddle table state
    const [riddles, setRiddles] = useState(initialRiddles);

    // Add Riddle modal state
    const [addRiddleOpen, setAddRiddleOpen] = useState(false);
    const [riddleCategory, setRiddleCategory] = useState('Standard');
    const [riddleType, setRiddleType] = useState('Augmented Reality');
    const [riddle, setRiddle] = useState('AR Safe 1 (Numbers)');
    const [episode, setEpisode] = useState('1');
    const [tabs, setTabs] = useState('Location');

    // Edit Riddle modal state
    const [editRiddleOpen, setEditRiddleOpen] = useState(false);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editCoordinates, setEditCoordinates] = useState<string[]>([]);
    const [editRadius, setEditRadius] = useState('30');
    // Solutions state for Riddle tab
    const [solutions, setSolutions] = useState<string[]>(['1701']);
    const [solutionInput, setSolutionInput] = useState('');

    // Riddle options (mock)
    const riddleCategories = ['Standard', 'Indoor', 'Bachelor Game', 'Bachelorette Game', 'Bachelor Game No Action Pack', 'Bachelorette Game No Action Pack', 'Cristmas Adventures', 'Cristmas Adventures No Action Pack'];
    const riddleTypes = ['Augmented Reality', 'Location Based', 'Action Pack', 'Minigame', 'Mutiple Choice'];
    const riddleOptions = [
        'AR Safe 1 (Numbers)',
        'AR Safe 2 (Colors)',
        'AR Laura Hunt',
        'AR Server Room',
        'AR Video',
        'AR LBR',
    ];

    // State for gear menu and modal
    const [gearMenuOpen, setGearMenuOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const gearMenuRef = React.useRef<HTMLDivElement>(null);

    // Close gear menu on outside click
    React.useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (gearMenuRef.current && !gearMenuRef.current.contains(e.target as Node)) {
                setGearMenuOpen(false);
            }
        }
        if (gearMenuOpen) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [gearMenuOpen]);

    // Modal tabs state
    const [activeTab, setActiveTab] = useState('Videos');
    const modalTabs = [
        'Videos',
        'Start Text',
        'End Text',
        'End Location',
    ];

    // Media picker state
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

    // Handler to open edit modal with riddle data
    const handleEditRiddle = useCallback((idx: number) => {
        setEditIdx(idx);
        setEditName(riddles[idx].name);
        setEditCoordinates(['52.417497793298345', '13.14462661743164']); // mock
        setEditRadius('30'); // mock
        setEditRiddleOpen(true);
    }, [riddles]);

    // Handler to save edit
    const handleSaveEdit = () => {
        if (editIdx === null) return;
        setRiddles(prev => prev.map((r, idx) => idx === editIdx ? { ...r, name: editName } : r));
        setEditRiddleOpen(false);
    };

    return (
        <div className="bg-white shadow-sm">
            <div className='flex justify-between items-center mb-8 p-4 border-b border-gray-200'>
                <h3 className="text-3xl font-semibold">{routeID}</h3>
                <div className="flex items-center gap-2 relative">
                    <button className="bg-[#009FE3] text-white px-4 py-1.5">English</button>
                    {/* Gear/settings icon */}
                    <button
                        className="bg-[#009FE3] p-2.5 mr-5 flex items-center justify-center hover:bg-[#007bb5] focus:outline-none"
                        onClick={() => setSettingsModalOpen(true)}
                        aria-label="Route settings menu"
                    >
                        <FaGear color='white' />
                    </button>
                    {/* 3-dot action menu */}
                    <button
                        className="bg-white border border-gray-200 p-2 group rounded-full flex items-center justify-center hover:bg-[#009FE3] transition-all duration-200 focus:outline-none ml-1"
                        onClick={() => setGearMenuOpen((open) => !open)}
                        aria-label="Route actions menu"
                    >
                        <svg className="w-4 h-4 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                        </svg>
                    </button>
                    {/* Action menu dropdown */}
                    {gearMenuOpen && (
                        <div ref={gearMenuRef} className="absolute right-0 top-12 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                            <button className="flex items-center w-full px-4 py-2 text-gray-900 hover:bg-gray-100 text-left text-sm gap-3" onClick={() => { setAddRiddleOpen(true); setGearMenuOpen(false); }}>
                                <span className="text-xl">+</span>
                                Add Riddle
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-gray-900 hover:bg-gray-100 text-left text-sm gap-3">
                                <span className="text-lg">&#9776;</span>
                                Edit structure
                            </button>
                            <div className="border-t border-gray-200 my-1" />
                            <button
                                className="flex items-center w-full px-4 py-2 text-gray-900 hover:bg-gray-100 text-left text-sm gap-3"
                                onClick={() => {
                                    setGearMenuOpen(false);
                                    router.push(`/games/route-settings?gameID=${gameID}&routeID=${routeID}`);
                                }}
                            >
                                <span className="text-lg">
                                    <PiGearBold />
                                </span>
                                Route Settings
                            </button>
                        </div>
                    )}
                    {/* Add Riddle Modal */}
                    {addRiddleOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.45)]">
                            <div className="bg-white rounded-lg shadow-xl w-[520px] max-w-full p-0 relative">
                                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                                    <h2 className="text-xl font-semibold">Add New Riddle</h2>
                                    <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setAddRiddleOpen(false)}>&times;</button>
                                </div>
                                <div className="px-8 pt-2 pb-4">
                                    <div className="grid grid-cols-[1fr_2fr] gap-x-10 gap-y-7 px-2 py-8 border-y border-gray-200 text-[13px] text-gray-600">
                                        <label className="font-normal text-left self-center">Riddle Category <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={riddleCategory} onChange={e => setRiddleCategory(e.target.value)}>
                                            {riddleCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Riddle Type <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={riddleType} onChange={e => setRiddleType(e.target.value)}>
                                            {riddleTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Riddle <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={riddle} onChange={e => setRiddle(e.target.value)}>
                                            {riddleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Add to Episode <span className="text-red-500">*</span></label>
                                        <input type="number" min="1" max="9" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={episode} onChange={e => setEpisode(e.target.value)} />
                                    </div>
                                    <div className="flex justify-end gap-2 px-8 py-6">
                                        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddRiddleOpen(false)}>Close</button>
                                        <button
                                            className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]"
                                            onClick={() => {
                                                // Add riddle to table
                                                setRiddles(prev => [
                                                    ...prev,
                                                    {
                                                        no: prev.length + 1,
                                                        name: riddle,
                                                        episode: Number(episode),
                                                        type: riddleType,
                                                    },
                                                ]);
                                                setAddRiddleOpen(false);
                                            }}
                                        >Add Riddle</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Language Settings Modal */}
                    {settingsModalOpen && (
                        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                            <div className="bg-white rounded-lg h-[90vh] shadow-xl max-w-full relative">
                                {/* Modal header */}
                                <div className="flex flex-col items-start border-b border-gray-200 px-6 py-4 pb-6">
                                    <div className='flex items-center justify-between w-full'>
                                        <h2 className="text-xl font-semibold">Language Settings</h2>
                                        <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setSettingsModalOpen(false)}>&times;</button>
                                    </div>
                                    <div className="text-md block font-normal">English</div>
                                </div>
                                <div className="px-6 pt-4 pb-2">
                                    {/* Tabs */}
                                    <div className="flex border-b border-gray-200 mb-4">
                                        {modalTabs.map(tab => (
                                            <button
                                                key={tab}
                                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${activeTab === tab ? 'text-[#009FE3]' : 'border-transparent text-gray-700'}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Tab content */}
                                    {activeTab === 'Videos' && (
                                        <div className="grid grid-cols-1 gap-4 pb-33.5 mb-6">
                                            <div>
                                                <div className="font-medium">AR Tutorial Video</div>
                                                <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => setMediaPickerOpen(true)}>
                                                    Upload from media
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-medium">Intro Video</div>
                                                <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => setMediaPickerOpen(true)}>
                                                    Upload from media
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-medium">Outro Win Video</div>
                                                <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => setMediaPickerOpen(true)}>
                                                    Upload from media
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-medium">Outro Loose Video</div>
                                                <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => setMediaPickerOpen(true)}>
                                                    Upload from media
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'Start Text' && (
                                        <div className="text-gray-500 pb-59.5 pt-2 text-center">
                                            <textarea className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 min-h-[120px]" defaultValue="Are you ready to start your mission?" />
                                        </div>
                                    )}
                                    {activeTab === 'End Text' && (
                                        <div className="text-gray-500 pb-59.5 pt-2 text-center">
                                            <textarea className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 min-h-[120px]" defaultValue="Well done, you've made it! Now, return to your starting point." />
                                        </div>
                                    )}
                                    {activeTab === 'End Location' && (
                                        <div className="text-gray-500 grid grid-cols-2 items-center pb-84 pt-2 text-center">
                                            <label className='block text-gray-700 text-left font-medium mb-1'>Enable End Location</label>
                                            <input type="checkbox" className='mr-2 w-4 h-4 accent-[#009FE3]' name="" id="" />
                                        </div>
                                    )}
                                    {activeTab && (
                                        <div className='border-t border-gray-200 mt-6 pt-4 flex justify-end px-6'>
                                            <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]">Save Changes</button>
                                        </div>
                                    )}
                                </div>
                                {/* Media Picker Popup */}
                                <MediaPicker open={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='overflow-x-auto px-4'>
                <table className="w-[95%] mx-auto shadow-sm overflow-x-auto">
                    <thead className="bg-[#000f24] text-white">
                        <tr>
                            <th className="px-6 py-3 text-center text-sm font-medium">No</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Riddle Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Episode</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Riddle Type</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {riddles.map((riddle, idx) => (
                            <tr key={riddle.no} className="hover:bg-gray-50">
                                <td className="px-6 py-2 text-center">{riddle.no}</td>
                                <td className="px-6 py-2 text-sm text-gray-900">{riddle.name}</td>
                                <td className="px-6 py-2 text-sm text-gray-900">{riddle.episode}</td>
                                <td className="px-6 py-2 text-sm text-gray-900">{riddle.type}</td>
                                <td className="px-6 py-2 relative">
                                    <RouteActionsMenu
                                        open={menuOpenIdx === idx}
                                        onOpen={() => setMenuOpenIdx(idx)}
                                        onClose={() => setMenuOpenIdx(null)}
                                        gameID={gameID}
                                        routeID={routeID}
                                        onEdit={() => { setMenuOpenIdx(null); handleEditRiddle(idx); }}
                                        onChangeType={() => { setMenuOpenIdx(null); setChangeTypeOpen(true); }}
                                        onDelete={() => { setMenuOpenIdx(null); setDeleteOpen(true); setDeleteIdx(idx); setDeleteConfirm(''); }}
                                    />
                                    {/* Change Type Modal */}
                                    {changeTypeOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
                                            <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-full p-0 relative">
                                                <div className="flex items-center justify-between px-8 pt-8 pb-2 border-b border-gray-200">
                                                    <h2 className="text-xl font-semibold">Change Type - {riddles[idx].name}</h2>
                                                    <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setChangeTypeOpen(false)}>&times;</button>
                                                </div>
                                                <div className="px-8 pt-8 pb-2">
                                                    <div className="grid grid-cols-[1fr_2fr] gap-x-8 gap-y-7 text-[15px] text-gray-700">
                                                        <label className="font-medium text-left self-center">Riddle Category <span className="text-red-500">*</span></label>
                                                        <select className="border px-3 py-2 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={changeCategory} onChange={e => setChangeCategory(e.target.value)}>
                                                            {riddleCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                        <label className="font-medium text-left self-center">Riddle Type <span className="text-red-500">*</span></label>
                                                        <select className="border px-3 py-2 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={changeType} onChange={e => setChangeType(e.target.value)}>
                                                            {riddleTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                        <label className="font-medium text-left self-center">Riddle <span className="text-red-500">*</span></label>
                                                        <select className="border px-3 py-2 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={changeRiddle} onChange={e => setChangeRiddle(e.target.value)}>
                                                            {["Spectacular Start", ...riddleOptions].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="mt-8 flex flex-col gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" checked={updateTexts} onChange={e => setUpdateTexts(e.target.checked)} className="accent-[#009FE3] w-5 h-5" id="updateTexts" />
                                                            <label htmlFor="updateTexts" className="text-gray-700 text-[15px]">Update texts (recommended)</label>
                                                            <span className="text-gray-400 cursor-pointer ml-2" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" checked={keepTextContents} onChange={e => setKeepTextContents(e.target.checked)} className="accent-[#009FE3] w-5 h-5" id="keepTextContents" />
                                                            <label htmlFor="keepTextContents" className="text-gray-700 text-[15px]">Keep my text contents</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end gap-2 px-8 py-6 border-t border-gray-200 mt-2">
                                                    <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setChangeTypeOpen(false)}>Close</button>
                                                    <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]">Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Delete Modal */}
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
                                                    <h2 className="text-xl font-semibold text-center mb-2">Are you sure you want to delete?</h2>
                                                    <div className="text-gray-700 text-center mb-2">Name of riddle: <span className="font-semibold">{riddles[deleteIdx].name}</span></div>
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
                                                            className={`px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5] ${deleteConfirm !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={deleteConfirm !== 'DELETE'}
                                                            onClick={() => {
                                                                setRiddles(prev => prev.filter((_, idx) => idx !== deleteIdx));
                                                                setDeleteOpen(false);
                                                            }}
                                                        >Yes, delete it!</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {editRiddleOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
                                            <div className="bg-white rounded-lg shadow-xl w-[35%] max-w-full p-0 relative">
                                                {/* Header: dark, title left, close right */}
                                                <div className="flex items-center justify-between px-8 pt-0 pb-0 bg-[#00112b] rounded-t-md" style={{ minHeight: 56 }}>
                                                    <h2 className="text-xl font-semibold text-white py-8">{editName} (AR)</h2>
                                                    <button className="text-gray-400 hover:text-gray-200 text-2xl py-4" onClick={() => setEditRiddleOpen(false)}>&times;</button>
                                                </div>
                                                {/* Tabs */}
                                                <div className="px-8 py-4 bg-white">
                                                    <div className="flex gap-2 border-b border-gray-200 pb-0 mb-4 mt-0">
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Location' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Location')}>Location</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Riddle' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Riddle')}>Riddle</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Settings' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Settings')}>Settings</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'PRO' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('PRO')}>PRO</button>
                                                    </div>
                                                </div>
                                                {tabs === 'Location' &&
                                                    <div className="px-8 pb-48 pt-3 bg-white">
                                                        {/* Form */}
                                                        <div className="grid grid-cols-[1fr_3fr_24px] gap-x-4 gap-y-6 items-center mb-2">
                                                            <label className="text-gray-700 font-medium text-left">Name <span className="text-red-500">*</span></label>
                                                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editName} onChange={e => setEditName(e.target.value)} />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            <label className="text-gray-700 font-medium text-ledt">Coordinates</label>
                                                            <div className="flex flex-col gap-1">
                                                                <button className="text-[#009FE3] text-sm font-medium text-left mb-1">&#128205; Set coordinates on map</button>
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editCoordinates[0]} onChange={e => setEditName(e.target.value)} />
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editCoordinates[1]} onChange={e => setEditName(e.target.value)} />
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            <label className="text-gray-700 font-medium text-left">Radius <span className="text-red-500">*</span></label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editRadius} onChange={e => setEditRadius(e.target.value)} />
                                                                <span className="ml-2">Meters</span>
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                        </div>
                                                    </div>
                                                }
                                                {tabs === 'Settings' &&
                                                    <div className="px-8 pt-2 pb-0 bg-white overflow-y-auto max-h-[420px]">
                                                        <div className="grid grid-cols-[1fr_2fr_24px] gap-x-4 gap-y-6 items-center mb-2">
                                                            {/* Allowed Attempts */}
                                                            <label className="text-gray-700 font-medium text-left">Allowed Attempts</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="0" />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Allowed Time */}
                                                            <label className="text-gray-700 font-medium text-left">Allowed Time</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" placeholder="Allowed Time (Minutes)" />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Meta Data */}
                                                            <label className="text-gray-700 font-medium text-left">Meta Data</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={3} />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Help Image */}
                                                            <label className="text-gray-700 font-medium text-left">Help Image</label>
                                                            <div className="flex flex-col gap-1">
                                                                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Help" className="w-48 h-32 object-cover rounded" />
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Conditional Exit Point */}
                                                            <label className="text-gray-700 font-medium text-left">Conditional Exit Point</label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="checkbox" className="mr-2 w-4 h-4 accent-[#009FE3]" id="isExitPoint" />
                                                                <label htmlFor="isExitPoint" className="text-gray-600 text-sm">Is Exit Point</label>
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* AR Image Target */}
                                                            <label className="text-gray-700 font-medium text-left">AR Image Target</label>
                                                            <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded">
                                                                <option>Custom Target</option>
                                                                <option>Default Target</option>
                                                            </select>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* AR Image Preview */}
                                                            <label className="text-gray-700 font-medium text-left">AR Image Preview</label>
                                                            <div className="flex flex-col gap-1">
                                                                <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="AR Target" className="w-48 h-32 object-cover rounded" />
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                        </div>
                                                    </div>
                                                }
                                                {tabs === 'PRO' &&
                                                    <div className="px-8 pt-2 pb-0 bg-white overflow-y-auto h-[420px]">
                                                        <div className="grid grid-cols-[1fr_1fr] gap-x-4 gap-y-6 items-center mb-2">
                                                            {/* Conditional Exit Point */}
                                                            <label className="text-gray-700 font-medium text-left">Map Quest Marker Active:</label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="checkbox" disabled className="mr-2 w-4 h-4 accent-[#009FE3]" id="isExitPoint" />
                                                                <label htmlFor="isExitPoint" className="text-gray-600 text-sm">Use Default</label>
                                                            </div>
                                                            <label className="text-gray-700 font-medium text-left">Map Quest Marker InActive:</label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="checkbox" disabled className="mr-2 w-4 h-4 accent-[#009FE3]" id="isExitPoint" />
                                                                <label htmlFor="isExitPoint" className="text-gray-600 text-sm">Use Default</label>
                                                            </div>
                                                            </div>
                                                            
                                                    </div>
                                                }
                                                {tabs === 'Riddle' &&
                                                    <div className="px-8 pt-2 pb-0 bg-white overflow-y-auto max-h-[420px]">
                                                        <div className="grid grid-cols-[1fr_2fr_24px] gap-x-4 gap-y-6 items-center mb-2">
                                                            {/* Picture */}
                                                            <label className="text-gray-700 font-medium text-left">Picture</label>
                                                            <div className="flex flex-col gap-1">
                                                                <button className="text-[#009FE3] text-sm font-medium text-left mb-1">Select from Media</button>
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* AR Video/Image */}
                                                            <label className="text-gray-700 font-medium text-left">AR Video or Image</label>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="w-48 h-32 bg-gray-200 rounded flex items-center justify-center">
                                                                    <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#e5e7eb" /><polygon points="20,16 36,24 20,32" fill="#bbb" /></svg>
                                                                </div>
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Description */}
                                                            <label className="text-gray-700 font-medium text-left">Description</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={4} defaultValue={"Hey there! Professor Hastings here.\nAh, you've found the newspaper — clever crew!\nScan my picture to receive your first task."} />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Solutions */}
                                                            <label className="text-gray-700 font-medium text-left">Solutions</label>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex gap-2 flex-wrap mb-1">
                                                                    {solutions.map((sol, i) => (
                                                                        <span key={sol + i} className="bg-[#009FE3] text-white px-2 py-1 rounded text-xs flex items-center">
                                                                            {sol}
                                                                            <button className="ml-1 text-white" onClick={() => setSolutions(solutions.filter((_, idx) => idx !== i))}>&times;</button>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <input
                                                                    className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded"
                                                                    placeholder="Add solution.."
                                                                    value={solutionInput}
                                                                    onChange={e => setSolutionInput(e.target.value)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter' && solutionInput.trim()) {
                                                                            if (!solutions.includes(solutionInput.trim())) {
                                                                                setSolutions([...solutions, solutionInput.trim()]);
                                                                            }
                                                                            setSolutionInput('');
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Hint */}
                                                            <label className="text-gray-700 font-medium text-left">Hint</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={3} defaultValue={"1. Scan the professor’s image in your newspaper\n2. Find the 4 hidden numbers inside the pictures\n3. Put them in the right order to reveal the year Captain Kidd"} />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Max Score */}
                                                            <label className="text-gray-700 font-medium text-left">Max Score</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="1000" />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* Tries without penalty */}
                                                            <label className="text-gray-700 font-medium text-left">Tries without penalty</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="1" />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                            {/* % Deduction */}
                                                            <label className="text-gray-700 font-medium text-left">% Deduction</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="10" />
                                                            <span className="text-gray-400 cursor-pointer" title="Info"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e5e7eb" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text></svg></span>
                                                        </div>
                                                    </div>
                                                }
                                                {/* Footer */}
                                                <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-white rounded-b-lg mt-2">
                                                    <div className="text-xs text-gray-500">last saved on 03.10.2025 22:14</div>
                                                    <div className="flex gap-2">
                                                        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setEditRiddleOpen(false)}>Close</button>
                                                        <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" onClick={handleSaveEdit}>Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-start border-t border-gray-200 mt-5'>
                <BackButton />
            </div>
        </div >
    );
};

export default RouteTable;
