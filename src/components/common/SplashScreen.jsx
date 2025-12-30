import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
    const [isVisible, setIsVisible] = useState(true);
    const [scale, setScale] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start animation sequence
        const scaleTimer = setTimeout(() => setScale(true), 100);

        // Progress bar animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; // Increments to reach 100 in roughly 2-2.5s
            });
        }, 30);

        // Fade out
        const fadeTimer = setTimeout(() => setIsVisible(false), 2500);

        // Finish
        const contentTimer = setTimeout(() => {
            if (onFinish) onFinish();
        }, 3000);

        return () => {
            clearTimeout(scaleTimer);
            clearInterval(interval);
            clearTimeout(fadeTimer);
            clearTimeout(contentTimer);
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-luxury-dark flex flex-col gap-6 items-center justify-center transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className={`transform transition-transform duration-1000 cubic-bezier(0.22, 1, 0.36, 1) ${scale ? 'scale-100' : 'scale-90'} text-center`}>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    <span className="text-white">BAND</span>
                    <span className="text-gold">LINGO</span>
                </h1>

                {/* Progress Bar Container */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto relative">
                    {/* Animated Fill */}
                    <div
                        className="h-full bg-gold transition-all duration-75 ease-out rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Loading Text */}
                <p className="text-ash-grey text-xs tracking-[0.2em] uppercase mt-3 animate-pulse">
                    Loading
                </p>
            </div>
        </div>
    );
}
