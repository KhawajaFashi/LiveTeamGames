"use client";
import React, { useState } from 'react';
import { StepProps } from '../types';
import RouteTemplateSelect from './RouteTemplateSelect';
import RouteSharedInput from './RouteSharedInput';
import api from '@/utils/axios';

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
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

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

    const handleContinue = async () => {
        const ok = validateCurrent();
        if (!ok) return;

        console.log(selectedTemplate);
        if (step < totalSteps) {
            // clear step-specific errors when moving on
            setErrors({});
            return onNext();
        }

        // In the final step, post data to /games/add_route
        try {
            let description: string | undefined = undefined;
            let riddles: string[] = [];

            // If a templateId is provided, fetch templates for this game and find the matching template
            if (templateId) {
                try {
                    const tmplRes = await api.get(`/games/get_template?gameName=${encodeURIComponent(gameId)}`);
                    const templates = tmplRes.data?.data || [];
                    const found = templates.find((t: any) => (t._id === templateId || t.id === templateId));
                    if (found) {
                        description = found.description;
                        riddles = (found.riddles || []).map((r: any) => r._id || r);
                    }
                } catch (err) {
                    console.warn('Failed to fetch templates for templateId lookup, falling back to selectedTemplate', err);
                }
            }

            // If we still have no riddles and a selectedTemplate object exists, use it as fallback
            if ((!riddles || riddles.length === 0) && selectedTemplate) {
                description = description || selectedTemplate.description;
                riddles = selectedTemplate.riddles?.map((r: any) => r._id) || [];
            }

            const routeData: any = {
                gameName: gameId,
                name: routeName,
                playingTime: parseInt(playingTime) || 0,
                templateId: templateId,
                routeType: routeType,
                shareCode: shareCode,
            };

            if (description) routeData.description = description;
            if (riddles && riddles.length) routeData.riddles = riddles;

            console.log("Template ID: ", templateId, ' -> riddles:', riddles.length);

            const response = await api.post('/games/add_route', routeData);

            const data = response.data;

            if (data.success) {
                // Show success message or redirect
                console.log('Route created successfully', data.data, data.adminCode, data.cheatCode);
                onCancel(); // Close the form after successful submission
            } else {
                // Show error in the form
                setErrors({
                    routeName: data.message || 'Failed to create route'
                });
            }
        } catch (error) {
            setErrors({
                routeName: 'Failed to create route. Please try again.'
            });
        }

    };


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
                            gameName={gameId}
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
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-200 p-5 pl-0 pt-0">{selectedTemplate.id}. {selectedTemplate.name || 'Template Details'}</h3>
                        {selectedTemplate.riddles && selectedTemplate.riddles.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-[#000f24] text-white">
                                    <tr>
                                        <th className='px-2 py-3 text-center text-sm font-medium'>Stage</th>
                                        <th className='px-2 py-3 text-center text-sm font-medium'>Type</th>
                                        <th className='px-2 py-3 text-center text-sm font-medium'>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTemplate.riddles.map((r: any, idx: number) => (
                                        <tr key={r._id || idx}>
                                            <td className="p-2 text-center">{r.episode}</td>
                                            <td className="p-2 text-center">{
                                                r.type === 'Augmented Reality' ? 'AR' :
                                                    r.type === 'Location Based Riddle' ? 'LBR' :
                                                        r.type === 'Multiple Choice' ? 'MC' :
                                                            r.type === 'Action Pack' ? 'AP' :
                                                                r.type === 'Mini Game' ? 'MG' :
                                                                    r.type
                                            }</td>
                                            <td className="p-2 text-center">{r.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-gray-500">No riddles in this template.</div>
                        )}
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

