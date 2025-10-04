"use client";
import React from 'react';
import RouteTable from './RouteTable';
import { useSearchParams } from 'next/navigation';

const NewRouteCompo: React.FC = () => {
    const searchParams = useSearchParams();
    const gameID = searchParams?.get('gameID') || '';
    const routeID = searchParams?.get('routeID') || '';

    // Example: parse game name from gameID
    // You can map gameID to a display name if needed

    return (
        <div className="p-8">
            <RouteTable gameID={gameID} routeID={routeID} />
        </div>
    );
};

export default NewRouteCompo;
