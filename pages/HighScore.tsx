"use client";
import React, { useRef, useState } from "react";
import HighscoreActionsMenu from "../components/Highscore/HighscoreActionsMenu";
import HighscoreShow from "../components/Highscore/HighscoreShow";
import HighscoreEditName from "../components/Highscore/HighscoreEditName";
import HighscoreReset from "../components/Highscore/HighscoreReset";
import HighscoreDelete from "../components/Highscore/HighscoreDelete";
import HighscoreAdd from "../components/Highscore/HighscoreAdd";

interface HighscoreRow {
    game?: string;
    name?: string;
    teams?: number | string;
    lastEdited?: string;
    savedHighscore?: string | number;
}

const savedHighscores: HighscoreRow[] = [];

interface HighScoreProps {
    highScoreData?: { rows?: HighscoreRow[] };
}

const HighScore: React.FC<HighScoreProps> = ({ highScoreData }) => {
    const [liveHighscores, setLiveHighscores] = useState<HighscoreRow[]>(highScoreData?.rows || []);
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
    const [showModalIdx, setShowModalIdx] = useState<number | null>(null);
    const [showModalOpen, setShowModalOpen] = useState(false);
    const actionAnchorRefs = liveHighscores.map(() => useRef<HTMLButtonElement>(null));
    const [editNameIdx, setEditNameIdx] = useState<number | null>(null);
    const [editNameOpen, setEditNameOpen] = useState(false);
    const [editNameValue, setEditNameValue] = useState("");
    const [resetIdx, setResetIdx] = useState<number | null>(null);
    const [resetOpen, setResetOpen] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const demoTeams = [
        { no: 1, teamName: "Nannybashers", routeName: "DR5", score: 0, status: "PLAYING", time: "73 h 3 m", startedOn: "01.10.2025" },
        { no: 2, teamName: "The dingy riders", routeName: "DR5", score: 6000, status: "PLAYING", time: "73 h 5 m", startedOn: "01.10.2025" },
        { no: 3, teamName: "Quandeldingle", routeName: "DR3", score: 3000, status: "PLAYING", time: "73 h 8 m", startedOn: "01.10.2025" },
        { no: 4, teamName: "Billy bob joe 67", routeName: "DR4", score: 1000, status: "PLAYING", time: "73 h 8 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
        { no: 5, teamName: "Dudes", routeName: "DR6", score: 8100, status: "PLAYING", time: "73 h 11 m", startedOn: "01.10.2025" },
    ];
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
                                    <td className="py-2 px-2 text-center">{row.game}</td>
                                    <td className="py-2 px-2 text-center">{row.name}</td>
                                    <td className="py-2 px-2 text-center">{row.teams}</td>
                                    <td className="py-2 px-2 text-center">{row.lastEdited}</td>
                                    <td className="py-2 px-2 text-center relative">
                                        <button
                                            ref={actionAnchorRefs[idx]}
                                            className="text-gray-400 hover:text-gray-600 hover:bg-sky-500 rounded-[50%] p-1"
                                            onClick={() => {
                                                if (menuOpenIdx === idx) {
                                                    setMenuOpenIdx(null);
                                                } else
                                                    setMenuOpenIdx(idx);
                                            }}
                                        >
                                            <svg className="w-4 h-4 hover:text-white text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                                            </svg>
                                        </button>
                                        <HighscoreActionsMenu
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
                                            onSave={() => {/* TODO: Implement Save */ setMenuOpenIdx(null); }}
                                            onDownloadTeamData={() => {/* TODO: Implement Download Team Data */ setMenuOpenIdx(null); }}
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
                                            anchorRef={actionAnchorRefs[idx] as React.RefObject<HTMLButtonElement>}
                                        />
                                        {/* Show modal for teams */}
                                        {showModalOpen && showModalIdx === idx && (
                                            <HighscoreShow
                                                open={showModalOpen}
                                                onClose={() => setShowModalOpen(false)}
                                                highscoreName={row.name || "Highscore"}
                                                teams={demoTeams}
                                            />
                                        )}
                                        {/* Edit Name modal */}
                                        {editNameOpen && editNameIdx === idx && (
                                            <HighscoreEditName
                                                open={editNameOpen}
                                                initialName={editNameValue}
                                                onClose={() => setEditNameOpen(false)}
                                                onSave={() => {
                                                    // TODO: Save new name to backend or state
                                                    setEditNameOpen(false);
                                                }}
                                            />
                                        )}
                                        {/* Reset modal */}
                                        {resetOpen && resetIdx === idx && (
                                            <HighscoreReset
                                                open={resetOpen}
                                                onClose={() => setResetOpen(false)}
                                                onReset={() => {
                                                    // TODO: Reset teams for this highscore
                                                    setResetOpen(false);
                                                }}
                                            />
                                        )}
                                        {/* Delete modal */}
                                        {deleteOpen && deleteIdx === idx && (
                                            <HighscoreDelete
                                                open={deleteOpen}
                                                onClose={() => setDeleteOpen(false)}
                                                onDelete={() => {
                                                    // setLiveHighscores(prev => prev.filter((_, i) => i !== deleteIdx));
                                                    // setDeleteOpen(false);
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
                    gameName={liveHighscores[0]?.game || "Operation Mindfall"}
                    onAdd={() => {
                        // setLiveHighscores(prev => [
                        //     ...prev,
                        //     {
                        //         game: liveHighscores[0]?.game || "Operation Mindfall",
                        //         name,
                        //         teams: 0,
                        //         lastEdited: new Date().toLocaleString(),
                        //     }
                        // ]);
                        // setAddOpen(false);
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
                            {savedHighscores.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-400">No saved highscores</td>
                                </tr>
                            ) : (
                                savedHighscores.map((row: HighscoreRow, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-2 px-2 text-center">{row.game}</td>
                                        <td className="py-2 px-2 text-center">{row.name}</td>
                                        <td className="py-2 px-2 text-center">{row.teams}</td>
                                        <td className="py-2 px-2 text-center">{row.savedHighscore}</td>
                                        <td className="py-2 px-2 text-center">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <span className="font-bold text-xl">...</span>
                                            </button>
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
