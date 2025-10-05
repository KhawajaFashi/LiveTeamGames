import React, { useEffect, useRef, useState } from "react";

interface Team {
    no: number;
    teamName: string;
    score: string | number;
}

interface AnimateShowdownProps {
    teams: Team[];
    onClose: () => void;
}

const AnimateShowdown: React.FC<AnimateShowdownProps> = ({ teams, onClose }) => {
    // Prepare sorted teams by score (descending)
    const sortedTeams = [...teams].sort((a, b) => Number(b.score) - Number(a.score));
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 1
    const [animatedScores, setAnimatedScores] = useState<number[]>(sortedTeams.map(t => 0));
    const [winnerIdx, setWinnerIdx] = useState<number | null>(null);

    const duration = 30_000; // 30 seconds
    const interval = 30; // ms
    const maxScore = Math.max(...sortedTeams.map(t => Number(t.score)));

    // Animate scores
    useEffect(() => {
        if (!isAnimating) return;
        let start = Date.now();
        let rafId: number;
        const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            let p = Math.min(elapsed / duration, 1);
            setProgress(p);
            setAnimatedScores(sortedTeams.map(t => Math.round(Number(t.score) * p)));
            if (p < 1) {
                rafId = window.setTimeout(animate, interval);
            } else {
                // Animation done, set winner
                const winner = sortedTeams.reduce((maxIdx, t, idx, arr) => Number(t.score) > Number(arr[maxIdx].score) ? idx : maxIdx, 0);
                setWinnerIdx(winner);
            }
        };
        animate();
        return () => {
            window.clearTimeout(rafId);
        };
        // eslint-disable-next-line
    }, [isAnimating]);

    // Reset animation
    const handleReset = () => {
        setIsAnimating(false);
        setProgress(0);
        setAnimatedScores(sortedTeams.map(t => 0));
        setWinnerIdx(null);
    };

    // Animate button click
    const handleAnimate = () => {
        setIsAnimating(true);
    };

    // Bar colors and icons
    const barColors = ["#8ee6ff", "#2196c9", "#f5a623", "#7ed957", "#ff7f7f", "#b47cff"];
    const winnerIcon = (
        <span className="inline-block ml-2" style={{ fontSize: 28 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#FFD600" /><path d="M14 7l2.09 6.26L22 13.27l-5 3.64L17.18 21 14 17.77 10.82 21 12 16.91l-5-3.64 5.91-.01L14 7z" fill="#fff" /></svg>
        </span>
    );
    const secondIcon = (
        <span className="inline-block ml-2" style={{ fontSize: 28 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#C0C0C0" /><path d="M14 7l2.09 6.26L22 13.27l-5 3.64L17.18 21 14 17.77 10.82 21 12 16.91l-5-3.64 5.91-.01L14 7z" fill="#fff" /></svg>
        </span>
    );

    // Modal design
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
            <div className="absolute inset-0 w-screen h-screen bg-white" style={{ zIndex: 101 }}>
                <div className="flex flex-col w-full h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 pt-6 pb-2 border-b border-gray-100">
                        <h2 className="text-lg font-semibold">Animate Showdown</h2>
                        <button className="text-2xl text-gray-400" onClick={onClose}>&times;</button>
                    </div>
                    <div className="w-full flex justify-end items-start px-8 mt-4">
                        {!isAnimating && progress === 0 && (
                            <button className="bg-[#00A3FF] text-white px-6 py-2 rounded" onClick={handleAnimate}>Animate</button>
                        )}
                        {progress === 1 && (
                            <button className="bg-[#00A3FF] text-white px-6 py-2 rounded" onClick={handleReset}>Reset</button>
                        )}
                    </div>
                    {/* Chart Section */}
                    <div className="flex-1 flex flex-col justify-start items-start pl-8 w-full">
                        <div className="w-full max-w-[1200px] px-8 mt-8">
                            <div className="relative w-full" style={{ minHeight: 180 }}>
                                {/* Y axis labels */}
                                <div className="absolute -left-10 top-10 flex flex-col gap-y-15  h-full justify-center" style={{ width: 80 }}>
                                    {sortedTeams.map((team, idx) => (
                                        <div key={team.no} className="flex items-center gap-4 -mr-9 text-sm">
                                            <span>{idx + 1}</span>
                                            <span>{team.teamName}</span>
                                        </div>
                                    ))}
                                    <div className="mt-2 ml-2">
                                        <svg width="32" height="16" viewBox="0 0 32 16" fill="none"><path d="M2 14C6 6 10 2 16 2C22 2 26 6 30 14" stroke="#C0C0C0" strokeWidth="2" fill="none" /></svg>
                                    </div>
                                </div>
                                {/* Bars */}
                                <div className="ml-[80px] flex flex-col gap-8 h-full justify-center">
                                    {sortedTeams.map((team, idx) => {
                                        const score = animatedScores[idx];
                                        const percent = maxScore ? score / maxScore : 0;
                                        return (
                                            <div key={team.no} className="relative flex items-center h-12">
                                                <div className="rounded-lg h-12 w-full absolute left-0 top-0" />
                                                <div
                                                    className="rounded-lg h-12 flex items-center"
                                                    style={{
                                                        width: `${percent * 100}%`,
                                                        background: barColors[idx % barColors.length],
                                                        transition: isAnimating ? 'width 0.3s linear' : 'none',
                                                    }}
                                                >
                                                    {/* Score and icon */}
                                                    {score > 0 && (
                                                        <span className="absolute right-[-8rem] flex items-center text-lg font-semibold" style={{ minWidth: 80 }}>
                                                            {score.toLocaleString()}
                                                            {winnerIdx === idx && progress === 1 && winnerIcon}
                                                            {winnerIdx !== null && winnerIdx !== idx && idx === 1 && progress === 1 && secondIcon}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* X axis labels */}
                                <div className="absolute left-[80px] bottom-[-32px] flex flex-row w-[calc(100%-80px)] justify-between text-gray-500 text-sm">
                                    {[0, 10_000, 20_000, 30_000, 40_000, 50_000, 60_000, 70_000, 80_000].map(val => (
                                        <span key={val}>{val.toLocaleString()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Animate/Reset Button */}
                        
                    </div>
                </div>
                {/* Support Button */}
            </div>
        </div>
    );
};

export default AnimateShowdown;