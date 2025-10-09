"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const RouteSettings = () => {
    // Get routeID and gameID from URL
    const searchParams = useSearchParams();
    const routeID = searchParams?.get('routeID') || '';
    // const gameID = searchParams?.get('gameID') || '';

    const [routeIdShow, setRouteIdShow] = useState(false);
    // General state
    const [routeName, setRouteName] = useState('hello');
    const [playingTime, setPlayingTime] = useState('');
    const [numItems, setNumItems] = useState('3');
    const [cheatCode, setCheatCode] = useState('1337');
    const [adminCodeDefault, setAdminCodeDefault] = useState(true);

    // Highscore
    const [highscore, setHighscore] = useState('Game1 (Default)');

    // Languages
    const [languages, setLanguages] = useState(['English']);

    // White Label
    // const [whiteLabelImage, setWhiteLabelImage] = useState('');
    const [showLogo, setShowLogo] = useState(true);

    // Advanced Customizations
    const [backgroundMusicDefault, setBackgroundMusicDefault] = useState(true);
    const [gameLogoDefault, setGameLogoDefault] = useState(true);
    const [welcomeBgDefault, setWelcomeBgDefault] = useState(true);
    const [helpBgDefault, setHelpBgDefault] = useState(true);
    const [itemIconDefault, setItemIconDefault] = useState(true);
    const [scoreIconDefault, setScoreIconDefault] = useState(true);

    // Map
    const [mapStyleDefault, setMapStyleDefault] = useState(true);
    const [mapQuestActiveDefault, setMapQuestActiveDefault] = useState(true);
    const [mapQuestInactiveDefault, setMapQuestInactiveDefault] = useState(true);
    const [mapTeamMarkerDefault, setMapTeamMarkerDefault] = useState(true);
    const [finalLocationMarkerDefault, setFinalLocationMarkerDefault] = useState(true);
    const [mapLoaderDefault, setMapLoaderDefault] = useState(true);
    const [mapHelpImageOneDefault, setMapHelpImageOneDefault] = useState(true);
    const [mapHelpImageTwoDefault, setMapHelpImageTwoDefault] = useState(true);
    const [mapHelpImageThreeDefault, setMapHelpImageThreeDefault] = useState(true);

    // Team Registration
    const [customTeamIconsDefault, setCustomTeamIconsDefault] = useState(true);

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
                        <div >
                            <input type="checkbox" checked={adminCodeDefault} onChange={e => setAdminCodeDefault(e.target.checked)} className="mr-2 w-4 h-4 accent-[#009FE3]" />
                            <span className="font-normal">Use Default</span>
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
                            <option>Game1 (Default)</option>
                            <option>Game2</option>
                            <option>Other</option>
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
                                <option value="">Add Language</option>
                                <option value="English">English</option>
                                <option value="German">German</option>
                                <option value="French">French</option>
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
                        <button className="text-[#009FE3] text-sm font-medium underline text-left" onClick={() => alert('Select White Label Image')}>Select White Label Image</button>
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
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={backgroundMusicDefault} onChange={e => setBackgroundMusicDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Game Logo :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={gameLogoDefault} onChange={e => setGameLogoDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Welcome View Background Image :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={welcomeBgDefault} onChange={e => setWelcomeBgDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Help View Background Image :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={helpBgDefault} onChange={e => setHelpBgDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Item Icon :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={itemIconDefault} onChange={e => setItemIconDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
                            </div>
                            <span >Score Icon :</span>
                            <div className="flex items-center">
                                <input type="checkbox" disabled checked={scoreIconDefault} onChange={e => setScoreIconDefault(e.target.checked)} className="ml-2 w-4 h-4 accent-[#009FE3]" />
                                <span className="ml-2">Use Default</span>
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
                <button className="px-5 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">Cancel</button>
                <button className="px-5 py-2 rounded bg-[#57c8f7] text-white font-semibold hover:bg-[#009FE3]">Save changes</button>
            </div>
        </div>
    );
};

export default RouteSettings;