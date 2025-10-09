import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#F8F9FA] border-t border-gray-200 px-6 py-4 relative bottom-0 w-full">
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                    <span>Powered by 
                        <Link
                            href="#"
                            className="text-blue-600 hover:text-blue-800 font-medium pl-1"
                        >
                            LiveTeamGames
                        </Link></span>
                    <span>|</span>
                    <Link
                        href="#"
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Terms and Conditions
                    </Link>
                    <span>|</span>
                    <Link
                        href="#"
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Version 2.0.39 (13)
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
