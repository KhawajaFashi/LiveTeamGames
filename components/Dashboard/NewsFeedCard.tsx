import React from 'react';
import Link from 'next/link';

const NewsFeedCard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">News Feed</h2>

            <ul className="space-y-3">
                <li>
                    <Link href="#" className="text-[#00adee] underline text-sm block">
                        Live Team Games App-Update
                    </Link>
                </li>
                <li>
                    <Link href="#" className="text-[#00adee] underline text-sm block">
                        Beta Release new Customizer Tool
                    </Link>
                </li>
                <li>
                    <Link href="#" className="text-[#00adee] underline text-sm block">
                        Live Team Games PRO Launch
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default NewsFeedCard;
