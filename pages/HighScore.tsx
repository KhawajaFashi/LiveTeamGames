"use client";
import React, { useEffect, useRef, useState } from "react";
import HighscoreActionsMenu from "../components/Highscore/HighscoreActionsMenu";
import HighscoreShow from "../components/Highscore/HighscoreShow";
import HighscoreEditName from "../components/Highscore/HighscoreEditName";
import HighscoreReset from "../components/Highscore/HighscoreReset";
import HighscoreDelete from "../components/Highscore/HighscoreDelete";
import HighscoreAdd from "../components/Highscore/HighscoreAdd";
import api from "@/utils/axios";
import SavedHighscoreActionsMenu from "@/components/Highscore/SavedHighscoreActionsMenu";

interface HighscoreRow {
    _id?: string;
    gameName?: string;
    name?: string;
    updatedAt?: string;
    createdAt?: string;
    saved?: string | number;
    teams?: Team[] | [];
}

interface Team {
    _id: string;
    name: string;
    gameName: string;
    score: number;
    status: string;
    phone: string;
    Battery: number;
    StartedAt: string;
    playingTime: string;
    timeLeft: string;
    createdAt: string;
    updatedAt: string;
    riddles: Record<string, any>[];
    route: Route[]; // populated routes
    routeName?: string;
    teamPics: any[];
    teamVids: any[];
    __v: number;
    coordinates: {
        type: string;
        coordinates: [number, number];
    };
}
interface Route {
    _id: string;
    name: string;
}

interface RouteWithTeams {
    route: Route;
    teams: Team[] | [];
}

interface HighScoresInterface {
    highScore: HighscoreRow;
    routes: RouteWithTeams[] | [];
}

interface HighScoreProps {
    highScoreType?: string | '';
}

const HighScore: React.FC<HighScoreProps> = ({ highScoreType }) => {
    const gameName = highScoreType || '';
    const [liveHighscores, setLiveHighscores] = useState<HighscoreRow[]>([]);
    const [saveHighscores, setSaveHighscores] = useState<HighscoreRow[]>([]);
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const [savedMenuOpenIdx, setSavedMenuOpenIdx] = useState<number | null>(null);
    const [showModalIdx, setShowModalIdx] = useState<number | null>(null);
    const [showModalOpen, setShowModalOpen] = useState(false);
    const actionAnchorRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const savedActionAnchorRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [editNameIdx, setEditNameIdx] = useState<number | null>(null);
    const [editNameOpen, setEditNameOpen] = useState(false);
    const [editNameValue, setEditNameValue] = useState("");
    const [resetIdx, setResetIdx] = useState<number | null>(null);
    const [resetOpen, setResetOpen] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    useEffect(() => {
        const fetch_data = async () => {
            const res = await api.get(`/highscore/fetch_data?gameName=${encodeURIComponent(gameName)}`);
            return res.data.data;
        }
        const fetchAll = async () => {
            const res = await fetch_data(); // ✅ await the promise
            console.log("Response", res)
            if (res) {
                const highScores: HighscoreRow[] = res.map((r: any) => ({
                    _id: r.highScore._id,
                    gameName: r.highScore.gameName,
                    name: r.highScore.name,
                    updatedAt: r.highScore.updatedAt,
                    createdAt: r.highScore.createdAt,
                    saved: r.highScore.saved,
                    teams: Array.from(
                        new Map(
                            r.routes
                                .flatMap((route: any) =>
                                    route.teams.map((team: any) => ({
                                        ...team.toObject?.() ?? team, // ensure plain object
                                        routeName: route.route as string,       // attach route name
                                        StartedAt: new Date(team.StartedAt)
                                    }))
                                )
                                .map((team: any) => [team._id.toString(), team]) // unique by _id
                        ).values()
                    ),
                }));


                const savedHighScores = highScores.filter(h => h.saved); // saved = true
                const liveHighScores = highScores.filter(h => !h.saved); // saved = false

                liveHighScores.sort((a: HighscoreRow, b: HighscoreRow) => {
                    // Keep "Game1 Default" always on top
                    if (a.name === "Game1 Default") return -1;
                    if (b.name === "Game1 Default") return 1;

                    // Sort the rest by createdAt (descending)
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });

                setLiveHighscores(liveHighScores);
                setSaveHighscores(savedHighScores);
                console.log("Live HighScores", liveHighScores);
                console.log("Saved HighScores", savedHighScores);
            }
        };

        fetchAll();
        // setLiveHighscores();
        // setLiveHighscores(highScoreData?.rows ?? []);
    }, [gameName]);

    // Helper: convert teams array to CSV and trigger download
    function downloadTeamsAsCSV(teams: Team[] | [], fileNamePrefix = 'teams') {
        if (!teams || teams.length === 0) {
            // nothing to download
            return;
        }

        // Define the CSV columns we want
        const columns = [
            'name',
            'routeName',
            'score',
            'status',
            'phone',
            'Battery',
            'StartedAt',
            'playingTime',
            'timeLeft',
            'createdAt',
            'updatedAt',
            'coordinates',
            'riddlesCount',
        ];

        const escapeCell = (value: any) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value).replace(/"/g, '""');
        };

        const header = columns.join(',');
        const rows = teams.map(team => {
            const coords = team.coordinates ? `${team.coordinates.type} ${JSON.stringify(team.coordinates.coordinates)}` : '';
            const started = team.StartedAt ? new Date(team.StartedAt).toISOString() : '';
            const created = team.createdAt ? new Date(team.createdAt).toISOString() : '';
            const updated = team.updatedAt ? new Date(team.updatedAt).toISOString() : '';
            const rowVals = [
                team.name || '',
                team.routeName || '',
                team.score ?? '',
                team.status || '',
                team.phone || '',
                team.Battery ?? '',
                started,
                team.playingTime || '',
                team.timeLeft || '',
                created,
                updated,
                coords,
                Array.isArray(team.riddles) ? team.riddles.length : '',
            ];
            return rowVals.map(v => `"${escapeCell(v)}"`).join(',');
        });

        const csvContent = [header, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = (fileNamePrefix || 'teams').replace(/[^a-z0-9-_\.]/gi, '_');
        a.download = `${safeName}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
    {/* Live Highscore Section */ }
    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm mb-8 w-full">
                <div className="flex justify-between items-center px-8 pt-4 pb-2 border-b border-gray-200 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Live Highscore</h2>
                    <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-md font-medium" onClick={() => setAddOpen(true)}>Add Highscore</button>
                </div>
                <div className="mx-8 max-lg:mx-3 pb-8 overflow-x-auto">
                    <table className="w-full text-[14px]">
                        <thead>
                            <tr className="bg-[#0D1B2A] text-white">
                                <th className="py-3 px-2 text-center font-semibold">Game</th>
                                <th className="py-3 px-2 text-center font-semibold">Highscore Name</th>
                                <th className="py-3 px-2 text-center font-semibold">Teams</th>
                                <th className="py-3 px-2 text-center font-semibold">Last edited</th>
                                <th className="py-3 px-2 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liveHighscores.map((row: HighscoreRow, idx: number) => (
                                <tr key={idx} className={idx % 2 === 1 ? "bg-[#f7f8fa]" : ""}>
                                    <td className="py-2 px-2 text-center">{row.gameName}</td>
                                    <td className="py-2 px-2 text-center">{row.name}</td>
                                    <td className="py-2 px-2 text-center">{row?.teams?.length}</td>
                                    <td className="py-2 px-2 text-center">{row?.updatedAt
                                        ? new Date(row.updatedAt).toISOString().split("T")[0].replace(/-/g, ".") + " " + new Date(row.updatedAt).toISOString().split("T")[1].split(":")[0] + ":" + new Date(row.updatedAt).toISOString().split("T")[1].split(":")[1]
                                        : "-"} </td>
                                    <td className="py-2 px-2 text-center relative">
                                        <button
                                            ref={(el) => { actionAnchorRefs.current[idx] = el; }}
                                            className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1"
                                            onClick={() => {
                                                if (menuOpenIdx === idx) setMenuOpenIdx(null);
                                                else setMenuOpenIdx(idx);
                                            }}
                                        >
                                            <svg className="w-4 h-4 hover:text-white text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                                            </svg>
                                        </button>
                                        <HighscoreActionsMenu
                                            idx={idx}
                                            open={menuOpenIdx === idx}
                                            onClose={() => setMenuOpenIdx(null)}
                                            onShow={() => {
                                                setShowModalIdx(idx);
                                                setShowModalOpen(true);
                                                setMenuOpenIdx(null);
                                            }}
                                            onEditName={() => {
                                                setEditNameIdx(idx);
                                                setEditNameValue(row.name || "");
                                                setEditNameOpen(true);
                                                setMenuOpenIdx(null);
                                            }}
                                            onSave={async () => {
                                                const rowId = liveHighscores[idx]?._id;
                                                if (!rowId) return;
                                                try {
                                                    const res = await api.post('/highscore/save_high_score', { _id: rowId });
                                                    if (res.data?.success) {
                                                        // Move to saved highscores
                                                        const saved = liveHighscores[idx];
                                                        setLiveHighscores(prev => prev.filter((_, i) => i !== idx));
                                                        setSaveHighscores(prev => [{
                                                            ...saved,
                                                            saved: "1", // Use string "1" to match interface
                                                            updatedAt: new Date().toISOString()
                                                        }, ...prev]);
                                                    }
                                                } catch (err) {
                                                    console.error('Failed to save highscore:', err);
                                                }
                                                setMenuOpenIdx(null);
                                            }}
                                            onDownloadTeamData={() => {
                                                // generate CSV from teams shown in this highscore row
                                                const teams = row?.teams || [];
                                                downloadTeamsAsCSV(teams, `${row.name || 'teams'}`);
                                                setMenuOpenIdx(null);
                                            }}
                                            onReset={() => {
                                                setResetIdx(idx);
                                                setResetOpen(true);
                                                setMenuOpenIdx(null);
                                            }}
                                            onDelete={() => {
                                                setDeleteIdx(idx);
                                                setDeleteOpen(true);
                                                setMenuOpenIdx(null);
                                            }}
                                            anchorRef={{ current: actionAnchorRefs.current[idx] as HTMLButtonElement }}
                                        />
                                        {/* Show modal for teams */}
                                        {showModalOpen && showModalIdx === idx && (
                                            <HighscoreShow
                                                open={showModalOpen}
                                                onClose={() => setShowModalOpen(false)}
                                                highscoreName={row.name || "Highscore"}
                                                teams={row?.teams || []}
                                            />
                                        )}
                                        {/* Edit Name modal */}
                                        {editNameOpen && editNameIdx === idx && (
                                            <HighscoreEditName
                                                open={editNameOpen}
                                                initialName={editNameValue}
                                                onClose={() => setEditNameOpen(false)}
                                                onSave={async (newName: string) => {
                                                    const rowId = liveHighscores[idx]?._id;
                                                    if (!rowId) { setEditNameOpen(false); return; }
                                                    try {
                                                        const res = await api.post('/highscore/edit_name', { _id: rowId, name: newName });
                                                        const data = res.data;
                                                        if (data?.success && data.data) {
                                                            setLiveHighscores(prev => prev.map((r, i) => i === idx ? { ...r, name: data.data.name, updatedAt: data.data.updatedAt } : r));
                                                        } else {
                                                            setLiveHighscores(prev => prev.map((r, i) => i === idx ? { ...r, name: newName } : r));
                                                        }
                                                    } catch (err) {
                                                        console.error('Edit name failed', err);
                                                        setLiveHighscores(prev => prev.map((r, i) => i === idx ? { ...r, name: newName } : r));
                                                    }
                                                    setEditNameOpen(false);
                                                }}
                                            />
                                        )}
                                        {/* Reset modal */}
                                        {resetOpen && resetIdx === idx && (
                                            <HighscoreReset
                                                open={resetOpen}
                                                onClose={() => setResetOpen(false)}
                                                onReset={async () => {
                                                    const rowId = liveHighscores[idx]?._id;
                                                    if (!rowId) {
                                                        setResetOpen(false);
                                                        return;
                                                    }
                                                    try {
                                                        const res = await api.post('/highscore/reset', { _id: rowId });
                                                        if (res.data?.success) {
                                                            // Update the highscore in list to reflect reset
                                                            setLiveHighscores(prev => prev.map((h, i) =>
                                                                i === idx
                                                                    ? { ...h, teams: [], updatedAt: new Date().toISOString() }
                                                                    : h
                                                            ));
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to reset highscore:', err);
                                                    }
                                                    setResetOpen(false);
                                                }}
                                            />
                                        )}
                                        {/* Delete modal */}
                                        {deleteOpen && deleteIdx === idx && (
                                            <HighscoreDelete
                                                open={deleteOpen}
                                                onClose={() => setDeleteOpen(false)}
                                                onDelete={async () => {
                                                    const rowId = liveHighscores[idx]?._id;
                                                    if (!rowId) {
                                                        setDeleteOpen(false);
                                                        return;
                                                    }
                                                    try {
                                                        const res = await api.post('/highscore/delete', { _id: rowId });
                                                        if (res.data?.success) {
                                                            setLiveHighscores(prev => prev.filter((_, i) => i !== idx));
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to delete highscore:', err);
                                                    }
                                                    setDeleteOpen(false);
                                                }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Add Highscore modal */}
            {addOpen && (
                <HighscoreAdd
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    gameName={liveHighscores[0]?.gameName || "Game1"}
                    onAdd={async (name: string) => {
                        if (!name || name.trim().length === 0) return;
                        try {
                            const payload = { gameName: liveHighscores[0]?.gameName || gameName || 'Game1', name };
                            const res = await api.post('/highscore/add_high_score', payload);
                            const data = res.data;
                            if (data?.success && data.data) {
                                const created: HighscoreRow = {
                                    _id: data.data._id,
                                    gameName: data.data.gameName,
                                    name: data.data.name,
                                    updatedAt: data.data.updatedAt,
                                    saved: data.data.saved,
                                    teams: [],
                                };
                                setLiveHighscores(prev => [created, ...prev]);
                                setAddOpen(false);
                            }
                        } catch (err) {
                            console.error('Add highscore failed', err);
                        }
                    }}
                />
            )}

            {/* Saved Highscore Section */}
            <div className="bg-white rounded-lg shadow-sm w-full">
                <div className="px-8 pt-4 pb-2 border-b border-gray-200 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Saved Highscore</h2>
                </div>
                <div className="mx-8 max-lg:mx-3 pb-8 overflow-x-auto pr-4">
                    <table className="w-full text-[14px]">
                        <thead>
                            <tr className="bg-[#0D1B2A] text-white">
                                <th className="py-3 px-4 text-center font-semibold">Game</th>
                                <th className="py-3 px-4 text-center font-semibold">Highscore Name</th>
                                <th className="py-3 px-4 text-center font-semibold">Teams</th>
                                <th className="py-3 px-4 text-center font-semibold">Saved Highscore</th>
                                <th className="py-3 px-4 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saveHighscores.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-400">No saved highscores</td>
                                </tr>
                            ) : (
                                saveHighscores.map((row: HighscoreRow, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-2 px-2 text-center">{row.gameName}</td>
                                        <td className="py-2 px-2 text-center">{row.name}</td>
                                        <td className="py-2 px-2 text-center">{row.teams?.length}</td>
                                        <td className="py-2 px-2 text-center">{row?.updatedAt
                                            ? new Date(row.updatedAt).toISOString().split("T")[0].replace(/-/g, ".") + " " + new Date(row.updatedAt).toISOString().split("T")[1].split(":")[0] + ":" + new Date(row.updatedAt).toISOString().split("T")[1].split(":")[1]
                                            : "-"}</td>
                                        <td className="py-2 px-2 text-center relative">
                                            <button
                                                ref={(el) => { savedActionAnchorRefs.current[idx] = el; }}
                                                className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1"
                                                onClick={() => {
                                                    if (savedMenuOpenIdx === idx) setSavedMenuOpenIdx(null);
                                                    else setSavedMenuOpenIdx(idx);
                                                }}
                                            >
                                                <svg className="w-4 h-4 hover:text-white text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                                                </svg>
                                            </button>
                                            <SavedHighscoreActionsMenu
                                                open={savedMenuOpenIdx === idx}
                                                onClose={() => setSavedMenuOpenIdx(null)}
                                                onShow={() => {
                                                    setShowModalIdx(idx);
                                                    setShowModalOpen(true);
                                                    setSavedMenuOpenIdx(null);
                                                }}
                                                onSave={async () => {
                                                    const rowId = saveHighscores[idx]?._id;
                                                    if (!rowId) return;

                                                    try {
                                                        const res = await api.post('/highscore/save_saved_high_score', { _id: rowId });
                                                        if (res.data?.success) {
                                                            const moved = saveHighscores[idx];

                                                            // Update lists
                                                            const updatedSaved = saveHighscores.filter((_, i) => i !== idx);
                                                            const updatedLive = [
                                                                {
                                                                    ...moved,
                                                                    saved: "0",
                                                                    updatedAt: new Date().toISOString(),
                                                                },
                                                                ...liveHighscores,
                                                            ];

                                                            // Sort live highscores again
                                                            updatedLive.sort((a, b) => {
                                                                if (a.name === "Game1 Default") return -1;
                                                                if (b.name === "Game1 Default") return 1;
                                                                const dateA = new Date(a.createdAt || 0).getTime();
                                                                const dateB = new Date(b.createdAt || 0).getTime();
                                                                return dateB - dateA; // latest first
                                                            });

                                                            setSaveHighscores(updatedSaved);
                                                            setLiveHighscores(updatedLive);
                                                        }
                                                    } catch (err) {
                                                        console.error("Failed to unsave highscore:", err);
                                                    }

                                                    setSavedMenuOpenIdx(null);
                                                }}
                                                onDownloadTeamData={() => {
                                                    const teams = row?.teams || [];
                                                    downloadTeamsAsCSV(teams, `${row.name || 'teams'}`);
                                                    setSavedMenuOpenIdx(null);
                                                }}
                                                anchorRef={{ current: savedActionAnchorRefs.current[idx] as HTMLButtonElement }}
                                            />
                                            {/* Show modal for teams */}
                                            {showModalOpen && showModalIdx === idx && (
                                                <HighscoreShow
                                                    open={showModalOpen}
                                                    onClose={() => setShowModalOpen(false)}
                                                    highscoreName={row.name || "Highscore"}
                                                    teams={row?.teams || []}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default HighScore;
