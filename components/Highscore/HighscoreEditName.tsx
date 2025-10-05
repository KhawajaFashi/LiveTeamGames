import React, { useState } from "react";

interface HighscoreEditNameProps {
    open: boolean;
    onClose: () => void;
    initialName: string;
    onSave: (newName: string) => void;
}

const HighscoreEditName: React.FC<HighscoreEditNameProps> = ({ open, onClose, initialName, onSave }) => {
    const [name, setName] = useState(initialName);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
            <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-8 relative">
                <button className="absolute top-4 right-6 text-gray-400 text-2xl" onClick={onClose}>×</button>
                <h2 className="text-2xl font-bold mb-6">Save Highscore</h2>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">
                        Highscore Name <span className="text-red-500">*</span> :
                    </label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-100 rounded" onClick={onClose}>Close</button>
                    <button
                        className="px-4 py-2 bg-[#00A3FF] text-white rounded"
                        onClick={() => onSave(name)}
                    >Save</button>
                </div>
            </div>
        </div>
    );
};

export default HighscoreEditName;
