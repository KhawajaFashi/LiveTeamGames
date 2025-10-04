
import React from "react";

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
    const liveHighscores: HighscoreRow[] = highScoreData?.rows || [];
    return (
        <div>
            {/* Live Highscore Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8 w-full">
                <div className="flex justify-between items-center px-8 pt-4 pb-2 border-b border-gray-200 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Live Highscore</h2>
                    <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-md font-medium">Add Highscore</button>
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
                                    <td className="py-2 px-2 text-center">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <span className="font-bold text-xl">...</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
