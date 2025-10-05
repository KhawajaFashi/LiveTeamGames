import React, { Suspense } from 'react';
import RouteSettings from './components/RouteSettings';



export default function AddRoutePage() {
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouteSettings />
        </Suspense>
    );
}
