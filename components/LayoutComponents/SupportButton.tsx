import React from 'react';

const SupportButton: React.FC = () => {
    return (
        <button className="fixed bottom-4 cursor-pointer right-4 bg-[var(--color-accent)] text-[var(--color-text-light)] px-4 py-2 rounded-full shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-hover)] transition-[var(--transition-normal)] flex items-center space-x-2 z-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
            <span className="font-medium">Support</span>
        </button>
    );
};

export default SupportButton;
