"use client";
import React, { useRef, useState } from "react";
import AnimateShowdown from '@/components/OperatorComponents/AnimateShowdown';
import OperatorActionsMenu from '@/components/OperatorComponents/OperatorActionsMenu';
import TeamDetailsTable from '@/components/TeamDetails/TeamDetailsTable';
import TeamDetailsPhotos from '@/components/TeamDetails/TeamDetailsPhotos';
import TeamDetailsVideos from '@/components/TeamDetails/TeamDetailsVideos';
import Map from "../components/OperatorComponents/Google_map";
import { OperatorData } from "@/lib/LiveConfig";
import FilterPopup from "../components/OperatorComponents/OperatorFilterPopup";
import TeamDetailsEdit from "@/components/TeamDetails/TeamDetailsEdit";
import TeamDetailsInfo from "@/components/TeamDetails/TeamDetailsInfo";

type ActiveView = "details" | "photos" | "videos" | "edit" | "table" | "info" | "delete" | null;
interface Riddle {
    no: number;
    riddleName: string;
    episode: number;
    riddleType: string;
    status: string;
    score: number;
}

interface TeamData {
    no: number;
    teamName: string;
    score: string;
    status: "WON" | "LEFT";
    timeLeft: string;
    battery: string;
    startedOn: string;
    lat: number;
    lng: number;
    riddles?: Riddle[];
}

interface OperatorTableProps {
    OperatorData: OperatorData;
}

const OperatorTable: React.FC<OperatorTableProps> = ({ OperatorData }) => {
    const [mapView, setMapView] = useState<"map" | "satellite">("map");
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Use local state for teams so we can remove rows
    const [teamsState, setTeamsState] = useState<TeamData[]>(OperatorData?.teams ?? []);
    const teams = teamsState;
    const filterButtonRef = useRef<HTMLDivElement | null>(null);

    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const [showTeamDetailsIdx, setShowTeamDetailsIdx] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [editTeamName, setEditTeamName] = useState<string>("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [showAnimateShowdown, setShowAnimateShowdown] = useState(false);


    // Show TeamDetailsTable or TeamDetailsPhotos or TeamDetailsVideos if requested
    let detailsContent: React.ReactNode = null;
    if (showTeamDetailsIdx !== null && teams && teams[showTeamDetailsIdx]) {
        const team = teams[showTeamDetailsIdx];
        const riddles = [
            { no: 1, riddleName: "Start the Mission", episode: 1, riddleType: "Augmented Reality", status: "SOLVED", score: 1000 },
            { no: 2, riddleName: "The Key", episode: 2, riddleType: "Action Pack", status: "SOLVED", score: 3000 },
            { no: 3, riddleName: "Visual Confirmation", episode: 3, riddleType: "Mini Game", status: "SOLVED", score: 2000 },
            { no: 4, riddleName: "Secret Box", episode: 4, riddleType: "Augmented Reality", status: "SOLVED WRONG", score: 0 },
            { no: 5, riddleName: "The Contact", episode: 5, riddleType: "Action Pack", status: "SKIPPED", score: 0 },
            { no: 6, riddleName: "Listening Device", episode: 6, riddleType: "Mini Game", status: "UNSOLVED", score: 0 },
            { no: 7, riddleName: "The Secret Safe", episode: 7, riddleType: "Augmented Reality", status: "UNSOLVED", score: 0 },
            { no: 8, riddleName: "The Antivirus", episode: 8, riddleType: "Multiple Choice", status: "UNSOLVED", score: 0 },
            { no: 9, riddleName: "Groundwater Access", episode: 9, riddleType: "Mini Game", status: "UNSOLVED", score: 0 },
            { no: 10, riddleName: "Server Room", episode: 10, riddleType: "Augmented Reality", status: "UNSOLVED", score: 0 },
        ];
        if (activeView === 'photos') {
            detailsContent = (
                <TeamDetailsPhotos
                    team={{ ...team, riddles }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                />
            );
        } else if (activeView === 'videos') {
            detailsContent = (
                <TeamDetailsVideos
                    team={{ ...team, riddles }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                />
            );
        } else if (activeView === 'table') {
            detailsContent = (
                <TeamDetailsTable
                    team={{ ...team, riddles }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                />
            );
        }
    }

    // Fix: Only show detailsContent if not null, else show main table UI
    if (detailsContent !== null) {
        return (
            <div>
                {detailsContent}
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 w-full">
            {/* Delete confirmation popup */}
            {activeView === 'delete' && showTeamDetailsIdx !== null && teams[showTeamDetailsIdx] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                    <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative flex flex-col items-center">
                        <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={() => { setActiveView(null); setShowTeamDetailsIdx(null); setDeleteConfirmText(""); }}>
                            ×
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="text-red-500 text-5xl mb-2">&#33;</div>
                            <h2 className="text-lg font-semibold mb-2">Delete {teams[showTeamDetailsIdx].teamName}</h2>
                            <label className="mb-4 text-center">Type <span className="font-bold">DELETE</span> to confirm</label>
                            <input
                                type="text"
                                className="border px-3 py-2 rounded w-full mb-4 text-center"
                                value={deleteConfirmText}
                                onChange={e => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE"
                            />
                            <div className="flex gap-2 mt-2">
                                <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setActiveView(null); setShowTeamDetailsIdx(null); setDeleteConfirmText(""); }}>Cancel</button>
                                <button
                                    className={`px-4 py-2 bg-[#00A3FF] text-white rounded ${deleteConfirmText === 'DELETE' ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                    onClick={() => {
                                        setTeamsState(prev => prev.filter((_, idx) => idx !== showTeamDetailsIdx));
                                        setActiveView(null);
                                        setShowTeamDetailsIdx(null);
                                        setDeleteConfirmText("");
                                    }}
                                >Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Team Name Modal overlays table, table remains visible */}
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
                        placeholder={OperatorData?.searchPlaceholder}
                        className="pl-10 pr-4 py-1 border border-gray-300 rounded-lg w-64 max-[350px]:w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Animate Showdown Button */}
                <button className="px-3 py-1 bg-[#00A3FF] text-white rounded-sm" onClick={() => setShowAnimateShowdown(true)}>
                    Animate Showdown
                </button>
            </div>
            {/* Animate Showdown Popup */}
            {showAnimateShowdown && (
                <AnimateShowdown
                    teams={teams}
                    onClose={() => setShowAnimateShowdown(false)}
                />
            )}
            {/* Main Content */}
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
                {/* Table Section */}
                <div className="w-[60%] max-lg:w-full bg-white rounded-lg h-100 shadow-sm overflow-auto">
                    <table className="w-full text-[12px] overflow-auto">
                        <thead className="bg-[#000f24] text-white">
                            <tr>
                                <th className="px-2 py-4 text-center text-sm font-medium">No</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Team name</th>
                                <th className="px-2 flex items-center justify-center py-4 text-center text-sm font-medium cursor-pointer">
                                    Score
                                    <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Status</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Time left</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Battery</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Started on</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {teams?.map((team: TeamData, index: number) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-50 cursor-pointer ${selectedTeam === team.no ? '' : ''}`}
                                    onClick={() => setSelectedTeam(team.no)}
                                >
                                    <td className="px-2 py-2 text-center">{team.no}</td>
                                    <td className="px-2 py-2 text-center">{team.teamName}</td>
                                    <td className="px-2 py-2 text-center">{team.score}</td>
                                    <td className="px-2 py-2 text-center">
                                        <span className={`px-2 py-2 rounded`}>
                                            {team.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 text-center">{team.timeLeft}</td>
                                    <td className="px-2 py-2 text-center">
                                        <div className="flex items-center">
                                            {team.battery}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">{team.startedOn}</td>
                                    <td className="px-2 py-2 text-center relative">
                                        <OperatorActionsMenu
                                            open={menuOpenIdx === index}
                                            onOpen={() => setMenuOpenIdx(index)}
                                            onClose={() => setMenuOpenIdx(null)}
                                            onTeamDetails={() => { setShowTeamDetailsIdx(index); setActiveView('table'); setMenuOpenIdx(null); }}
                                            onTeamPhotos={() => { setShowTeamDetailsIdx(index); setActiveView('photos'); setMenuOpenIdx(null); }}
                                            onTeamVideos={() => { setShowTeamDetailsIdx(index); setActiveView('videos'); setMenuOpenIdx(null); }}
                                            onEditTeamName={() => { setShowTeamDetailsIdx(index); setActiveView('edit'); setMenuOpenIdx(null); }}
                                            onShowTeamInfo={() => { setShowTeamDetailsIdx(index); setActiveView('info'); setMenuOpenIdx(null); }}
                                            onDeleteTeam={() => { setShowTeamDetailsIdx(index); setActiveView('delete'); setMenuOpenIdx(null); }}
                                        // Add similar handlers for videos, edit name, info, delete
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {activeView === 'edit' &&
                <TeamDetailsEdit editTeamName={editTeamName} setEditTeamName={setEditTeamName} setActiveView={setActiveView} />
            }
            {activeView === 'info' &&
                <TeamDetailsInfo setActiveView={setActiveView} />
            }
        </div>
    );
}

export default OperatorTable;