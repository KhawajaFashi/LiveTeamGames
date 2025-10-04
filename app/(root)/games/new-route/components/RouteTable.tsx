"use client";
import React, { useState } from 'react';
import RouteActionsMenu from '@/app/(root)/games/new-route/components/RouteActionsMenu';
import BackButton from './BackButton';

// Example riddle data
const riddles = [
    { no: 1, name: 'The Professor', episode: 1, type: 'AR Professor' },
    { no: 2, name: 'Hidden Location', episode: 2, type: 'LB Photo Quest' },
    { no: 3, name: 'Sea Letter', episode: 3, type: 'AP Bottle Message (Letter)' },
    { no: 4, name: "The Kraken's Secret", episode: 4, type: 'AR Chest (Octopus)' },
    { no: 5, name: 'Color Clues', episode: 5, type: 'MG Team Photo (Colors)' },
    { no: 6, name: 'The Forgotten Map', episode: 6, type: 'AR LBR Treasure Map' },
    { no: 7, name: 'The Lost Treasure', episode: 7, type: 'AP Final Treasure' },
    { no: 8, name: 'Proof of Legends', episode: 8, type: 'MG Team Photo (Final)' },
];

interface RouteTableProps {
    gameID: string;
    routeID: string;
}

const RouteTable: React.FC<RouteTableProps> = ({ gameID, routeID }) => {
    const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);

    return (
        <div className="bg-white shadow-sm">
            <div className='flex justify-between items-center mb-8 p-4 border-b border-gray-200'>
                <h3 className="text-3xl font-semibold">{routeID}</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">English</button>
            </div>
            <table className="w-[95%] mx-auto shadow-sm">
                <thead className="bg-[#000f24] text-white">
                    <tr>
                        <th className="px-6 py-4 text-center text-sm font-medium">No</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Riddle Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Episode</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Riddle Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {riddles.map((riddle, idx) => (
                        <tr key={riddle.no} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-center">{riddle.no}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.episode}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{riddle.type}</td>
                            <td className="px-6 py-4 relative">
                                <RouteActionsMenu
                                    open={menuOpenIdx === idx}
                                    onOpen={() => setMenuOpenIdx(idx)}
                                    onClose={() => setMenuOpenIdx(null)}
                                    gameID={gameID}
                                    routeID={routeID}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-start border-t border-gray-200 mt-5'>
            <BackButton />
            </div>

        </div>
    );
};

export default RouteTable;
