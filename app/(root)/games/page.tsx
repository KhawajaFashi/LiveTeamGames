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

    console.log('Game Type:', gameType);

    // If invalid game type, redirect to magic-portal
    if (!gameData) {
        redirect('/games?name=magic-portal');
    }

    return (
        <div className="h-full bg-white shadow-lg m-5">
            <div className='border-b border-gray-200 p-4'>
                <h1 className="text-3xl font-bold text-gray-800">{gameData.title}</h1>
            </div>

            {/* Game Table */}
            <GameTable gameData={gameData} gameType={gameType} />
        </div>
    );
}
