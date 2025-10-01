import React from 'react';
import BlackoutCard from '../../../components/BlackoutCard';
import NewsFeedCard from '../../../components/NewsFeedCard';

export default function Dashboard() {
    return (
        <div className="flex flex-col bg-[#f2f3f8] p-6">
            <div className='bg-white rounded-lg shadow-sm mb-6 p-5'>
                <h1 className="text-3xl font-bold text-gray-800 ">Dashboard</h1>
            </div>
            {/* Blackout Card */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <BlackoutCard />
                {/* News Feed Card */}
                <NewsFeedCard />
            </div>
        </div>
    );
}
