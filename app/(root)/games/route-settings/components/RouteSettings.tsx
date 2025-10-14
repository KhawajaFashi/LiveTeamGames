"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/utils/axios';
import MediaPicker from '@/components/MediaPicker';
import { useRouter } from 'next/navigation';
import HighScore from '../../../../../pages/HighScore';

interface HighscoreRow {
    _id?: string;
    game?: string;
    name?: string;
    lastEdited?: string;
    saved?: string | number;
}

const RouteSettings = () => {
    // Get routeID and gameID from URL
    const searchParams = useSearchParams();
    const routeID = searchParams?.get('routeID') || '';
    const gameID = searchParams?.get('gameID') || '';
    const router = useRouter();
    const [highscoresArray, setHighscoresArray] = useState<HighscoreRow[]>([]);

    const [routeIdShow, setRouteIdShow] = useState(false);
    // General state
    const [routeName, setRouteName] = useState('hello');
    const [routeNameChanged, setRouteNameChanged] = useState('');
    const [playingTime, setPlayingTime] = useState('');
    const [numItems, setNumItems] = useState('3');
    const [cheatCode, setCheatCode] = useState('1337');
    const [adminCodeDefault, setAdminCodeDefault] = useState(true);
    const [adminCode, setAdminCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // fetch settings on mount
    useEffect(() => {
        async function fetchSettings() {
            if (!routeID) return;
            setLoading(true);
            try {
                const res = await api.get(`/games/fetch_settings?routeName=${encodeURIComponent(routeID)}`);
                if (res.data && res.data.success) {
                    const s = res.data.data;
                    setRouteName(s.name || '');
                    setRouteNameChanged(s.name || '');
                    setPlayingTime(s.playingTime || '');
                    setNumItems(s.numberOfItems ? String(s.numberOfItems) : '0');
                    setCheatCode(s.cheatCode || '');
                    setHighscore(s.highScore || '');
                    // Admin code presence -> use default unchecked (heuristic)
                    setAdminCode(s.adminCode);
                    // populate general flags and paths
                    const bgm = s.general?.backgroundMusic || {};
                    setBackgroundMusicPath(bgm.path || '');
                    setBackgroundMusicDefault(!(bgm.defaultStatus === true || bgm.defaultStatus === 'active'));

                    const gLogo = s.general?.gameLogo || {};
                    setGameLogoPath(gLogo.path || '');
                    setGameLogoDefault(!(gLogo.defaultStatus === true || gLogo.defaultStatus === 'active'));

                    const wBg = s.general?.welcomeBackground || {};
                    setWelcomeBgPath(wBg.path || '');
                    setWelcomeBgDefault(!(wBg.defaultStatus === true || wBg.defaultStatus === 'active'));

                    const hBg = s.general?.helpBackground || {};
                    setHelpBgPath(hBg.path || '');
                    setHelpBgDefault(!(hBg.defaultStatus === true || hBg.defaultStatus === 'active'));

                    const iIcon = s.general?.itemIcon || {};
                    setItemIconPath(iIcon.path || '');
                    setItemIconDefault(!(iIcon.defaultStatus === true || iIcon.defaultStatus === 'active'));

                    const sIcon = s.general?.scoreIcon || {};
                    setScoreIconPath(sIcon.path || '');
                    setScoreIconDefault(!(sIcon.defaultStatus === true || sIcon.defaultStatus === 'active'));

                    // white label
                    const wl = s.whiteLabel || {};
                    setWhiteLabelPath(wl.path || '');
                    setWhiteLabelDefault(!(wl.defaultStatus === true || wl.defaultStatus === 'active'));
                    setShowLogo(Boolean(gLogo.path));

                    // populate map flags and paths
                    const mStyle = s.map?.mapStyle || {};
                    setMapStylePath(mStyle.path || '');
                    setMapStyleDefault(!(mStyle.defaultStatus === true || mStyle.defaultStatus === 'active'));

                    const mq = s.map?.mapQuestMarker || {};
                    setMapQuestMarkerPath(mq.path || '');
                    setMapQuestActiveDefault(!(mq.defaultStatus === true || mq.defaultStatus === 'active'));
                    setMapQuestInactiveDefault(!(mq.defaultStatus === true || mq.defaultStatus === 'active'));

                    const mt = s.map?.mapTeamMarker || {};
                    setMapTeamMarkerPath(mt.path || '');
                    setMapTeamMarkerDefault(!(mt.defaultStatus === true || mt.defaultStatus === 'active'));

                    const fl = s.map?.finalLocationMarker || {};
                    setFinalLocationMarkerPath(fl.path || '');
                    setFinalLocationMarkerDefault(!(fl.defaultStatus === true || fl.defaultStatus === 'active'));

                    const ml = s.map?.mapLoader || {};
                    setMapLoaderPath(ml.path || '');
                    setMapLoaderDefault(!(ml.defaultStatus === true || ml.defaultStatus === 'active'));

                    const helping = s.map?.mapHelping || [];
                    setMapHelpImageOnePath(helping[0]?.path || '');
                    setMapHelpImageOneDefault(!(helping[0]?.defaultStatus === true || helping[0]?.defaultStatus === 'active'));
                    setMapHelpImageTwoPath(helping[1]?.path || '');
                    setMapHelpImageTwoDefault(!(helping[1]?.defaultStatus === true || helping[1]?.defaultStatus === 'active'));
                    setMapHelpImageThreePath(helping[2]?.path || '');
                    setMapHelpImageThreeDefault(!(helping[2]?.defaultStatus === true || helping[2]?.defaultStatus === 'active'));
                }
            } catch (err) {
                console.error('Error fetching route settings', err);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
        fetch_data();
    }, [routeID]);

    // Highscore
    const [highscore, setHighscore] = useState('Game1 (Default)');

    // Languages
    const [languages, setLanguages] = useState(['English']);

    // White Label
    const [showLogo, setShowLogo] = useState(true);
    // White label media picker
    const [whiteLabelDefault, setWhiteLabelDefault] = useState(true);
    const [whiteLabelPath, setWhiteLabelPath] = useState('');
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

    // Advanced Customizations (useDefault booleans and resource paths)
    const [backgroundMusicDefault, setBackgroundMusicDefault] = useState(true);
    const [backgroundMusicPath, setBackgroundMusicPath] = useState('');
    const [gameLogoDefault, setGameLogoDefault] = useState(true);
    const [gameLogoPath, setGameLogoPath] = useState('');
    const [welcomeBgDefault, setWelcomeBgDefault] = useState(true);
    const [welcomeBgPath, setWelcomeBgPath] = useState('');
    const [helpBgDefault, setHelpBgDefault] = useState(true);
    const [helpBgPath, setHelpBgPath] = useState('');
    const [itemIconDefault, setItemIconDefault] = useState(true);
    const [itemIconPath, setItemIconPath] = useState('');
    const [scoreIconDefault, setScoreIconDefault] = useState(true);
    const [scoreIconPath, setScoreIconPath] = useState('');

    // Map (useDefault booleans and resource paths)
    const [mapStyleDefault, setMapStyleDefault] = useState(true);
    const [mapStylePath, setMapStylePath] = useState('');
    const [mapQuestActiveDefault, setMapQuestActiveDefault] = useState(true);
    const [mapQuestMarkerPath, setMapQuestMarkerPath] = useState('');
    const [mapQuestInactiveDefault, setMapQuestInactiveDefault] = useState(true);
    const [mapTeamMarkerDefault, setMapTeamMarkerDefault] = useState(true);
    const [mapTeamMarkerPath, setMapTeamMarkerPath] = useState('');
    const [finalLocationMarkerDefault, setFinalLocationMarkerDefault] = useState(true);
    const [finalLocationMarkerPath, setFinalLocationMarkerPath] = useState('');
    const [mapLoaderDefault, setMapLoaderDefault] = useState(true);
    const [mapLoaderPath, setMapLoaderPath] = useState('');
    const [mapHelpImageOneDefault, setMapHelpImageOneDefault] = useState(true);
    const [mapHelpImageOnePath, setMapHelpImageOnePath] = useState('');
    const [mapHelpImageTwoDefault, setMapHelpImageTwoDefault] = useState(true);
    const [mapHelpImageTwoPath, setMapHelpImageTwoPath] = useState('');
    const [mapHelpImageThreeDefault, setMapHelpImageThreeDefault] = useState(true);
    const [mapHelpImageThreePath, setMapHelpImageThreePath] = useState('');

    // Team Registration
    const [customTeamIconsDefault, setCustomTeamIconsDefault] = useState(true);

    const fetch_data = async () => {
        const res = await api.get(`/highscore/fetch_data?gameName=${encodeURIComponent(gameID)}`);
        console.log(res.data.data);
        if (res.data.success && res.data.data) {
            setHighscoresArray(res.data.data);
        }
    }

    const onSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const general = {
                backgroundMusic: { defaultStatus: !backgroundMusicDefault, path: backgroundMusicPath },
                gameLogo: { defaultStatus: !gameLogoDefault, path: gameLogoPath },
                welcomeBackground: { defaultStatus: !welcomeBgDefault, path: welcomeBgPath },
                helpBackground: { defaultStatus: !helpBgDefault, path: helpBgPath },
                itemIcon: { defaultStatus: !itemIconDefault, path: itemIconPath },
                scoreIcon: { defaultStatus: !scoreIconDefault, path: scoreIconPath },
            };

            const map = {
                mapStyle: { defaultStatus: !mapStyleDefault, path: mapStylePath },
                mapQuestMarker: { defaultStatus: !mapQuestActiveDefault, path: mapQuestMarkerPath },
                mapTeamMarker: { defaultStatus: !mapTeamMarkerDefault, path: mapTeamMarkerPath },
                finalLocationMarker: { defaultStatus: !finalLocationMarkerDefault, path: finalLocationMarkerPath },
                mapLoader: { defaultStatus: !mapLoaderDefault, path: mapLoaderPath },
                mapHelping: [
                    { defaultStatus: !mapHelpImageOneDefault, path: mapHelpImageOnePath },
                    { defaultStatus: !mapHelpImageTwoDefault, path: mapHelpImageTwoPath },
                    { defaultStatus: !mapHelpImageThreeDefault, path: mapHelpImageThreePath },
                ]
            };
            console.log(highscore);

            const payload: any = {
                routeID: routeID,
                name: routeName,
                playingTime: playingTime,
                numberOfItems: Number(numItems),
                cheatCode: cheatCode,
                adminCode: adminCode,
                highScore: highscore,
                whiteLabel: { defaultStatus: !whiteLabelDefault, path: whiteLabelPath },
                general,
                map,
            };

            const res = await api.post('/games/update_route', payload);
            if (res.data && res.data.success) {
                setMessage('Saved successfully');
            } else {
                setMessage('Save failed');
            }

            // refresh settings
            try {
                const r = await api.get(`/games/fetch_settings?routeName=${encodeURIComponent(routeID)}`);
                // console.log(r);
                if (r.data && r.data.success) {
                    const s = r.data.data;
                    setRouteName(s.name || '');
                    setRouteNameChanged(s.name || '');
                    setPlayingTime(s.playingTime || '');
                    setNumItems(s.numberOfItems ? String(s.numberOfItems) : '0');
                    setCheatCode(s.cheatCode || '');
                    setAdminCode(s.adminCode || '');
                    setWhiteLabelPath(s.whiteLabelPath || '');
                    setHighscore(s.HighScore);

                    const bgm = s.general?.backgroundMusic || {};
                    setBackgroundMusicPath(bgm.path || '');
                    setBackgroundMusicDefault(!(bgm.defaultStatus === true || bgm.defaultStatus === 'active'));

                    const gLogo = s.general?.gameLogo || {};
                    setGameLogoPath(gLogo.path || '');
                    setGameLogoDefault(!(gLogo.defaultStatus === true || gLogo.defaultStatus === 'active'));

                    const wBg = s.general?.welcomeBackground || {};
                    setWelcomeBgPath(wBg.path || '');
                    setWelcomeBgDefault(!(wBg.defaultStatus === true || wBg.defaultStatus === 'active'));

                    const hBg = s.general?.helpBackground || {};
                    setHelpBgPath(hBg.path || '');
                    setHelpBgDefault(!(hBg.defaultStatus === true || hBg.defaultStatus === 'active'));

                    const iIcon = s.general?.itemIcon || {};
                    setItemIconPath(iIcon.path || '');
                    setItemIconDefault(!(iIcon.defaultStatus === true || iIcon.defaultStatus === 'active'));

                    const sIcon = s.general?.scoreIcon || {};
                    setScoreIconPath(sIcon.path || '');
                    setScoreIconDefault(!(sIcon.defaultStatus === true || sIcon.defaultStatus === 'active'));

                    const mStyle = s.map?.mapStyle || {};
                    setMapStylePath(mStyle.path || '');
                    setMapStyleDefault(!(mStyle.defaultStatus === true || mStyle.defaultStatus === 'active'));

                    const mq = s.map?.mapQuestMarker || {};
                    setMapQuestMarkerPath(mq.path || '');
                    setMapQuestActiveDefault(!(mq.defaultStatus === true || mq.defaultStatus === 'active'));
                    setMapQuestInactiveDefault(!(mq.defaultStatus === true || mq.defaultStatus === 'active'));

                    const mt = s.map?.mapTeamMarker || {};
                    setMapTeamMarkerPath(mt.path || '');
                    setMapTeamMarkerDefault(!(mt.defaultStatus === true || mt.defaultStatus === 'active'));

                    const fl = s.map?.finalLocationMarker || {};
                    setFinalLocationMarkerPath(fl.path || '');
                    setFinalLocationMarkerDefault(!(fl.defaultStatus === true || fl.defaultStatus === 'active'));

                    const ml = s.map?.mapLoader || {};
                    setMapLoaderPath(ml.path || '');
                    setMapLoaderDefault(!(ml.defaultStatus === true || ml.defaultStatus === 'active'));

                    const helping = s.map?.mapHelping || [];
                    setMapHelpImageOnePath(helping[0]?.path || '');
                    setMapHelpImageOneDefault(!(helping[0]?.defaultStatus === true || helping[0]?.defaultStatus === 'active'));
                    setMapHelpImageTwoPath(helping[1]?.path || '');
                    setMapHelpImageTwoDefault(!(helping[1]?.defaultStatus === true || helping[1]?.defaultStatus === 'active'));
                    setMapHelpImageThreePath(helping[2]?.path || '');
                    setMapHelpImageThreeDefault(!(helping[2]?.defaultStatus === true || helping[2]?.defaultStatus === 'active'));
                }
            } catch (e) {
                // ignore refresh errors
            }
            if (routeNameChanged && routeNameChanged !== routeName && gameID)
                router.push(`/games/new-route?gameID=${gameID}&routeID=${encodeURIComponent(routeName)}`);
            else
                window.history.back();
        } catch (err) {
            console.error(err);
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-5 m-8 h-full">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold">Route Settings</h1>
                <button className="text-[#009FE3] font-medium" onClick={() => {
                    if (!routeIdShow)
                        setRouteIdShow(true);
                    else
                        setRouteIdShow(false);
                }}>{routeIdShow ? `${routeID}` : 'Show Game ID'}</button>

            </div>
            {/* General Section */}
            <div className='mx-36 max-lg:mx-2 max-lg:text-[13px]'>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">General</h2>
                    <div className="grid grid-cols-[1fr_3fr] gap-x-12 gap-y-6 text-[13px]">
                        {/* <div className='flex '> */}
                        <label className="block text-gray-700 font-medium mb-1">Route Name <span className="text-red-500">*</span></label>
                        <div>
                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={routeName} onChange={e => setRouteName(e.target.value)} />
                            <div className="text-xs text-gray-500 mt-1">Please enter route name; can be changed later</div>
                        </div>
                        {/* </div> */}
                        <label className="block text-gray-700 font-medium mb-1">Playing Time <span className="text-red-500">*</span></label>
                        <div>
                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={playingTime} onChange={e => setPlayingTime(e.target.value)} />
                            <div className="text-xs text-gray-500 mt-1">Please enter a playing time in minutes; can be changed later</div>
                        </div>
                        <label className="block text-gray-700 font-medium mb-1">Number of Item :</label>
                        <div>
                            <input type="number" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={numItems} onChange={e => setNumItems(e.target.value)} />
                            <div className="text-xs text-gray-500 mt-1">Please enter the no of items; can be changed later</div>
                        </div>
                        <label className="block text-gray-700 font-medium mb-1">Cheat Code :</label>
                        <div>
                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={cheatCode} onChange={e => setCheatCode(e.target.value)} />
                            <div className="text-xs text-gray-500 mt-1">Please enter Cheat Code; can be changed later</div>
                        </div>
                        <label className="block text-gray-700 font-medium mb-1">Admin Code :</label>
                        <div className='flex flex-col gap-2'>
                            <div className='flex'>
                                <input type="checkbox" checked={adminCodeDefault} onChange={e => setAdminCodeDefault(e.target.checked)} className="mr-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="font-normal">Use Default</span>
                            </div>
                            {!adminCodeDefault && <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={adminCode} onChange={e => setAdminCode(e.target.value)} />}
                            {!adminCodeDefault && <div className="text-xs text-gray-500 mt-1">Please enter Admin Code; can be changed later</div>}
                        </div>
                    </div>
                </div>
                {/* Highscore Section */}
                <div className="my-10">
                    <h2 className="text-lg font-semibold mb-2">Highscore</h2>
                    <div className="grid grid-cols-[1fr_3fr] gap-x-12 gap-y-6 text-[13px]">
                        {/* <div> */}
                        <label className="block text-gray-700 font-medium mb-1">Connected Highscore :</label>
                        <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" value={highscore} onChange={e => setHighscore(e.target.value)}>
                            {highscoresArray.map((h) => (
                                <option key={h._id} value={h._id}>
                                    {h.name}
                                </option>
                            ))}
                        </select>
                        {/* </div> */}
                    </div>
                </div>
                {/* Languages Section */}
                <div className="my-10">
                    <h2 className="text-lg font-semibold mb-2">Languages</h2>
                    <div className="grid grid-cols-[1fr_3fr] gap-x-12 gap-y-6">
                        {/* <div> */}
                        <label className="block text-gray-700 font-medium mb-1">Add and delete languages :</label>
                        <div>
                            <select className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded mt-2" onChange={e => { const val = e.target.value; if (val && !languages.includes(val)) setLanguages([...languages, val]); }}>
                                <option value="English">English</option>
                            </select>
                            <div className="flex gap-2 pt-4">
                                {languages.map(lang => (
                                    <span key={lang} className="bg-[#009FE3] text-white px-3 py-1 rounded text-sm">{lang} <button className="ml-1 text-white" onClick={() => setLanguages(langs => langs.filter(l => l !== lang))}>×</button></span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
                {/* White Label Options Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">White Label Options</h2>
                    <div className="grid grid-cols-[1fr_3fr] gap-x-12 gap-y-6 text-[13px]">
                        {/* <div> */}
                        <label className="block text-gray-700 font-medium mb-1">Upload and select your White Label Image here :</label>
                        <div className="flex items-center gap-4">
                            <button className="text-[#009FE3] text-sm font-medium underline text-left" onClick={() => setMediaPickerOpen(true)}>Select White Label Image</button>
                            {whiteLabelPath ? <img src={whiteLabelPath} alt="white-label" className="w-16 h-8 object-contain" /> : null}
                        </div>
                        {/* </div> */}
                        <div className="flex items-center mt-2">
                            <input type="checkbox" disabled checked={showLogo} onChange={e => setShowLogo(e.target.checked)} className="mr-2 w-4 h-4 accent-[#009FE3]" />
                            <span className="text-gray-700">Show LiveTeamGames logo</span>
                        </div>
                    </div>
                </div>
                {/* Advanced Customizations Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Advanced Customizations</h2>
                    <div className="border-t pt-4">
                        <h3 className="text-xl font-semibold my-3">General</h3>
                        <div className="grid grid-cols-[1fr_3fr] max-md:grid-cols-[1fr_1fr] gap-x-12 max-md:gap-x-8 gap-y-4 mb-6">
                            <span >Background Music :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={backgroundMusicDefault} onChange={e => setBackgroundMusicDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {backgroundMusicPath ? <img src={backgroundMusicPath} alt="bgm" className="w-12 h-8 object-cover rounded" /> : null}
                            </div>
                            <span >Game Logo :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={gameLogoDefault} onChange={e => setGameLogoDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {gameLogoPath ? <img src={gameLogoPath} alt="logo" className="w-12 h-8 object-contain" /> : null}
                            </div>
                            <span >Welcome View Background Image :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={welcomeBgDefault} onChange={e => setWelcomeBgDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {welcomeBgPath ? <img src={welcomeBgPath} alt="welcome" className="w-12 h-8 object-cover rounded" /> : null}
                            </div>
                            <span >Help View Background Image :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={helpBgDefault} onChange={e => setHelpBgDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {helpBgPath ? <img src={helpBgPath} alt="help" className="w-12 h-8 object-cover rounded" /> : null}
                            </div>
                            <span >Item Icon :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={itemIconDefault} onChange={e => setItemIconDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {itemIconPath ? <img src={itemIconPath} alt="item" className="w-8 h-8 object-contain" /> : null}
                            </div>
                            <span >Score Icon :</span>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" disabled checked={scoreIconDefault} onChange={e => setScoreIconDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                                {scoreIconPath ? <img src={scoreIconPath} alt="score" className="w-8 h-8 object-contain" /> : null}
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold my-4">Map</h3>
                        <div className="grid grid-cols-[1fr_3fr] max-md:grid-cols-[1fr_1fr] gap-x-12 max-md:gap-x-8 gap-y-4 mb-6">
                            <span >Map Style :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapStyleDefault} onChange={e => setMapStyleDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Map Quest Marker Active :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapQuestActiveDefault} onChange={e => setMapQuestActiveDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Map Quest Marker Inactive :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapQuestInactiveDefault} onChange={e => setMapQuestInactiveDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span>Map Team Marker :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapTeamMarkerDefault} onChange={e => setMapTeamMarkerDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span>Final Location Marker :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={finalLocationMarkerDefault} onChange={e => setFinalLocationMarkerDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span>Map Loader :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapLoaderDefault} onChange={e => setMapLoaderDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Map Help Image One :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapHelpImageOneDefault} onChange={e => setMapHelpImageOneDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Map Help Image Two :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapHelpImageTwoDefault} onChange={e => setMapHelpImageTwoDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Map Help Image Three :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={mapHelpImageThreeDefault} onChange={e => setMapHelpImageThreeDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold my-4">Team Registration</h3>
                        <div className='grid grid-cols-[1fr_3fr] gap-x-12 gap-y-4 mb-6 '>
                            <span >Custom Team Icons :</span>
                            <div className="flex items-center mb-6">
                                <input type="checkbox" disabled checked={customTeamIconsDefault} onChange={e => setCustomTeamIconsDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button className="px-5 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200" onClick={() => window.history.back()}>Cancel</button>
                <button
                    className={`px-5 py-2 rounded ${saving ? 'bg-gray-300 text-gray-700' : 'bg-[#57c8f7] text-white'} font-semibold`}
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save changes'}
                </button>
            </div>
            {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
            <MediaPicker
                open={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={(file: any) => {
                    // file: { type, name, src, path }
                    const src = file?.src || file?.path || '';
                    setWhiteLabelPath(src);
                    setMediaPickerOpen(false);
                }}
            />
        </div>
    );
};

export default RouteSettings;