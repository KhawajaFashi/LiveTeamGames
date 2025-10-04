import React, { Suspense } from 'react';
import AddRoute from './components/AddRoute';



export default function AddRoutePage() {
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddRoute/>
        </Suspense>
    );
}
