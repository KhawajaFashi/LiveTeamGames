"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StepIndicator from '@/app/(root)/games/add-route/components/StepIndicator';
import RouteTypeSelect from './RouteTypeSelect';
import RouteSteps from './RouteSteps';
import { RouteType } from '../types';


const AddRoute = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const game = searchParams?.get('gameID') || 'magic-portal';

    const [routeType, setRouteType] = useState<RouteType>('template');
    const [step, setStep] = useState(1);

    const totalSteps = routeType === 'new' ? 2 : 3; // new = 2 steps, others = 3

    return (
        <div className="min-h-full p-6 w-full">
            <div className="max-w-full mx-auto bg-white shadow rounded-lg">
                <div className='border-b border-gray-200 p-4 px-6'>
                    <h1 className="text-3xl font-bold text-gray-800">Add Routes</h1>
                </div>
                <StepIndicator current={step} total={totalSteps} />

                <div className="mt-6 p-6">
                    {/* Choose route type (only on first step) */}
                    {step === 1 && (
                        <RouteTypeSelect value={routeType} onChange={(v) => setRouteType(v)} />
                    )}

                    <RouteSteps
                        step={step}
                        totalSteps={totalSteps}
                        routeType={routeType}
                        gameId={game}
                        onNext={() => setStep((s) => Math.min(s + 1, totalSteps))}
                        onBack={() => setStep((s) => Math.max(1, s - 1))}
                        onCancel={() => router.push(`/games?name=${game}`)}
                    />
                </div>
            </div>
        </div>
    );
}

export default AddRoute