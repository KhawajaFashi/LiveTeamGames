import React from 'react'

type ActiveView = "details" | "photos" | "videos" | "edit" | "table" | "info" | "delete" | null;

interface Props {
    editTeamName: string;
    setEditTeamName: (name: string) => void;
    setActiveView: (view: ActiveView) => void;
}


const TeamDetailsEdit = ({ editTeamName, setEditTeamName, setActiveView }: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="bg-white rounded-lg shadow-lg w-[30%] p-6 relative">
                <div className="border-b border-gray-200 mb-10">

                    <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={() => { setActiveView(null); }}>
                        ×
                    </button>
                    <h2 className="text-lg font-semibold mb-7">Edit Team Name</h2>
                </div>
                <div className="flex flex-col gap-6 border-b border-gray-200 pb-10">
                    <div className="flex gap-2 items-center ">
                        <label className="font-medium mb-1 mr-6">Team name <span className="text-red-600">*</span> :</label>
                        <input
                            type="text"
                            className="border border-gray-200 px-3 py-1 rounded flex-1 focus:outline-none focus:border-blue-500"
                            placeholder="Team name"
                            value={editTeamName}
                            onChange={e => setEditTeamName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-8">
                    <button className="px-4 py-1 bg-gray-100 rounded" onClick={() => { setActiveView(null); }}>Close</button>
                    <button className="px-4 py-1 bg-[#00A3FF] text-white rounded" onClick={() => { /* Save logic here */ setActiveView(null); }}>Edit Name</button>
                </div>
            </div>
        </div>
    )
}

export default TeamDetailsEdit