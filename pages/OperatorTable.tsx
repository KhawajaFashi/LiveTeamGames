"use client";
import React, { useEffect, useRef, useState } from "react";
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
import api from "@/utils/axios";

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
    id?: string;
    teamName: string;
    score: string;
    status: "WON" | "LEFT";
    timeLeft: string;
    battery: string;
    startedOn: Date;
    lat: number;
    lng: number;
    riddles?: Riddle[];
    teamPics?: string[];
    teamVids?: string[];
    phone?: string;
    playingTime?: string;
}

interface OperatorTableProps {
    OperatorData: OperatorData;
    operatorType: string;
}

const OperatorTable: React.FC<OperatorTableProps> = ({ OperatorData, operatorType }) => {
    const [mapView, setMapView] = useState<"map" | "satellite">("map");
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Use raw state for teams (server-synced) and a derived displayed list after filters/search
    const [rawTeams, setRawTeams] = useState<TeamData[]>(OperatorData?.teams ?? []);
    const [displayedTeams, setDisplayedTeams] = useState<TeamData[]>(OperatorData?.teams ?? []);
    const teams = displayedTeams;
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<{ route: string; date: string; language: string; status: string }>({ route: '', date: '', language: '', status: 'ALL' });
    const filterButtonRef = useRef<HTMLDivElement | null>(null);

    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const [showTeamDetailsIdx, setShowTeamDetailsIdx] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [editTeamName, setEditTeamName] = useState<string>("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [showAnimateShowdown, setShowAnimateShowdown] = useState(false);

    console.log(OperatorData, "Refreshed");


    useEffect(() => {
        setRawTeams(OperatorData?.teams ?? []);
    }, [OperatorData?.teams]);

    // Fetch teams from backend for this gameName to keep UI in sync with server
    useEffect(() => {
        const fetchTeams = async (gameName: string) => {
            try {
                const res = await api.get(`/operator/fetch_data?gameName=${encodeURIComponent(gameName)}`);
                const body = res.data;
                console.log("Body Data: ", body.data);
                if (body && body.success && Array.isArray(body.data)) {
                    // Map fields to TeamData shape expected by the component
                    const mapped: TeamData[] = body.data.map((t: any, idx: number) => ({
                        no: idx + 1,
                        id: t._id || t.id,
                        teamName: t.name || 'Team ' + (idx + 1),
                        score: t.score || '0',
                        status: (t.status as any) || 'PLAY',
                        timeLeft: t.timeLeft || '',
                        battery: String(t.Battery ?? t.battery ?? 0),
                        teamPics: t.teamPics || [],
                        teamVids: t.teamVids || [],
                        startedOn: t.StartedAt,
                        lat: t.coordinates?.coordinates?.[1] ?? 0,
                        lng: t.coordinates?.coordinates?.[0] ?? 0,
                        riddles: t.riddles || [],
                    }));
                    setRawTeams(mapped);
                }
            } catch (err) {
                console.error('Error fetching operator teams', err);
            }
        };

        // try to derive gameName from OperatorData if available
        const derivedGameName = operatorType || '';
        // const derivedGameName = (OperatorData as any)?.gameName || (OperatorData as any)?.teams?.[0]?.gameName || '';
        if (derivedGameName) fetchTeams(derivedGameName);
    }, [OperatorData]);

    // Compute displayed teams from rawTeams + activeFilters + searchQuery (prefix match, case-insensitive)
    useEffect(() => {
        const q = (searchQuery || '').trim().toLowerCase();
        const { route, date, language, status } = activeFilters;

        const noFiltersSelected = (!route && !date && !language && (!status || status === 'ALL'));

        let out = rawTeams.slice();

        // Apply status filter if selected
        if (status && status !== 'ALL') {
            out = out.filter(t => String(t.status).toUpperCase() === String(status).toUpperCase());
        }

        // Note: route/date/language are not part of TeamData in current UI; skip those filters unless fields exist

        // Apply search prefix filter on teamName
        if (q) {
            out = out.filter(t => (t.teamName || '').toLowerCase().startsWith(q));
        }

        // If no filters selected and no search, show all (out already equals rawTeams)
        setDisplayedTeams(out.map((t, idx) => ({ ...t, no: idx + 1 })));
    }, [rawTeams, activeFilters, searchQuery]);

    // Show TeamDetailsTable or TeamDetailsPhotos or TeamDetailsVideos if requested
    let detailsContent: React.ReactNode = null;
    if (showTeamDetailsIdx !== null && teams && rawTeams[showTeamDetailsIdx]) {
        const team = rawTeams[showTeamDetailsIdx];
        console.log("Team Data: ", team)
        // Create riddles array with name, episode, type fields
        const riddles = team?.riddles?.map((r: any) => ({
            riddle: {
                name: r.riddle.name,
                episode: r.riddle.episode,
                type: r.riddle.type,
            },
            riddleStatus: r.riddleStatus || "UNSOLVED",
            riddleScore: r.riddleScore || 0,
        }));
        if (activeView === 'photos') {
            detailsContent = (
                <TeamDetailsPhotos
                    team={{ ...team }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                />
            );
        } else if (activeView === 'videos') {
            detailsContent = (
                <TeamDetailsVideos
                    team={{ ...team }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                />
            );
        } else if (activeView === 'table') {
            detailsContent = (
                <TeamDetailsTable
                    team={{ ...team, riddles: riddles || [] }}
                    onBack={() => { setActiveView(null); setShowTeamDetailsIdx(null); }}
                    OperatorData={OperatorData}
                    onUpdated={(updated: any) => {
                        // update rawTeams with updated team document from server
                        setRawTeams(prev => prev.map(p => ((p as any).id === updated._id || (p as any)._id === updated._id) ? ({ ...p, ...mapServerTeam(updated) }) : p));
                    }}
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
                                    onClick={async () => {
                                        if (showTeamDetailsIdx === null) return;
                                        const team = displayedTeams[showTeamDetailsIdx];
                                        if (!team) return;
                                        try {
                                            const id = (team as any).id || (team as any)._id;
                                            if (id) {
                                                const res = await api.delete('/operator/delete_team', { data: { _id: id } });
                                                if (res.data && res.data.success) {
                                                    setRawTeams(prev => prev.filter(p => (p as any).id !== id && (p as any)._id !== id));
                                                }
                                            } else {
                                                // fallback local removal
                                                setRawTeams(prev => {
                                                    const idxInRaw = prev.findIndex(p => p.no === team.no || p.teamName === team.teamName);
                                                    if (idxInRaw >= 0) { const copy = prev.slice(); copy.splice(idxInRaw, 1); return copy; }
                                                    return prev;
                                                });
                                            }
                                        } catch (err) { console.error('delete team error', err); }
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
                    <FilterPopup isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} buttonRef={filterButtonRef} onApply={(f) => setActiveFilters(f)} />
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    {/* <div className="p-2 border-b border-gray-200">
                       
                    </div> */}
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
                                        {/* <div className="flex items-center text-center"> */}
                                        {team.battery}%
                                        {/* </div> */}
                                    </td>
                                    <td className="px-2 py-2 text-center">{team.startedOn ? new Date(team.startedOn).toLocaleDateString() : '-'}</td>
                                    <td className="px-2 py-2 text-center relative">
                                        <OperatorActionsMenu
                                            open={menuOpenIdx === index}
                                            onOpen={() => setMenuOpenIdx(index)}
                                            onClose={() => setMenuOpenIdx(null)}
                                            onTeamDetails={() => { setShowTeamDetailsIdx(index); setActiveView('table'); setMenuOpenIdx(null); }}
                                            onTeamPhotos={() => { setShowTeamDetailsIdx(index); setActiveView('photos'); setMenuOpenIdx(null); }}
                                            onTeamVideos={() => { setShowTeamDetailsIdx(index); setActiveView('videos'); setMenuOpenIdx(null); }}
                                            onEditTeamName={() => { setShowTeamDetailsIdx(index); setEditTeamName(displayedTeams[index]?.teamName || ''); setActiveView('edit'); setMenuOpenIdx(null); }}
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
                <TeamDetailsEdit editTeamName={editTeamName} setEditTeamName={setEditTeamName} teamId={displayedTeams[showTeamDetailsIdx ?? 0]?.id} setActiveView={setActiveView} onUpdated={(updated: any) => {
                    setRawTeams(prev => prev.map(p => ((p as any).id === updated._id || (p as any)._id === updated._id) ? ({ ...p, ...mapServerTeam(updated) }) : p));
                }} />
            }
            {activeView === 'info' &&
                <TeamDetailsInfo teamId={displayedTeams[showTeamDetailsIdx ?? 0]?.id} initialPhone={displayedTeams[showTeamDetailsIdx ?? 0]?.phone as unknown as string} initialPlayingTime={displayedTeams[showTeamDetailsIdx ?? 0]?.playingTime as unknown as string} setActiveView={setActiveView} onUpdated={(updated: any) => {
                    setRawTeams(prev => prev.map(p => ((p as any).id === updated._id || (p as any)._id === updated._id) ? ({ ...p, ...mapServerTeam(updated) }) : p));
                }} />
            }
        </div>
    );
}

// Helper to map a server team doc to our TeamData partial shape
function mapServerTeam(t: any) {
    return {
        id: t._id || t.id,
        teamName: t.name,
        score: t.score,
        status: t.status,
        timeLeft: t.timeLeft,
        battery: String(t.Battery ?? t.battery ?? 0),
        startedOn: t.StartedAt,
        lat: t.coordinates?.coordinates?.[1] ?? 0,
        lng: t.coordinates?.coordinates?.[0] ?? 0,
        riddles: t.riddles || [],
        teamPics: t.teamPics || [],
        teamVids: t.teamVids || [],
        phone: t.phone,
        playingTime: t.playingTime,
    };
}

export default OperatorTable;