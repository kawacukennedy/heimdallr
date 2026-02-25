'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function FpsCounter() {
    const [fps, setFps] = useState(60);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        let animationId: number;

        const measure = () => {
            frameCountRef.current++;
            const now = performance.now();
            const elapsed = now - lastTimeRef.current;

            if (elapsed >= 1000) {
                setFps(Math.round((frameCountRef.current * 1000) / elapsed));
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            animationId = requestAnimationFrame(measure);
        };

        animationId = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const color =
        fps >= 50 ? 'text-success' : fps >= 30 ? 'text-warning' : 'text-danger';

    return (
        <div className={`font-mono text-xs ${color}`}>
            {fps} FPS
        </div>
    );
}
