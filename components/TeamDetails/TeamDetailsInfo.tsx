import React from 'react'

type ActiveView = "details" | "photos" | "videos" | "edit" | "table" | "info" | "delete" | null;

interface Props {
    setActiveView: (view: ActiveView) => void;
}


const TeamDetailsInfo = ({ setActiveView }: Props) => {
    const PhoneNumber = "123-456-7890"; // Example phone number
    const PlayingTime = "45 minutes"; // Example playing time

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="bg-white rounded-lg shadow-lg w-[30%] p-6 relative">
                <div className="border-b border-gray-200 mb-10">

                    <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={() => { setActiveView(null); }}>
                        ×
                    </button>
                    <h2 className="text-lg font-semibold mb-7">Team Info</h2>
                </div>
                <div className="flex flex-col gap-6 border-b border-gray-200 pb-10">
                    <div className="flex gap-2 items-center ">
                        <label className="font-medium mb-1 mr-6">Phone Number:</label>
                        <input
                            type="text"
                            readOnly
                            className="border border-gray-200 px-3 py-1 rounded flex-1 focus:outline-none focus:border-blue-500 text-gray-600 font-normal"
                            placeholder="Team name"
                            value={PhoneNumber}
                        />
                    </div>
                    <div className="flex gap-2 items-center ">
                        <label className="font-medium mb-1 mr-10">Playing Time:</label>
                        <input
                            type="text"
                            readOnly
                            className="border-2 border-gray-200 px-3 py-1 rounded flex-1 focus:outline-none focus:border-blue-500 text-gray-600 font-normal"
                            placeholder="Team name"
                            value={PlayingTime}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-8">
                    <button className="px-4 py-1 bg-gray-100 rounded" onClick={() => { setActiveView(null); }}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default TeamDetailsInfo;