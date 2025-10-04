"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton: React.FC = () => {
    const router = useRouter();
    return (
        <button onClick={() => router.back()} className="px-5 py-1 flex items-center justify-center gap-2 border-1 border-gray-200 font-medium rounded hover:bg-sky-400 cursor-pointer hover:text-white transition-all duration-300 m-6">
            <FaArrowLeft /> <span>
                Back
            </span>
        </button>
    );
};

export default BackButton;
