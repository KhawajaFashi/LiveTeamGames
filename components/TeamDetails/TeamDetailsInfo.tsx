import React from 'react'

type ActiveView = "details" | "photos" | "videos" | "edit" | "table" | "info" | "delete" | null;

import api from '@/utils/axios';

interface Props {
    teamId?: string;
    initialPhone?: string;
    initialPlayingTime?: string;
    setActiveView: (view: ActiveView) => void;
    onUpdated?: (updatedTeam: any) => void;
}


const TeamDetailsInfo = ({ teamId, initialPhone, initialPlayingTime, setActiveView, onUpdated }: Props) => {
    const [PhoneNumber, setPhoneNumber] = React.useState(initialPhone ?? "");
    const [PlayingTime, setPlayingTime] = React.useState(initialPlayingTime ?? "");

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
                            className="border border-gray-200 px-3 py-1 rounded flex-1 focus:outline-none focus:border-blue-500 text-gray-600 font-normal"
                            placeholder="Phone number"
                            value={PhoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center ">
                        <label className="font-medium mb-1 mr-10">Playing Time:</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 px-3 py-1 rounded flex-1 focus:outline-none focus:border-blue-500 text-gray-600 font-normal"
                            placeholder="Playing time"
                            value={PlayingTime}
                            onChange={e => setPlayingTime(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-8">
                    <button className="px-4 py-1 bg-gray-100 rounded" onClick={() => { setActiveView(null); }}>Close</button>
                    <button className="px-4 py-1 bg-[#00A3FF] text-white rounded" onClick={async () => {
                        if (!teamId) { setActiveView(null); return; }
                        try {
                            const res = await api.post('/operator/update_team_info', { _id: teamId, phone: PhoneNumber, playingTime: PlayingTime });
                            if (res.data && res.data.success && onUpdated) onUpdated(res.data.data);
                        } catch (err) { console.error(err); }
                        setActiveView(null);
                    }}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default TeamDetailsInfo;