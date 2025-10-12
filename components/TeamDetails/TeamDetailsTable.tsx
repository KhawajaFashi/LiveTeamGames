import React, { useRef, useState } from "react";
import api from '@/utils/axios';
import FilterPopup from "../OperatorComponents/OperatorFilterPopup";
import { OperatorData } from "@/lib/LiveConfig";
import Map from "../OperatorComponents/Google_map";
import { FaArrowLeft } from "react-icons/fa";
import TeamDetailsActionsMenu from "./TeamDetailsActionMenu";

interface TeamRiddleEntry {
    riddle: {
        name: string;
        episode?: number;
        type?: string;
    };
    riddleStatus?: string;
    riddleScore?: number;
}

interface TeamDetailsTableProps {
    team: {
        no: number;
        teamName: string;
        riddles: TeamRiddleEntry[] | [];
        id?: string;
        _id?: string;
    };
    onBack: () => void;
    OperatorData: OperatorData;
    onUpdated?: (updatedTeam: any) => void;
}

const TeamDetailsTable: React.FC<TeamDetailsTableProps> = ({ team, onBack, OperatorData, onUpdated }) => {
    const [mapView, setMapView] = useState<"map" | "satellite">("map");
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { teams } = OperatorData ?? {};
    const filterButtonRef = useRef<HTMLDivElement | null>(null);

    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    // const [showTeamDetailsIdx, setShowTeamDetailsIdx] = useState<number | null>(null);
    const [scoreModalIdx, setScoreModalIdx] = useState<number | null>(null);
    const [scoreType, setScoreType] = useState<'add' | 'subtract'>('add');
    const [scoreValue, setScoreValue] = useState<string>('');
    console.log("Team:", team?.riddles)

    return (
        <div className="w-full bg-white rounded-lg p-5">
            {/* Change Score Modal */}
            {scoreModalIdx !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                    <div className="bg-white rounded-lg shadow-lg w-[30%] p-6 relative">
                        <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={() => setScoreModalIdx(null)}>
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-7">Change Quest Score : {team?.riddles?.[scoreModalIdx ?? 0]?.riddle?.name ?? ''}</h2>
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
                            <button className="px-4 py-1 bg-[#00A3FF] text-white rounded" onClick={async () => {
                                // call backend to update score for this team's riddle
                                try {
                                    // we expect a prop team to have an identifier? rely on OperatorData mapping which will pass team id via closure if present
                                    const teamId = (team as any)._id || (team as any).id;
                                    if (!teamId) {
                                        console.warn('No team id to update');
                                        setScoreModalIdx(null); setScoreValue(''); return;
                                    }
                                    const riddleIndex = scoreModalIdx ?? 0;
                                    const riddleScore = Number(scoreValue || 0);
                                    const scoretype = scoreType;
                                    const res = await api.post('/operator/update_team_score', { _id: teamId, riddleIndex, riddleScore, scoretype });
                                    if (res.data && res.data.success) {
                                        if (typeof onUpdated === 'function') onUpdated(res.data.data);
                                    }
                                } catch (err) { console.error(err); }
                                setScoreModalIdx(null); setScoreValue('');
                            }}>Save</button>
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
                    <table className="w-full text-[12px] overflow-auto">
                        <thead className="bg-[#000f24] text-white">
                            <tr>
                                <th className="px-2 py-4 text-center text-sm font-medium">No</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Riddle Name</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Episode</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Riddle Type</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Status</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Score</th>
                                <th className="px-2 py-4 text-center text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {team.riddles?.map((riddle: TeamRiddleEntry, index: number) => (
                                <tr key={index}>
                                    <td className="px-2 py-2 text-center">{index + 1}</td>
                                    <td className="px-2 py-2 text-center">{riddle.riddle?.name}</td>
                                    <td className="px-2 py-2 text-center">{riddle.riddle?.episode}</td>
                                    <td className="px-2 py-2 text-center">{riddle.riddle?.type}</td>
                                    <td className="px-2 py-2 text-center">{riddle.riddleStatus}</td>
                                    <td className="px-2 py-2 text-center">{riddle.riddleScore}</td>
                                    <td className="px-2 py-1 text-center relative">
                                        <TeamDetailsActionsMenu
                                            open={menuOpenIdx === index}
                                            onOpen={() => setMenuOpenIdx(index)}
                                            onClose={() => setMenuOpenIdx(null)}
                                            team={team}
                                            onTeamDetails={() => { setScoreModalIdx(index); setMenuOpenIdx(null); }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default TeamDetailsTable;
