"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';
import RouteActionsMenu from '@/app/(root)/games/new-route/components/RouteActionsMenu';
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
                                        <select className="border px-3 py-2 rounded w-full text-sm" value={riddleCategory} onChange={e => setRiddleCategory(e.target.value)}>
                                            {riddleCategories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Riddle Type <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-2 rounded w-full text-sm" value={riddleType} onChange={e => setRiddleType(e.target.value)}>
                                            {riddleTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Riddle <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-2 rounded w-full text-sm" value={riddle} onChange={e => setRiddle(e.target.value)}>
                                            {riddleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Add to Episode <span className="text-red-500">*</span></label>
                                        <input type="number" min="1" max="9" className="border px-3 py-2 rounded w-full text-sm" value={episode} onChange={e => setEpisode(e.target.value)} />
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
                                        <div className="grid grid-cols-1 gap-4 mb-6">
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
                                </div>
                                {/* Media Picker Popup */}
                                <MediaPicker open={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <table className="w-[95%] mx-auto shadow-sm">
                <thead className="bg-[#000f24] text-white">
                    <tr>
                        <th className="px-6 py-4 text-center text-sm font-medium">No</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Riddle Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Episode</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Riddle Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {riddles.map((riddle, idx) => (
                        <tr key={riddle.no} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-center">{riddle.no}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.episode}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.type}</td>
                            <td className="px-6 py-4 relative">
                                <RouteActionsMenu
                                    open={menuOpenIdx === idx}
                                    onOpen={() => setMenuOpenIdx(idx)}
                                    onClose={() => setMenuOpenIdx(null)}
                                    gameID={gameID}
                                    routeID={routeID}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-start border-t border-gray-200 mt-5'>
                <BackButton />
            </div>
        </div>
    );
};

export default RouteTable;
