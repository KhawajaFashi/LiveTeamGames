import React from 'react';
import HighScore from '@/pages/HighScore';
import { getScoreData } from '@/lib/scoreConfig';
import { redirect } from 'next/navigation';

interface HighScorePageProps {
    searchParams: {
        name?: string;
    };
}

export default async function HighScorePage({ searchParams }: HighScorePageProps) {
    const params = await searchParams;
    const highScoreType = params?.name || 'game1';
    const highScoreData = getScoreData(highScoreType);

    // If invalid game type, redirect to magic-portal
    if (!highScoreData) {
        redirect('/highscores?name=game2');
    }

    return (
        <div className="h-full bg-[#f2f3f8] p-6">

            {/* Game Table */}
            <HighScore highScoreData={highScoreData} />

        </div>
    );
}
