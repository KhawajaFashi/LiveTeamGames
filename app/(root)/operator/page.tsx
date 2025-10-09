import React from 'react';
import OperatorTable from '@/pages/OperatorTable';
import { getOperatorData } from '@/lib/LiveConfig';
import { redirect } from 'next/navigation';

interface GamesPageProps {
    searchParams: {
        name?: string;
    };
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
    const params =  await searchParams;
    const operatorType = params?.name || 'game1';
    const OperatorData = getOperatorData(operatorType);

    // If invalid game type, redirect to magic-portal
    if (!OperatorData) {
        redirect('/operator?name=game2');
    }



    return (
        <div className="h-full bg-white shadow-lg m-5 pb-2">
            <div className='border-b border-gray-200 p-4'>
                <h1 className="text-3xl font-bold text-gray-800">Live Operator</h1>
            </div>

            {/* Game Table */}
            <OperatorTable OperatorData={OperatorData} />
        </div>
    );
}
