import React from 'react';

type ErrorState = {
    shareCode?: string;
    templateId?: string;
    routeName?: string;
    playingTime?: string;
};


interface RouteSharedInputProps {
    shareCode: string;
    setShareCode: (code: string) => void;
    errors: { shareCode?: string };
    setErrors: React.Dispatch<React.SetStateAction<ErrorState>>;
}

const RouteSharedInput: React.FC<RouteSharedInputProps> = ({
    shareCode,
    setShareCode,
    errors,
    setErrors,
}) => (
    <div>
        <h4 className="font-bold mb-10">Route Details</h4>
        <div className="flex flex-col justify-start items-center gap-10">
            <div className='flex max-md:flex-col w-full'>
                <h4 className="font-medium mb-3 w-64">Input Share Code<span className='text-red-600'>*</span>:</h4>
                <div className='flex-1'>
                    <input placeholder="Share Code" required value={shareCode} onChange={(e) => { setShareCode(e.target.value); setErrors((prev: ErrorState) => ({ ...prev, shareCode: undefined })); }} className="border px-3 py-1.5 w-full text-[13px] focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200 rounded" />
                    {errors.shareCode && <div className="text-sm block text-red-600 mt-1">{errors.shareCode}</div>}
                    <p className='text-[9.5px] mt-1 font-semibold'>Enter a name for your Route, this can be changed easily later as well</p>
                </div>
            </div>
        </div>
    </div>
);

export default RouteSharedInput;
