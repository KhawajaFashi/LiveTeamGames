"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';
import RouteActionsMenu from '@/app/(root)/games/new-route/components/RouteActionsMenu';
import EndLocationPicker from '@/app/(root)/games/new-route/components/EndLocationPicker';
import { useCallback } from 'react';
import BackButton from './BackButton';
import { FaGear } from 'react-icons/fa6';
import { PiGearBold } from 'react-icons/pi';

import { useEffect } from 'react';
import { RIDDLE_COORDINATES } from '../../../../../Backend/config/riddleCoordinates';
import { RIDDLE_DEFAULTS } from '../../../../../Backend/config/riddleDefaults';
import api from '@/utils/axios';

interface RouteTableProps {
    gameID: string;
    routeID: string;
}

const RouteTable: React.FC<RouteTableProps> = ({ gameID, routeID }) => {
    // Delete modal state
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    // Change Type modal state
    const [changeTypeOpen, setChangeTypeOpen] = useState(false);
    const [changeCategory, setChangeCategory] = useState('Standard');
    const [changeType, setChangeType] = useState('Augmented Reality');
    const [changeRiddle, setChangeRiddle] = useState('Spectacular Start');
    const [updateTexts, setUpdateTexts] = useState(true);
    const [keepTextContents, setKeepTextContents] = useState(false);
    const [changeIdx, setChangeIdx] = useState<number | null>(null);
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const router = useRouter();
    type RiddleType = 'Location Based Riddle' | 'Augmented Reality' | 'Multiple Choice' | 'Action Pack' | 'Mini Game';
    type RiddleCategory = 'Standard' | 'Indoor' | 'Bachelor Game' | 'Bachelorette Game' |
        'Bachelor Game No Action Pack' | 'Bachelorette Game No Action Pack' |
        'Cristmas Adventures' | 'Cristmas Adventures No Action Pack';

    interface Riddle {
        no: number;
        gameName: string;
        _id?: string;
        name: string;
        episode: number | string;
        type: string;
        category?: string;
        // backend may return GeoJSON or simple array
        coordinates?: { type: string; coordinates: number[] } | number[] | string[];
        radius?: number;
        description?: string;
        solutions?: string[];
        hint?: string;
        maxScore?: number;
        tries?: number;
        deductionPercent?: number;
        allowedAttempts?: number;
        allowedTime?: number;
        metaData?: string;
        helpImage?: string;
        conditionalExitPoint?: boolean;
        accessConditionType?: string;
        accessConditionAmount?: string | number;
        arImageTarget?: string;
        picture?: string;
        piture?: string;
    }

    // Riddle table state
    const [riddles, setRiddles] = useState<Riddle[]>([]);
    // Anchor refs for action menus
    const menuAnchorRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    // Fetch riddles for this route from backend
    useEffect(() => {
        async function fetchRiddles() {
            try {
                if (!routeID) return;
                const res = await api.get(`/games/fetch_route_riddles?routeName=${encodeURIComponent(routeID)}`);
                console.log(res.data)
                if (res.data.success) {
                    // Add fallback for missing fields and number them
                    setRiddles(res.data.data.map((riddle: any, idx: number) => ({
                        no: idx + 1,
                        name: riddle.name || riddle.riddleName || 'Unnamed Riddle',
                        episode: riddle.episode || '-',
                        type: riddle.type || '-',
                        ...riddle,
                    })));
                } else {
                    setRiddles([]);
                }
            } catch (err) {
                setRiddles([]);
            }
        }
        fetchRiddles();
    }, [routeID]);

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
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editCoordinates, setEditCoordinates] = useState<string[]>(['', '']);
    const [endLocationPickerOpen, setEndLocationPickerOpen] = useState(false); // used by gear/settings modal
    const [editLocationPickerOpen, setEditLocationPickerOpen] = useState(false); // used by edit riddle modal
    const [editRadius, setEditRadius] = useState('30');
    const [editDescription, setEditDescription] = useState('');
    const [editPicture, setEditPicture] = useState('');
    const [editMaxScore, setEditMaxScore] = useState('1000');
    const [editTries, setEditTries] = useState('1');
    const [editDeductionPercent, setEditDeductionPercent] = useState('10');
    const [editAllowedAttempts, setEditAllowedAttempts] = useState('3');
    const [editAllowedTime, setEditAllowedTime] = useState('');
    const [editHint, setEditHint] = useState('');
    const [editMetaData, setEditMetaData] = useState('');
    const [editHelpImage, setEditHelpImage] = useState('/profile.png');
    const [editConditionalExitPoint, setEditConditionalExitPoint] = useState(false);
    const [editAccessConditionType, setEditAccessConditionType] = useState('');
    const [editAccessConditionAmount, setEditAccessConditionAmount] = useState('0');
    const [editArImageTarget, setEditArImageTarget] = useState('');
    // Solutions state for Riddle tab
    const [solutions, setSolutions] = useState<string[]>(['1701']);
    const [solutionInput, setSolutionInput] = useState('');

    // Riddle options (mock)
    const riddleCategories = ['Standard', 'Indoor', 'Bachelor Game', 'Bachelorette Game', 'Bachelor Game No Action Pack', 'Bachelorette Game No Action Pack', 'Cristmas Adventures', 'Cristmas Adventures No Action Pack'];
    const riddleTypes = ['Augmented Reality', 'Location Based Riddle', 'Action Pack', 'Mini Game', 'Multiple Choice'];

    // Per-type and per-category riddle options. Keys are the full type string.
    const RIDDLE_OPTIONS_BY_TYPE: Record<string, Record<string, string[]>> = {
        'Augmented Reality': {
            Standard: ['AR Safe 1 (Numbers)', 'AR Safe 2 (Colors)', 'AR Laura Hunt'],
            Indoor: ['AR Indoor 1', 'AR Indoor 2', 'AR Indoor 3'],
            'Bachelor Game': ['AR Bachelor 1', 'AR Bachelor 2'],
            'Bachelorette Game': ['AR Bachelorette 1'],
            'Bachelor Game No Action Pack': ['AR Bachelor No Pack'],
            'Bachelorette Game No Action Pack': ['AR Bachelorette No Pack'],
            'Cristmas Adventures': ['AR Christmas 1', 'AR Christmas 2'],
            'Cristmas Adventures No Action Pack': ['AR Christmas No Pack'],
            default: ['AR Generic', 'AR Video', 'AR LBR'],
        },
        'Location Based Riddle': {
            Standard: ['LBR Standard 1', 'LBR Standard 2'],
            Indoor: ['LBR Indoor 1'],
            'Bachelor Game': ['LBR Bachelor 1'],
            'Bachelorette Game': ['LBR Bachelorette 1'],
            'Bachelor Game No Action Pack': ['LBR Bachelor No Pack'],
            'Bachelorette Game No Action Pack': ['LBR Bachelorette No Pack'],
            'Cristmas Adventures': ['LBR Christmas 1'],
            'Cristmas Adventures No Action Pack': ['LBR Christmas No Pack'],
            default: ['LBR Generic'],
        },
        'Action Pack': {
            Standard: ['AP Standard 1', 'AP Standard 2'],
            Indoor: ['AP Indoor 1', 'AP Indoor 2'],
            'Bachelor Game': ['AP Bachelor 1'],
            'Bachelorette Game': ['AP Bachelorette 1'],
            'Bachelor Game No Action Pack': ['AP Bachelor No Pack'],
            'Bachelorette Game No Action Pack': ['AP Bachelorette No Pack'],
            'Cristmas Adventures': ['AP Christmas 1'],
            'Cristmas Adventures No Action Pack': ['AP Christmas No Pack'],
            default: ['AP Generic 1'],
        },
        'Mini Game': {
            Standard: ['MG Standard 1'],
            Indoor: ['MG Indoor 1'],
            'Bachelor Game': ['MG Bachelor 1'],
            'Bachelorette Game': ['MG Bachelorette 1'],
            'Bachelor Game No Action Pack': ['MG Bachelor No Pack'],
            'Bachelorette Game No Action Pack': ['MG Bachelorette No Pack'],
            'Cristmas Adventures': ['MG Christmas 1'],
            'Cristmas Adventures No Action Pack': ['MG Christmas No Pack'],
            default: ['MG Quick Play', 'MG Puzzle'],
        },
        'Multiple Choice': {
            Standard: ['MC Quiz Standard 1'],
            Indoor: ['MC Quiz Indoor 1'],
            'Bachelor Game': ['MC Quiz Bachelor'],
            'Bachelorette Game': ['MC Quiz Bachelorette'],
            'Bachelor Game No Action Pack': ['MC Bachelor No Pack'],
            'Bachelorette Game No Action Pack': ['MC Bachelorette No Pack'],
            'Cristmas Adventures': ['MC Christmas 1'],
            'Cristmas Adventures No Action Pack': ['MC Christmas No Pack'],
            default: ['MC Quiz 1', 'MC Quiz 2'],
        },
    };

    function getOptionsFor(type: string, category: string) {
        const byType = RIDDLE_OPTIONS_BY_TYPE[type] || {};
        // try exact category
        if (byType[category]) return byType[category];
        if (byType['default']) return byType['default'];
        // fallback: gather all options for type
        return Object.values(byType).flat();
    }

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

    // Gear settings state (used in Settings modal)
    const [gearArVideoTutorial, setGearArVideoTutorial] = useState('');
    const [gearIntroVideo, setGearIntroVideo] = useState('');
    const [gearOutroWinVideo, setGearOutroWinVideo] = useState('');
    const [gearOutroLoseVideo, setGearOutroLoseVideo] = useState('');
    const [gearStartText, setGearStartText] = useState('Are you ready to start your mission?');
    const [gearEndText, setGearEndText] = useState("Well done, you've made it! Now, return to your starting point.");
    const [gearEndLocationActive, setGearEndLocationActive] = useState(false);
    const [gearEndLocationName, setGearEndLocationName] = useState('');
    const [gearEndLocationCoordinates, setGearEndLocationCoordinates] = useState({ lat: '', lng: '' });

    // Media picker state
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const openMediaPickerFor = (target: string) => {
        setMediaTarget(target);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (file: any) => {
        if (!file) return;
        const src = file.src || '/profile.png';
        // Map mediaTarget to gear / riddle fields
        if (mediaTarget === 'picture') setEditPicture(src);
        else if (mediaTarget === 'helpImage') setEditHelpImage(src);
        else if (mediaTarget === 'arImage') setEditArImageTarget(src);
        else if (mediaTarget === 'arVideoTutorial') setGearArVideoTutorial(src);
        else if (mediaTarget === 'introVideo') setGearIntroVideo(src);
        else if (mediaTarget === 'outroWinVideo') setGearOutroWinVideo(src);
        else if (mediaTarget === 'outroLoseVideo') setGearOutroLoseVideo(src);
        // clear target and close picker
        setMediaTarget(null);
        setMediaPickerOpen(false);
    };

    // Handler to open edit modal with riddle data
    const handleEditRiddle = useCallback((idx: number) => {
        const r = riddles[idx];
        setEditIdx(idx);
        setEditId((r as any)._id || null);
        setEditName(r.name || '');
        // coordinates in r may be { type: 'Point', coordinates: [lng, lat] }
        // normalize coordinates: accept GeoJSON { type, coordinates }, number[] or string[]
        if (r.coordinates && typeof r.coordinates === 'object' && 'coordinates' in r.coordinates && Array.isArray((r.coordinates as any).coordinates)) {
            setEditCoordinates((r.coordinates as any).coordinates.map((c: any) => String(c)));
        } else if (Array.isArray(r.coordinates)) {
            setEditCoordinates((r.coordinates as any).map((c: any) => String(c)));
        } else {
            setEditCoordinates(['', '']);
        }
        setEditRadius(r.radius ? String(r.radius) : '30');
        setEditDescription(r.description || '');
        setEditPicture((r as any).picture || (r as any).piture || '');
        setSolutions(r.solutions && r.solutions.length ? r.solutions : []);
        setEditMaxScore(r.maxScore ? String(r.maxScore) : '1000');
        setEditTries(r.tries ? String(r.tries) : '1');
        setEditDeductionPercent(r.deductionPercent ? String(r.deductionPercent) : '10');
        setEditAllowedAttempts(r.allowedAttempts ? String(r.allowedAttempts) : '3');
        setEditAllowedTime(r.allowedTime ? String(r.allowedTime) : '');
        setEditMetaData(r.metaData || '');
        setEditHelpImage(r.helpImage || '/profile.png');
        setEditHint(r.hint || '');
        setEditConditionalExitPoint(Boolean(r.conditionalExitPoint));
        setEditAccessConditionType(r.accessConditionType || '');
        setEditAccessConditionAmount(r.accessConditionAmount ? String(r.accessConditionAmount) : '0');
        setEditArImageTarget(r.arImageTarget || '');
        setEditRiddleOpen(true);
    }, [riddles]);

    const openChangeType = (idx: number) => {
        const r = riddles[idx];
        if (!r) return;
        setChangeIdx(idx);
        setChangeCategory(r.category || 'Standard');
        const t = r.type || 'Augmented Reality';
        setChangeType(t);
        // ensure the selected riddle option exists in the options for this type/category
        const opts = getOptionsFor(t, r.category || 'Standard');
        setChangeRiddle(opts.includes(r.name) ? r.name : (opts[0] || r.name || ''));
        setChangeTypeOpen(true);
    };

    // Keep the selected riddle in-sync when the type or category changes.
    // If the current selection is still valid for the newly selected type/category, keep it.
    // Otherwise pick the first valid option so the UI and save payload stay consistent.
    useEffect(() => {
        const opts = getOptionsFor(changeType, changeCategory);
        if (!opts || opts.length === 0) return;
        if (opts.includes(changeRiddle)) return; // keep current if still valid
        setChangeRiddle(opts[0] || '');
    }, [changeType, changeCategory]);

    const handleSaveChangeType = async () => {
        if (changeIdx === null) return;
        const r = riddles[changeIdx];
        console.log(r, changeRiddle);
        try {
            const payload = {
                _id: r._id,
                gameName: r.gameName || gameID,
                name: changeRiddle,
                type: changeType,
                category: changeCategory,
                updateTexts: updateTexts,
                keepTextContents: keepTextContents
            };
            const res = await api.post('/games/edit_riddle_structure', payload);
            if (res.data && res.data.success) {
                const updated = res.data.data;
                setRiddles(prev => prev.map((x, i) => i === changeIdx ? { ...x, ...updated } : x));
                setChangeTypeOpen(false);
                setChangeIdx(null);
            } else {
                console.error('Change type failed', res.data);
            }
        } catch (err) {
            console.error('Error changing riddle type', err);
        }
    };

    // Handler to save edit (send to backend)
    const handleSaveEdit = async () => {
        if (editIdx === null) return;
        try {
            const payload = {
                gameName: gameID,
                _id: editId,
                name: editName,
                episode: Number(riddles[editIdx].episode) || 1,
                coordinates: editCoordinates.map(Number),
                radius: Number(editRadius),
                description: editDescription,
                picture: editPicture,
                solutions,
                hint: '',
                maxScore: Number(editMaxScore),
                tries: Number(editTries),
                deductionPercent: Number(editDeductionPercent),
                allowedAttempts: Number(editAllowedAttempts),
                allowedTime: editAllowedTime ? Number(editAllowedTime) : undefined,
                metaData: editMetaData,
                helpImage: editHelpImage,
                conditionalExitPoint: editConditionalExitPoint,
                accessConditionType: editAccessConditionType,
                accessConditionAmount: editAccessConditionAmount,
                arImageTarget: editArImageTarget
            };

            const res = await api.post('/games/edit_riddle', payload);
            if (res.data && res.data.success) {
                const updated = res.data.data;
                setRiddles(prev => prev.map((r, idx) => idx === editIdx ? { ...r, ...updated } as Riddle : r));
                setEditRiddleOpen(false);
            } else {
                console.error('Edit riddle failed', res.data);
            }
        } catch (err) {
            console.error('Error saving riddle edit', err);
        }
    };

    useEffect(() => {
        const fetchGearSettings = async () => {
            try {
                const res = await api.get(`/games/fetch_gear_settings?routeId=${encodeURIComponent(routeID)}`);
                if (res.data?.success && res.data?.gearSettings) {
                    const g = res.data.gearSettings;
                    setGearArVideoTutorial(g.arVideoTutorial || '');
                    setGearIntroVideo(g.introVideo || '');
                    setGearOutroWinVideo(g.outroWinVideo || '');
                    setGearOutroLoseVideo(g.outroLoseVideo || '');
                    setGearStartText(g.startText || '');
                    setGearEndText(g.endText || '');
                    setGearEndLocationActive(g.endLocation?.active || false);
                    setGearEndLocationName(g.endLocation?.name || '');
                    setGearEndLocationCoordinates({
                        lat: g.endLocation?.coordinates?.lat?.toString() || '',
                        lng: g.endLocation?.coordinates?.lng?.toString() || '',
                    });
                }
            } catch (err) {
                console.error('Failed to fetch gear settings:', err);
            }
        };

        fetchGearSettings();
    }, []);

    console.log("GearEnd Location:", gearEndLocationActive)

    return (
        <div className="bg-white shadow-sm">
            <div className='flex justify-between items-center mb-8 p-4 border-b border-gray-200'>
                <h3 className="text-3xl font-semibold">{routeID}</h3>
                <div className="flex items-center gap-2 relative">
                    <button className="bg-[#009FE3] text-white px-4 py-1.5">English</button>
                    {/* Gear/settings icon */}
                    <button
                        className="bg-[#009FE3] p-2.5 flex items-center justify-center hover:bg-[#007bb5] focus:outline-none"
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
                                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={riddleType} onChange={e => {
                                            const val = e.target.value; setRiddleType(val);
                                            // update riddle option to a valid one for this type/category
                                            const opts = getOptionsFor(val, riddleCategory);
                                            setRiddle(opts[0] || '');
                                        }}>
                                            {riddleTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Riddle <span className="text-red-500">*</span></label>
                                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={riddle} onChange={e => setRiddle(e.target.value)}>
                                            {getOptionsFor(riddleType, riddleCategory).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Add to Episode <span className="text-red-500">*</span></label>
                                        <input type="number" min="1" max="9" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded text-sm" value={episode} onChange={e => setEpisode(e.target.value)} />
                                    </div>
                                    <div className="flex justify-end gap-2 px-8 py-6">
                                        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddRiddleOpen(false)}>Close</button>
                                        <button
                                            className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]"
                                            onClick={async () => {
                                                try {
                                                    // Get coordinates and defaults based on category and type
                                                    const riddleTypeKey = riddleType as RiddleType;
                                                    const categoryKey = riddleCategory as RiddleCategory;

                                                    const coordinates = RIDDLE_COORDINATES[riddleTypeKey]?.[categoryKey]?.coordinates || ["52.520008", "13.404954"];
                                                    const defaults = RIDDLE_DEFAULTS[riddleTypeKey]?.[categoryKey] || RIDDLE_DEFAULTS["Location Based Riddle"]["Standard"];
                                                    const radius = RIDDLE_COORDINATES[riddleTypeKey]?.[categoryKey]?.radius || 30;

                                                    const newRiddle: Omit<Riddle, 'no'> & { routeName: string } = {
                                                        gameName: gameID,
                                                        name: riddle,
                                                        episode: Number(episode),
                                                        type: riddleType,
                                                        category: riddleCategory,
                                                        routeName: routeID,
                                                        coordinates,
                                                        radius,
                                                        allowedTime: defaults.allowedTime,
                                                        deductionPercent: defaults.deductionPercent
                                                    };

                                                    // Send to backend
                                                    const response = await api.post<Riddle>('/games/add_riddle', newRiddle);

                                                    if (response.data) {
                                                        // Add riddle to table with the data from response
                                                        setRiddles(prev => [
                                                            ...prev,
                                                            {
                                                                ...response.data,
                                                                no: prev.length + 1,
                                                                name: riddle,
                                                                episode: Number(episode),
                                                                type: riddleType,
                                                            },
                                                        ]);
                                                        setAddRiddleOpen(false);
                                                    }
                                                } catch (error) {
                                                    console.error('Error adding riddle:', error);
                                                    // You might want to show an error message to the user here
                                                }
                                                {editLocationPickerOpen && (
                                                    <EndLocationPicker
                                                        open={editLocationPickerOpen}
                                                        initialCoords={editCoordinates[0] && editCoordinates[1] ? [editCoordinates[0], editCoordinates[1]] : undefined}
                                                        onClose={() => setEditLocationPickerOpen(false)}
                                                        onSelect={(coords) => { setEditCoordinates(coords); setEditLocationPickerOpen(false); }}
                                                    />
                                                )}
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
                                        <div className="grid grid-cols-1 gap-4 items-start mb-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">AR Tutorial Video</div>
                                                    <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => openMediaPickerFor('arVideoTutorial')}>
                                                        Upload from media
                                                    </button>
                                                </div>
                                                {gearArVideoTutorial ? (
                                                    <div className="ml-4 w-48 text-right text-sm text-gray-700">Selected: <a href={gearArVideoTutorial} target="_blank" rel="noreferrer" className="underline">preview</a></div>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Intro Video</div>
                                                    <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => openMediaPickerFor('introVideo')}>
                                                        Upload from media
                                                    </button>
                                                </div>
                                                {gearIntroVideo ? (
                                                    <div className="ml-4 w-48 text-right text-sm text-gray-700">Selected: <a href={gearIntroVideo} target="_blank" rel="noreferrer" className="underline">preview</a></div>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Outro Win Video</div>
                                                    <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => openMediaPickerFor('outroWinVideo')}>
                                                        Upload from media
                                                    </button>
                                                </div>
                                                {gearOutroWinVideo ? (
                                                    <div className="ml-4 w-48 text-right text-sm text-gray-700">Selected: <a href={gearOutroWinVideo} target="_blank" rel="noreferrer" className="underline">preview</a></div>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Outro Lose Video</div>
                                                    <button type="button" className="text-[#009FE3] text-sm hover:underline" onClick={() => openMediaPickerFor('outroLoseVideo')}>
                                                        Upload from media
                                                    </button>
                                                </div>
                                                {gearOutroLoseVideo ? (
                                                    <div className="ml-4 w-48 text-right text-sm text-gray-700">Selected: <a href={gearOutroLoseVideo} target="_blank" rel="noreferrer" className="underline">preview</a></div>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'Start Text' && (
                                        <div className="text-gray-500 pb-59.5 pt-2 text-center">
                                            <textarea className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 min-h-[120px]" value={gearStartText} onChange={(e) => setGearStartText(e.target.value)} />
                                        </div>
                                    )}
                                    {activeTab === 'End Text' && (
                                        <div className="text-gray-500 pb-59.5 pt-2 text-center">
                                            <textarea className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 min-h-[120px]" value={gearEndText} onChange={(e) => setGearEndText(e.target.value)} />
                                        </div>
                                    )}
                                    {activeTab === 'End Location' && (
                                        <div className="text-gray-500 grid grid-cols-[1fr_1.8fr] items-start gap-6 pt-2 text-center">
                                            {/* <div> */}
                                            <label className='block text-gray-700 text-left font-medium mb-1'>Enable End Location</label>
                                            <input type="checkbox" className='mr-2 w-4 h-4 accent-[#009FE3]' checked={gearEndLocationActive} onChange={e => setGearEndLocationActive(e.target.checked)} />
                                            {/* </div> */}
                                            {/* <div className={`text-left ${gearEndLocationActive ? '' : 'hidden'}`}> */}
                                            <label className={`block text-gray-700 font-medium mb-1 text-left ${gearEndLocationActive ? '' : 'hidden'}`}>Name <span className="text-red-500">*</span></label>
                                            <input type="text" className={`border px-3 py-2 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 ${gearEndLocationActive ? '' : 'hidden'}`} value={gearEndLocationName} onChange={e => setGearEndLocationName(e.target.value)} />
                                            <label className={`block text-gray-700 font-medium mt-3 mb-1 text-left ${gearEndLocationActive ? '' : 'hidden'}`}>Coordinates</label>
                                            <div className={`border p-3 rounded bg-white border-gray-200 text-left ${gearEndLocationActive ? '' : 'hidden'}`}>
                                                <button className="text-[#009FE3] text-sm font-medium text-left mb-1" onClick={() => setEndLocationPickerOpen(true)}>&#128205; Set coordinates on map</button>
                                                <div className="text-sm text-gray-700 mt-2 text-left">
                                                    <div>{gearEndLocationCoordinates.lat || '-'} </div>
                                                    <div>{gearEndLocationCoordinates.lng || '-'} </div>
                                                </div>
                                            </div>
                                            {/* </div> */}
                                            {endLocationPickerOpen && (
                                                <EndLocationPicker
                                                    open={endLocationPickerOpen}
                                                    initialCoords={gearEndLocationCoordinates.lat && gearEndLocationCoordinates.lng ? [String(gearEndLocationCoordinates.lat), String(gearEndLocationCoordinates.lng)] : undefined}
                                                    onClose={() => setEndLocationPickerOpen(false)}
                                                    onSelect={(coords) => { setGearEndLocationCoordinates({ lat: coords[0], lng: coords[1] }); setEndLocationPickerOpen(false); }}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {activeTab && (
                                        <div className='border-t border-gray-200 pt-4 flex justify-end px-6 absolute bottom-4 w-[90%]'>
                                            <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" onClick={async () => {
                                                try {
                                                    const payload: any = {
                                                        routeID: routeID || routeID,
                                                        gearSettings: {
                                                            startText: gearStartText,
                                                            endText: gearEndText,
                                                            endLocation: {
                                                                active: Boolean(gearEndLocationActive),
                                                                name: gearEndLocationName,
                                                                coordinates: {
                                                                    lat: gearEndLocationCoordinates.lat ? Number(gearEndLocationCoordinates.lat) : 0,
                                                                    lng: gearEndLocationCoordinates.lng ? Number(gearEndLocationCoordinates.lng) : 0,
                                                                }
                                                            },
                                                            arVideoTutorial: gearArVideoTutorial,
                                                            introVideo: gearIntroVideo,
                                                            outroWinVideo: gearOutroWinVideo,
                                                            outroLoseVideo: gearOutroLoseVideo,
                                                        }
                                                    };
                                                    const res = await api.post('/games/update_gear_settings', payload);
                                                    if (res.data && res.data.success) {
                                                        // close modal and optionally show a success state
                                                        console.log(res.data);
                                                        setSettingsModalOpen(false);
                                                    } else {
                                                        console.error('Failed to update gear settings', res.data);
                                                    }
                                                } catch (err) {
                                                    console.error('Error saving gear settings', err);
                                                }
                                            }}>Save Changes</button>
                                        </div>
                                    )}
                                </div>
                                {/* Media Picker Popup (moved to top-level) */}
                            </div>
                        </div>
                    )}
                </div>
                {previewOpen && (
                    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                        <div className="bg-white rounded-lg shadow-xl max-w-[90%] max-h-[90%] p-4">
                            <div className="flex justify-end mb-2">
                                <button className="text-gray-500" onClick={() => setPreviewOpen(false)}>&times;</button>
                            </div>
                            <div className="flex items-center justify-center">
                                <img src={previewUrl} alt="preview" className="max-w-full max-h-[80vh] object-contain" />
                            </div>
                        </div>
                    </div>
                )}
                {/* Global Media Picker for the page - used by any 'Select from Media' button */}
                <MediaPicker open={mediaPickerOpen} onClose={() => { setMediaPickerOpen(false); setMediaTarget(null); }} onSelect={handleMediaSelect} />
            </div>
            <div className='overflow-auto px-4 h-100'>
                <table className="w-full mx-auto shadow-sm overflow-auto">
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
                                    <button
                                        ref={el => {
                                            if (!menuAnchorRefs.current) return;
                                            menuAnchorRefs.current[idx] = el;
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <RouteActionsMenu
                                        open={menuOpenIdx === idx}
                                        onOpen={() => setMenuOpenIdx(idx)}
                                        onClose={() => setMenuOpenIdx(null)}
                                        gameID={gameID}
                                        routeID={routeID}
                                        onEdit={() => { setMenuOpenIdx(null); handleEditRiddle(idx); }}
                                        onChangeType={() => { setMenuOpenIdx(null); openChangeType(idx); }}
                                        onDelete={() => { setMenuOpenIdx(null); setDeleteOpen(true); setDeleteIdx(idx); setDeleteConfirm(''); }}
                                        anchorRef={menuAnchorRefs.current && menuAnchorRefs.current[idx] ? { current: menuAnchorRefs.current[idx] as HTMLButtonElement } : undefined}
                                    />
                                    {/* Change Type Modal */}
                                    {changeTypeOpen && changeIdx === idx && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
                                            <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-full p-0 relative">
                                                <div className="flex items-center justify-between px-8 pt-8 pb-2 border-b border-gray-200">
                                                    <h2 className="text-xl font-semibold">Change Type - {changeIdx !== null ? riddles[changeIdx]?.name : ''}</h2>
                                                    <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => { setChangeTypeOpen(false); setChangeIdx(null); }}>&times;</button>
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
                                                            {getOptionsFor(changeType, changeCategory).map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
                                                    <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => { setChangeTypeOpen(false); setChangeIdx(null); }}>Close</button>
                                                    <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" onClick={handleSaveChangeType}>Save</button>
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
                                                            className={`px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5] ${deleteConfirm !== 'DELETE' || deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                                                            onClick={async () => {
                                                                if (deleteIdx === null) return;
                                                                if (deleteConfirm !== 'DELETE') return;
                                                                const target = riddles[deleteIdx];
                                                                const riddleId = (target as any)?._id || (target as any)?.id;
                                                                if (!riddleId) {
                                                                    // fallback: remove locally
                                                                    setRiddles(prev => prev.filter((_, idx) => idx !== deleteIdx));
                                                                    setDeleteOpen(false);
                                                                    return;
                                                                }
                                                                try {
                                                                    setDeleteLoading(true);
                                                                    // axios delete with body: pass data in config
                                                                    const res = await api.delete('/games/delete_riddle', { data: { _id: riddleId } });
                                                                    if (res.data && res.data.success) {
                                                                        setRiddles(prev => prev.filter(r => String((r as any)._id) !== String(riddleId)));
                                                                        setDeleteOpen(false);
                                                                    } else {
                                                                        console.error('Delete failed', res.data);
                                                                        // still remove locally to keep UX consistent? keep modal open to let user retry
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Error deleting riddle', err);
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
                                    {editRiddleOpen && (
                                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
                                            <div className="bg-white rounded-lg shadow-xl max-xl:w-[40%] w-[35%] max-lg:w-[95%] max-w-full p-0 relative my-5">
                                                {/* Header: dark, title left, close right */}
                                                <div className="flex items-center justify-between px-8 pt-0 pb-0 bg-[#00112b] rounded-t-md" style={{ minHeight: 56 }}>
                                                    <h2 className="text-xl font-semibold text-white py-8">{editName}</h2>
                                                    <button className="text-gray-400 hover:text-gray-200 text-2xl py-4" onClick={() => setEditRiddleOpen(false)}>&times;</button>
                                                </div>
                                                {/* Tabs */}
                                                <div className="px-8 max-lg:px-4 py-4 bg-white">
                                                    <div className="flex gap-2 border-b border-gray-200 pb-0 mb-4 mt-0">
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Location' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Location')}>Location</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Riddle' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Riddle')}>Riddle</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'Settings' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('Settings')}>Settings</button>
                                                        <button className={`px-4 py-2 text-sm font-medium ${tabs === 'PRO' ? 'border-b-2 border-[#009FE3] text-[#009FE3]' : ''}`} onClick={() => setTabs('PRO')}>PRO</button>
                                                    </div>
                                                </div>
                                                {tabs === 'Location' &&
                                                    <div className="px-8 h-[55vh]">
                                                        <div className="bg-white grid grid-cols-[1fr_3fr_24px] gap-x-4 gap-y-6 items-center mb-2">
                                                            {/* Form */}
                                                            <label className="text-gray-700 font-medium text-left">Name <span className="text-red-500">*</span></label>
                                                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editName} onChange={e => setEditName(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Enter a short, descriptive name for this riddle. It helps identify the riddle within the route.
                                                                </div>
                                                            </span>
                                                            <label className="text-gray-700 font-medium text-ledt">Coordinates</label>
                                                            <div className="flex flex-col gap-1">
                                                                <button className="text-[#009FE3] text-sm font-medium text-left mb-1" onClick={() => setEndLocationPickerOpen(true)}>&#128205; Set coordinates on map</button>
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editCoordinates[0]} onChange={e => setEditCoordinates([e.target.value, editCoordinates[1]])} />
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editCoordinates[1]} onChange={e => setEditCoordinates([editCoordinates[0], e.target.value])} />
                                                            </div>
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    GPS location where this riddle is triggered. Players must reach this point to activate it.
                                                                </div>
                                                            </span>
                                                            <label className="text-gray-700 font-medium text-left">Radius <span className="text-red-500">*</span></label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editRadius} onChange={e => setEditRadius(e.target.value)} />
                                                                <span className="ml-2">Meters</span>
                                                            </div>
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Distance (in meters) around the coordinates where the riddle becomes active. Use at least 10 meters for accuracy.
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                }
                                                {tabs === 'Settings' &&
                                                    <div className="px-8 bg-white overflow-y-auto h-[55vh]">
                                                        <div className="grid grid-cols-[1fr_2fr_24px] max-lg:text-[12px] gap-x-4 gap-y-6 text-[13px] items-center mb-2 bg-white w-full">
                                                            {/* Allowed Attempts */}
                                                            <label className="text-gray-700 font-medium text-left">Allowed Attempts</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editAllowedAttempts} onChange={e => setEditAllowedAttempts(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Total number of attempts before the riddle locks. Set to 0 for unlimited tries.
                                                                </div>
                                                            </span>
                                                            {/* Allowed Time */}
                                                            <label className="text-gray-700 font-medium text-left">Allowed Time</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" placeholder="Allowed Time (Minutes)" value={editAllowedTime} onChange={e => setEditAllowedTime(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Time limit (in seconds or minutes) to solve the riddle. Set to 0 for no limit.
                                                                </div>
                                                            </span>
                                                            {/* Meta Data */}
                                                            <label className="text-gray-700 font-medium text-left">Meta Data</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={3} value={editMetaData} onChange={e => setEditMetaData(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Internal or developer-only info, e.g., custom tags, difficulty level, or backend identifiers.
                                                                </div>
                                                            </span>
                                                            {/* Help Image */}
                                                            <label className="text-gray-700 font-medium text-left">Help Image</label>
                                                            <div className="flex flex-col gap-1 relative">
                                                                {!editHelpImage ? (
                                                                    <button className="text-[#009FE3] text-sm font-medium text-left mb-1" onClick={() => openMediaPickerFor('helpImage')}>Select from Media</button>
                                                                ) : (
                                                                    <div className="w-48 h-32 relative group">
                                                                        <img src={editHelpImage} alt="help" className="w-full h-full object-cover rounded" />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setEditHelpImage(''); }}>🗑️</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => { openMediaPickerFor('helpImage') }}>🔁</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setPreviewUrl(editHelpImage); setPreviewOpen(true); }}>👁</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Optional image shown when players request a hint.
                                                                </div>
                                                            </span>
                                                            {/* Conditional Exit Point */}
                                                            <label className="text-gray-700 font-medium text-left">Conditional Exit Point</label>
                                                            <div className="flex items-center gap-2">
                                                                <input type="checkbox" className="mr-2 w-4 h-4 accent-[#009FE3]" id="isExitPoint" checked={editConditionalExitPoint} onChange={e => setEditConditionalExitPoint(e.target.checked)} />
                                                                <label htmlFor="isExitPoint" className="text-gray-600 text-sm">Is Exit Point</label>
                                                            </div>
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Defines what happens after solving this riddle — e.g., unlocks a specific next riddle or triggers an event.
                                                                </div>
                                                            </span>
                                                            {/* </div> */}
                                                        </div>
                                                        {riddles.some(r => r.name === editName && r.type === 'Augmented Reality') &&
                                                            <div className="grid grid-cols-[1fr_2fr_24px] max-lg:text-[12px] gap-x-4 gap-y-6 text-[13px] items-center mb-2 bg-white w-full">
                                                                {/* AR Image Target */}
                                                                <label className="text-gray-700 font-medium text-left">AR Image Target</label>
                                                                <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editArImageTarget} onChange={e => setEditArImageTarget(e.target.value)}>
                                                                    <option value="custom">Custom Target</option>
                                                                </select>
                                                                <span className="text-black cursor-pointer group relative" title="Info">
                                                                    <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                        <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                    </svg>
                                                                    <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                        Upload the target image used to anchor AR content in the real world and preview it.
                                                                    </div>
                                                                </span>
                                                                {/* AR Image Preview */}
                                                                <label className="text-gray-700 font-medium text-left">AR Image Preview</label>
                                                                {!editArImageTarget ? (
                                                                    <button className="text-[#009FE3] text-sm font-medium text-left mb-1" onClick={() => openMediaPickerFor('helpImage')}>Select from Media</button>
                                                                ) : (
                                                                    <div className="w-48 h-32 relative group">
                                                                        <img src={editArImageTarget} alt="AR Image" className="w-full h-full object-cover rounded" />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setEditHelpImage(''); }}>🗑️</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => { openMediaPickerFor('arImage') }}>🔁</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setPreviewUrl(editArImageTarget); setPreviewOpen(true); }}>👁</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <span className="text-black cursor-pointer group relative" title="Info">
                                                                    <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                        <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                    </svg>
                                                                    <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                        Attach an AR video or image used for augmented reality riddles. Only applicable if the riddle type is AR.
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                                {tabs === 'PRO' &&
                                                    <div className="px-8 pt-2 bg-white overflow-y-auto h-[55vh]">
                                                        <div className="grid grid-cols-[1fr_1fr] items-start gap-y-6">
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
                                                    <div className="px-8 bg-white overflow-y-auto h-[55vh]">
                                                        {riddles.some(r => r.name === editName && r.type === 'Augmented Reality') &&
                                                            <div className="grid grid-cols-[1fr_2fr_24px] max-lg:text-[12px] gap-x-4 gap-y-6 text-[13px] items-center mb-2 bg-white w-full">
                                                                {/* AR Video/Image */}
                                                                <label className="text-gray-700 font-medium text-left">AR Video or Image</label>
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="w-48 h-32 bg-gray-200 rounded flex items-center justify-center">
                                                                        <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#e5e7eb" /><polygon points="20,16 36,24 20,32" fill="#bbb" /></svg>
                                                                    </div>
                                                                </div>
                                                                <span className="text-black cursor-pointer group relative" title="Info">
                                                                    <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                        <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                    </svg>
                                                                    <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                        Attach an AR video or image used for augmented reality riddles. Only applicable if the riddle type is AR.
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        }
                                                        <div className="grid grid-cols-[1fr_2fr_24px] gap-x-4 gap-y-6 items-center mb-2 pb-0 bg-white text-[12px]">
                                                            {/* Picture */}
                                                            <label className="text-gray-700 font-medium text-left">Picture</label>
                                                            <div className="flex flex-col gap-1 relative">
                                                                {!editPicture ? (
                                                                    <button className="text-[#009FE3] text-sm font-medium text-left mb-1" onClick={() => openMediaPickerFor('picture')}>Select from Media</button>
                                                                ) : (
                                                                    <div className="w-48 h-32 relative group">
                                                                        <img src={editPicture} alt="picture" className="w-full h-full object-cover rounded" />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setEditPicture(''); }}>🗑️</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => openMediaPickerFor('picture')}>🔁</button>
                                                                            <button className="bg-white p-2 rounded" onClick={() => { setPreviewUrl(editPicture); setPreviewOpen(true); }}>👁</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Upload an image shown to players during the riddle. Useful for visual clues or environment immersion.
                                                                </div>
                                                            </span>
                                                            {/* Description */}
                                                            <label className="text-gray-700 font-medium text-left">Description</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={4} value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    A short narrative or instruction displayed to the team when they reach this riddle.
                                                                </div>
                                                            </span>
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
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Enter one or more correct answers that solve the riddle.
                                                                </div>
                                                            </span>
                                                            {/* Hint */}
                                                            <label className="text-gray-700 font-medium text-left">Hint</label>
                                                            <textarea className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" rows={3} value={editHint} onChange={e => setEditHint(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Provide a helpful clue that can be revealed if players are stuck.
                                                                </div>
                                                            </span>
                                                            {/* Max Score */}
                                                            <label className="text-gray-700 font-medium text-left">Max Score</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editMaxScore} onChange={e => setEditMaxScore(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Maximum points awarded for solving this riddle without errors or hints.
                                                                </div>
                                                            </span>
                                                            {/* Tries without penalty */}
                                                            <label className="text-gray-700 font-medium text-left">Tries without penalty</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editTries} onChange={e => setEditTries(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Number of incorrect attempts allowed before score deductions start.
                                                                </div>
                                                            </span>
                                                            {/* % Deduction */}
                                                            <label className="text-gray-700 font-medium text-left">% Deduction</label>
                                                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={editDeductionPercent} onChange={e => setEditDeductionPercent(e.target.value)} />
                                                            <span className="text-black cursor-pointer group relative" title="Info">
                                                                <svg width="18" height="18" className='bg-white' fill="currentColor" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="12" fill="#e5e7eb" />
                                                                    <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#333">?</text>
                                                                </svg>
                                                                <div className="absolute z-10 w-64 p-3 bg-white border border-gray-200 rounded -translate-x-[90%] opacity-0 shadow-lg text-xs text-gray-700 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                    Percentage of points deducted after each failed attempt beyond the penalty-free tries.
                                                                </div>
                                                            </span>
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
