"use client";
import React, { useState } from 'react';
import { StepProps } from '../types';
import { TemplateTable, templateArray, TemplateDetail, Template } from '@/lib/routeTemplates';
import RouteTemplateSelect from './RouteTemplateSelect';
import RouteSharedInput from './RouteSharedInput';

const RouteSteps: React.FC<StepProps> = ({ step, totalSteps, routeType, gameId, onNext, onBack, onCancel }) => {
    const [shareCode, setShareCode] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [routeName, setRouteName] = useState('');
    const [playingTime, setPlayingTime] = useState('');
    const [errors, setErrors] = useState<{
        shareCode?: string;
        templateId?: string;
        routeName?: string
        playingTime?: string
    }>({});

    const [showPopup, setShowPopup] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Simple submit handlers for demo—replace with real API calls
    const validateCurrent = () => {
        const nextErrors: typeof errors = {};

        if (step === 2) {
            if (routeType === 'template' && !templateId.trim()) {
                nextErrors.templateId = 'Please select or enter a template id';
            }
            if (routeType === 'shared' && !shareCode.trim()) {
                nextErrors.shareCode = 'Share code is required';
            }
            if (routeType === 'new' && !routeName.trim()) {
                nextErrors.routeName = 'Route name is required';
            }
        }

        if (step === 3) {
            if (!routeName.trim()) {
                nextErrors.routeName = 'Route name is required';
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleContinue = () => {
        const ok = validateCurrent();
        if (!ok) return;

        if (step < totalSteps) {
            // clear step-specific errors when moving on
            setErrors({});
            return onNext();
        }

        // final submit - for now navigate back or log
        console.log({ gameId, routeType, routeName, templateId, shareCode });
        onCancel();
    };

    // Get details for selected template
    const templateDetails: TemplateDetail[] = selectedTemplate ? TemplateTable[selectedTemplate] || [] : [];

    return (
        <div className="mt-6">
            {step === 2 && (
                <div>
                    {routeType === 'template' && (
                        <RouteTemplateSelect
                            templateId={templateId}
                            setTemplateId={setTemplateId}
                            errors={errors}
                            setErrors={setErrors}
                            setSelectedTemplate={setSelectedTemplate}
                            setShowPopup={setShowPopup}
                        />
                    )}
                    {routeType === 'shared' && (
                        <RouteSharedInput
                            shareCode={shareCode}
                            setShareCode={setShareCode}
                            errors={errors}
                            setErrors={setErrors}
                        />
                    )}
                    {routeType === 'new' && (
                        <div >
                            <h4 className="text-lg font-medium mb-3">Choose Language</h4>
                            <select
                                value={templateId || ''}
                                onChange={(e) => { setTemplateId(e.target.value); setErrors(prev => ({ ...prev, templateId: undefined })); }}
                                className="w-full border border-gray-200 px-3 py-2 text-[13px] rounded focus:outline-none focus:ring-1 mb-5 focus:ring-sky-400"
                            >
                                <option value="english">English</option>
                            </select>
                            <h4 className="font-medium mb-10">Route Settings</h4>
                            <div className="flex flex-col justify-start items-center gap-10">
                                <div className='flex md:flex-row flex-col w-full'>
                                    <h4 className="font-medium mb-3 w-64">Route Name<span className='text-red-600'>*</span>:</h4>
                                    <div className='flex-1'>
                                        <input value={routeName} onChange={(e) => { setRouteName(e.target.value); setErrors(prev => ({ ...prev, routeName: undefined })); }} className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                                        {errors.routeName && <div className="text-sm block text-red-600 mt-1">{errors.routeName}</div>}
                                        <p className='text-[9.5px] mt-1 font-semibold'>Enter a name for your Route, this can be changed easily later as well</p>
                                    </div>
                                </div>
                                <div className='flex md:flex-row flex-col w-full'>
                                    <h4 className="font-medium mb-3 w-64">Playing time:</h4>
                                    <div className='flex-1'>
                                        <input value={playingTime} onChange={(e) => { setPlayingTime(e.target.value); setErrors(prev => ({ ...prev, playingTime: undefined })); }} className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                                        <p className='text-[9.5px] mt-1 font-semibold'>Please enter a playing time in minutes; can be changed later.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div>
                    <h4 className="font-medium mb-10">Route Settings</h4>
                    <div className="flex flex-col justify-start items-center gap-10">
                        <div className='flex max-md:flex-col w-full'>
                            <h4 className="font-medium mb-3 w-64">Route Name<span className='text-red-600'>*</span>:</h4>
                            <div className='flex-1'>
                                <input value={routeName} onChange={(e) => { setRouteName(e.target.value); setErrors(prev => ({ ...prev, routeName: undefined })); }} className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                                {errors.routeName && <div className="text-sm block text-red-600 mt-1">{errors.routeName}</div>}
                                <p className='text-[9.5px] mt-1 font-semibold'>Enter a name for your Route, this can be changed easily later as well</p>
                            </div>
                        </div>
                        <div className='flex max-md:flex-col w-full'>
                            <h4 className="font-medium mb-3 w-64">Playing time:</h4>
                            <div className='flex-1'>
                                <input value={playingTime} onChange={(e) => { setPlayingTime(e.target.value); setErrors(prev => ({ ...prev, playingTime: undefined })); }} className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                                <p className='text-[9.5px] mt-1 font-semibold'>Please enter a playing time in minutes; can be changed later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-10 pb-9 mt-20 flex max-md:flex-col max-md:items-start max-md:ml-5 max-md:gap-5 border-t border-gray-300 items-center justify-between">
                <div className="space-x-30 max-md:space-y-5">
                    <button onClick={onCancel} className="px-3 py-1 border-1 border-gray-200 font-medium rounded hover:bg-sky-400 cursor-pointer hover:text-white transition-all duration-300">Cancel</button>
                    {step > 1 && <button onClick={onBack} className="px-5 py-1 border-1 border-gray-200 font-medium rounded hover:bg-sky-400 cursor-pointer hover:text-white transition-all duration-300">← Back</button>}
                </div>

                <div>
                    <button onClick={handleContinue} className="bg-sky-500 text-white font-medium px-4 py-1 md:mr-56 rounded cursor-pointer">Save & Continue →</button>
                </div>
            </div>

            {showPopup && selectedTemplate && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">{templateArray.find((t: Template) => t.id === selectedTemplate)?.title || 'Template Details'}</h3>
                        <table className="w-full text-sm">
                            <thead className="bg-[#000f24] text-white">
                                <tr>
                                    <th className='px-2 py-3 text-center text-sm font-medium'>Stage</th>
                                    <th className='px-2 py-3 text-center text-sm font-medium'>Type</th>
                                    <th className='px-2 py-3 text-center text-sm font-medium'>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templateDetails.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 text-center">{row.stage}</td>
                                        <td className="p-2 text-center">{row.type}</td>
                                        <td className="p-2 text-center">{row.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-sky-500 text-white rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteSteps;

