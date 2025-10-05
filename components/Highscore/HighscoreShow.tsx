import React from "react";

interface TeamRow {
    no: number;
    teamName: string;
    routeName: string;
    score: number;
    status: string;
    time: string;
    startedOn: string;
}

interface HighscoreShowProps {
    open: boolean;
    onClose: () => void;
    highscoreName: string;
    teams: TeamRow[];
}

const HighscoreShow: React.FC<HighscoreShowProps> = ({ open, onClose, highscoreName, teams }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
            <div className="bg-white rounded-lg shadow-lg w-[700px] max-w-full p-8 relative">
                <button className="absolute top-4 right-6 text-gray-400 text-2xl" onClick={onClose}>×</button>
                <h2 className="text-2xl font-bold text-left mb-6 border-b pb-4 border-gray-200">{highscoreName}</h2>
                <div className="mb-4 text-left border-b border-gray-200">
                    <button className="px-4 py-2 border border-gray-200 outline-none"
                        style={{ borderBottom: '0px' }}
                    >All Teams</button>
                </div>
                <div className="overflow-auto h-100">
                    <table className="w-full text-[14px]    ">
                        <thead>
                            <tr className="bg-[#0D1B2A] text-white">
                                <th className="py-3 px-2 text-center font-semibold">No</th>
                                <th className="py-3 px-2 text-center font-semibold">Team Name</th>
                                <th className="py-3 px-2 text-center font-semibold">Route Name</th>
                                <th className="py-3 px-2 text-center font-semibold">Score</th>
                                <th className="py-3 px-2 text-center font-semibold">Status</th>
                                <th className="py-3 px-2 text-center font-semibold">Time</th>
                                <th className="py-3 px-2 text-center font-semibold">Started on</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, idx) => (
                                <tr key={team.no} className={idx % 2 === 1 ? "bg-[#f7f8fa]" : ""}>
                                    <td className="py-2 px-2 text-center">{team.no}</td>
                                    <td className="py-2 px-2 text-center">{team.teamName}</td>
                                    <td className="py-2 px-2 text-center">{team.routeName}</td>
                                    <td className="py-2 px-2 text-center">{team.score}</td>
                                    <td className="py-2 px-2 text-center">{team.status}</td>
                                    <td className="py-2 px-2 text-center">{team.time}</td>
                                    <td className="py-2 px-2 text-center">{team.startedOn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-gray-100 rounded" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default HighscoreShow;
