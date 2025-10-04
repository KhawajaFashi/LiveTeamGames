"use client";
import React, { Suspense } from 'react';
import NewRouteCompo from './components/NewRoute';

const NewRoutePage: React.FC = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewRouteCompo/>
        </Suspense>
    );
};

export default NewRoutePage;
