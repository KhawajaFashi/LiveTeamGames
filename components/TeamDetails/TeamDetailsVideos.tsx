import React, { useRef, useState } from "react";
import FilterPopup from "../OperatorComponents/OperatorFilterPopup";
import { OperatorData } from "@/lib/LiveConfig";
import Map from "../OperatorComponents/Google_map";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

interface Riddle {
    no: number;
    riddleName: string;
    episode: number;
    riddleType: string;
    status: string;
    score: number;
}

interface TeamDetailsVideosProps {
    team: {
        no: number;
        teamName: string;
        riddles: Riddle[];
    };
    onBack: () => void;
    OperatorData: OperatorData;
}

const TeamDetailsVideos: React.FC<TeamDetailsVideosProps> = ({ team, onBack, OperatorData }) => {
    const [mapView, setMapView] = useState<"map" | "satellite">("map");
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { teams } = OperatorData ?? {};
    const filterButtonRef = useRef<HTMLDivElement | null>(null);

    // const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    // const [showTeamDetailsIdx, setShowTeamDetailsIdx] = useState<number | null>(null);
    const [scoreModalIdx, setScoreModalIdx] = useState<number | null>(null);
    const [scoreType, setScoreType] = useState<'add' | 'subtract'>('add');
    const [scoreValue, setScoreValue] = useState<string>('');

    return (
        <div className="w-full bg-white rounded-lg">
            {/* Change Score Modal */}
            {scoreModalIdx !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                    <div className="bg-white rounded-lg shadow-lg w-[30%] p-6 relative">
                        <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={() => setScoreModalIdx(null)}>
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-7">Change Quest Score : {team.riddles[scoreModalIdx]?.riddleName ?? ''}</h2>
                        <div className="mb-4 flex gap-1 items-center w-full border-b pb-10 border-gray-200">
                            <div className="relative">
                                <button
                                    className="px-3 py-2 bg-[#00A3FF] text-white rounded-sm flex items-center gap-2"
                                    onClick={() => setScoreType(scoreType === 'add' ? 'subtract' : 'add')}
                                >
                                    {scoreType === 'add' ? 'Add Score' : 'Subtract Score'}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="number"
                                className="border border-gray-300 px-3 py-2 rounded w-full flex-1"
                                placeholder="Enter score"
                                value={scoreValue}
                                onChange={e => setScoreValue(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-1 p-2">
                            <button className="px-4 py-1 bg-gray-100 rounded" onClick={() => { setScoreModalIdx(null); setScoreValue('') }}>Close</button>
                            <button className="px-4 py-1 bg-[#00A3FF] text-white rounded" onClick={() => { setScoreModalIdx(null); setScoreValue('') }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex max-lg:flex-col max-lg:gap-3 justify-between items-center mb-6 font-semibold">
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
                    <FilterPopup isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} buttonRef={filterButtonRef} />
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
                        placeholder={`Search`}
                        className="pl-10 pr-4 py-1 border border-gray-300 rounded-lg w-64 max-[350px]:w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Animate Showdown Button */}
                <button className="px-3 py-1 bg-[#00A3FF] text-white rounded-sm">
                    Animate Showdown
                </button>
            </div>
            <div className="flex max-lg:flex-col gap-6 h-100">

                {/* Map Section */}
                <div className="w-[40%] max-lg:w-full h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200">
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-1 rounded ${mapView === 'map' ? 'bg-gray-100' : ''}`}
                                onClick={() => setMapView('map')}
                            >
                                Map
                            </button>
                            <button
                                className={`px-4 py-1 rounded ${mapView === 'satellite' ? 'bg-gray-100' : ''}`}
                                onClick={() => setMapView('satellite')}
                            >
                                Satellite
                            </button>
                        </div>
                    </div>
                    <div>
                        <Map teams={teams} selectedTeamNo={selectedTeam} />
                    </div>
                </div>

                {/* <h2 className="text-lg font-semibold mb-4">Team Details: {team.teamName}</h2> */}
                <div className="w-[60%] max-lg:w-full bg-white rounded-lg h-100 shadow-sm overflow-auto flex flex-col justify-between">
                    <div className="flex flex-wrap gap-6 justify-start items-start p-4">
                        {/* Replace these src URLs with real team photo URLs */}
                        <Image src="/profile.png" alt="Team Photo 1" width={1000} height={1000} className="w-48 h-40 object-cover rounded-lg shadow" />
                        <Image src="/profile.png" alt="Team Photo 1" width={1000} height={1000} className="w-48 h-40 object-cover rounded-lg shadow" />
                        <Image src="/BO.jpg" alt="Team Photo 2" width={1000} height={1000} className="w-48 h-40 object-cover rounded-lg shadow" />
                    </div>
                    <button
                        className="w-24 flex items-center justify-center gap-2 px-5 py-1 border-1 border-gray-200 font-medium rounded hover:bg-sky-400 cursor-pointer hover:text-white transition-all duration-300 m-4"
                        onClick={onBack}
                    >
                        <FaArrowLeft /> <span>
                            Back
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsVideos;
