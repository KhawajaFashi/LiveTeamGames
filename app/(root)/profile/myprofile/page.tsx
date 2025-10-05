"use client";
import React, { useState } from "react";

const steps = ["Profile", "Settings", "Team Photos"];

const MyProfile: React.FC = () => {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<{
        OldPassword?: string;
        NewPassword?: string;
        RepeatPassword?: string
    }>({});

    return (
        <div className={`m-6 bg-white rounded-lg shadow-sm mt-8 ${step == 2 ? 'h-full' : ' h-[83vh]'} flex flex-col justify-between`}>
            <div>
                <div className="flex gap-8 mb-8 border-b border-gray-200 pb-0 p-6">
                    {steps.map((label, idx) => (
                        <button
                            key={label}
                            className={`font-semibold text-md pb-4 border-b-2 ${step === idx ? 'border-[#00A3FF] text-[#00A3FF]' : 'border-transparent text-gray-700'}`}
                            onClick={() => setStep(idx)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {step === 0 && (
                    <form className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-7 px-10 text-[13px] text-gray-600">
                        <label className="font-normal text-right self-center">User Name</label>
                        <input value="Demo" readOnly className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                        <label className="font-normal text-right self-center">E-Mail</label>
                        <input type="email" readOnly className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="demoset03@cluetivity.com" />
                        <label className="font-normal text-right self-center">Company Name</label>
                        <input type="text" readOnly className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="DEMO" />
                        <label className="font-normal text-right self-center">Old Password</label>
                        <input type="password" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                        <label className="font-normal text-right self-center">New Password</label>
                        <input type="password" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                        <label className="font-normal text-right self-center">Repeat New Password</label>
                        <input type="password" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                    </form>
                )}
                {step === 1 && (
                    <form className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-7 px-10 text-[13px] text-gray-600">
                        <label className="font-normal text-right self-center">Select Language</label>
                        <select
                            // value={ || ''}
                            // onChange={(e) => { setTemplateId(e.target.value); setErrors(prev => ({ ...prev, templateId: undefined })); }}
                            className="w-full border border-gray-200 px-3 py-2 text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
                        >
                            <option value="english">English</option>
                            <option value="german">German</option>
                        </select>
                        <label className="font-normal text-right self-center">Admin Code</label>
                        <input type="text" className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue="123456789" />
                        <label className="font-normal text-right self-center">Storage Used</label>
                        <input type="text" readOnly className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue={`8.58 MB /15 GB`} />
                        <label className="font-normal text-right self-center">Cluetivity Credits</label>
                        <input type="text" readOnly className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" defaultValue={`50`} />
                    </form>
                )}
                {step === 2 && (
                    <div className="px-16 py-6">
                        
                        <h3 className="font-semibold text-lg mb-4">Tutorial</h3>
                        <div className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-6 mb-10 text-[13px] text-gray-600">
                            <span>Team Photos:</span>
                            <a href="#" className="text-[#00A3FF]">How to automatically send team photos to players</a>
                        </div>
                        <hr className="mb-6 text-gray-200" />
                        <h3 className="font-semibold text-lg mb-4">Email</h3>
                        <form className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-7 text-[13px] text-gray-600">
                            <label className="font-normal text-left self-center">Sender Email Name<span className='text-red-600'>*</span></label>
                            <div>
                                <input className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200" placeholder="Your Company" />
                                <div className="text-xs text-gray-400 mt-1">Enter Email Sender Name</div>
                            </div>
                            <label className="font-normal text-left self-center">Your Reply Email<span className='text-red-600'>*</span></label>
                            <div>
                                <input className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200" placeholder="your@company.com" />
                                <div className="text-xs text-gray-400 mt-1">Please enter your reply email. All replies will be sent to this email address.</div>
                            </div>
                            <label className="font-normal pt-2 text-left">Email Content<span className='text-red-600'>*</span></label>
                            <div>
                                <div className="flex gap-2 mb-2">
                                    <select className="border px-3 py-2 rounded text-[13px] bg-[#00A3FF] focus:outline-none text-white border-gray-200">
                                        <option value="english">English</option>
                                        <option value="german">German</option>
                                    </select>
                                </div>
                                <input className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 mb-2" placeholder="Your Team Photos" />
                                <div className="text-xs text-gray-400 mb-2">Enter your subject line.</div>
                                <div className="border rounded bg-white">
                                    {/* Simple rich text area mockup */}
                                    <div className="flex gap-2 p-2 border-b">
                                        <button type="button" className="px-2 py-1 border rounded text-xs">B</button>
                                        <button type="button" className="px-2 py-1 border rounded text-xs">I</button>
                                        <button type="button" className="px-2 py-1 border rounded text-xs">H</button>
                                        <button type="button" className="px-2 py-1 border rounded text-xs">🖼️</button>
                                        <button type="button" className="px-2 py-1 border rounded text-xs bg-[#00A3FF] text-white">Preview</button>
                                    </div>
                                    <textarea
                                        className="w-full h-32 p-3 text-[13px] border-none focus:outline-none resize-none"
                                        defaultValue={`Hello {PLAYERNAME}!
You and your team **{TEAMNAME}** achieved **{SCORE}** in your previous adventure!`}
                                    />
                                </div>
                            </div>
                        </form>

                        <div className="grid grid-cols-[1fr_3fr] border-b border-gray-300 pb-8 gap-x-10 gap-y-7 text-[13px] text-gray-600 mt-8">
                            <div></div>
                            <div>

                                <div className="font-semibold mb-2">These are the tags that you can use:</div>
                                <ul className="list-disc text-start ml-6 text-[13px] text-gray-700">
                                    <li>{`{TEAMNAME}`} - Will be replaced by the team name</li>
                                    <li>{`{PLAYERNAME}`} - Will be replaced by the Name of the recipient, entered at the end of the game</li>
                                    <li>{`{SCORE}`} - will be replaced by the teams final score</li>
                                    <li>{`{ITEMS}`} - will be replaced by the teams final items count</li>
                                    <li>{`{PLAYINGTIME}`} - will be replaced by the teams playing time (hh:mm:ss)</li>
                                    <li>{`{TEAMVIDEOS}`} - will be replaced by links of videos captures by the team</li>
                                </ul>
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-6 pt-6">Design of team photos</h3>
                        <form className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-6 mb-10 text-[13px] text-gray-600">
                            <label className="font-normal text-left self-center">Add Company Logo:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" />
                            <label className="font-normal text-left self-center">Add Game Logo:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" checked readOnly />
                            <label className="font-normal text-left self-center">Add Playing Time:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" checked readOnly />
                            <label className="font-normal text-left self-center">Add Score:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" checked readOnly />
                            <label className="font-normal text-left self-center">Add Team Name:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" checked readOnly />
                            <label className="font-normal text-left self-center">Add Overlay Frame:</label>
                            <input type="checkbox" className="accent-[#E60050] w-5 h-5" checked readOnly />
                        </form>
                        <hr className="mb-8 text-gray-200" />
                        <h3 className="font-semibold text-lg mb-6">Privacy Policy</h3>
                        <form className="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-6 mb-10 text-[13px] text-gray-600">
                            <label className="font-normal text-left self-center">Your Company Name<span className='text-red-600'>*</span>:</label>
                            <input type="text" className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200" placeholder="Your Company Name" />
                            <label className="font-normal text-left self-center">Add your Privacy Policy<span className='text-red-600'>*</span>:</label>
                            <textarea className="border px-3 py-1.5 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 min-h-[120px]" placeholder="Enter your privacy policy here..." />
                        </form>
                    </div>
                )}
            </div>
            <div className="flex justify-center gap-2 mt-8 p-6 w-full border-t border-gray-200">
                <button className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button className="px-4 py-2 bg-[#00A3FF] text-white rounded">Save</button>
            </div>
        </div>
    );
};

export default MyProfile;
