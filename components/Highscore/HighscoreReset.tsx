import React, { useState } from "react";

interface HighscoreResetProps {
    open: boolean;
    onClose: () => void;
    onReset: () => void;
}

const HighscoreReset: React.FC<HighscoreResetProps> = ({ open, onClose, onReset }) => {
    const [confirmText, setConfirmText] = useState("");
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
            <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-8 relative flex flex-col items-center">
                <button className="absolute top-4 right-6 text-gray-400 text-2xl" onClick={onClose}>×</button>
                <div className="flex flex-col items-center mb-4">
                    <div className="text-[#E60050] text-6xl mb-2">&#33;</div>
                    <h2 className="text-xl font-bold mb-2 text-center">Are you sure you want to reset?</h2>
                    <div className="mb-2 text-center text-gray-700">All the teams and their details will be lost.</div>
                    <label className="mb-2 text-center">Type <span className="font-bold">RESET</span> to confirm</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full mb-2 text-center"
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
                        placeholder="RESET"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 bg-gray-100 rounded" onClick={onClose}>Cancel</button>
                    <button
                        className={`px-4 py-2 bg-[#00A3FF] text-white rounded ${confirmText === 'RESET' ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={confirmText !== 'RESET'}
                        onClick={() => { if (confirmText === 'RESET') onReset(); }}
                    >Yes, reset it!</button>
                </div>
            </div>
        </div>
    );
};

export default HighscoreReset;
