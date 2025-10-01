import React from 'react';
import { GameData } from '../lib/gameConfig';

interface GameTableProps {
    gameData: GameData;
}

const GameTable: React.FC<GameTableProps> = ({ gameData }) => {


    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Controls Section */}
            {/* <div className="p-6 border-b border-gray-200"> */}
            <div className="flex xl:flex-row flex-col gap-4 items-center justify-between p-6 border-b border-gray-200">
                {/* Filter Button */}
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#00adee] text-white rounded-lg transition-colors">
                    <span>Filter</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Search Bar */}
                <div className="flex-1 max-w-sm ">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={gameData.searchPlaceholder}
                            className="w-full max-lg:text-[12px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Add Button */}
                <button className="px-4 py-2 bg-[#00adee] text-white rounded-lg">
                    {gameData.addButtonText}
                </button>
                {/* </div> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Table Header */}
                    <thead className="bg-[#1A2B42] text-white">
                        <tr>
                            <th className="px-6 py-4 text-center text-sm font-medium">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium">{gameData.columns.name}</th>
                            <th className="px-6 py-4 text-left text-sm font-medium">{gameData.columns.count}</th>
                            <th className="px-6 py-4 text-left text-sm font-medium">{gameData.columns.lang}</th>
                            <th className="px-6 py-4 text-left text-sm font-medium">
                                <div className="flex items-center space-x-1">
                                    <span>{gameData.columns.status}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium">
                                <div className="flex items-center space-x-1">
                                    <span>{gameData.columns.lastEdited}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium">{gameData.columns.action}</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {gameData.rows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                                <td className="px-10 py-4 text-sm text-blue-600 font-medium">{row.count}</td>
                                <td className="px-6 py-4 text-sm text-blue-600 font-medium">{row.lang}</td>
                                <td className="px-10">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="peer hidden"
                                        />
                                        <span className="h-4 w-4 border border-red-500 rounded-sm 
                                                peer-checked:bg-red-600 peer-checked:border-red-600 
                                                relative flex items-center justify-center">
                                            <svg
                                                className="peer-checked:block w-5 h-5 text-white"
                                                fill="white"
                                                // stroke="currentColor"
                                                strokeWidth="1"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13m0 4L20 5" />
                                            </svg>
                                        </span>
                                    </label>


                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{row.lastEdited}</td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameTable;
