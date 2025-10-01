import React from 'react';
import GameTable from '@/pages/GameTable';
import { redirect } from 'next/navigation';
import { getGameData } from '@/lib/gameConfig';

interface GamesPageProps {
    searchParams: {
        name?: string;
    };
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
    const params = await searchParams;
    const gameType = params?.name || 'magic-portal';
    const gameData = getGameData(gameType);

    // If invalid game type, redirect to magic-portal
    if (!gameData) {
        redirect('/games?name=magic-portal');
    }

    return (
        <div className="h-full w-full bg-[#f2f3f8] p-6">

            {/* Game Content */}
            <div className='bg-white rounded-lg shadow-sm mb-6 p-5'>
                <h1 className="text-3xl font-bold text-gray-800">{gameData.title}</h1>
            </div>

            {/* Game Table */}
            <GameTable gameData={gameData} />
        </div>
    );
}
