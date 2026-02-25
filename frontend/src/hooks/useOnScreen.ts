'use client';
import { useState, useEffect, useRef } from 'react';

export function useOnScreen(options?: IntersectionObserverInit): [React.RefObject<HTMLElement>, boolean] {
    const ref = useRef<HTMLElement>(null);
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return [ref, isIntersecting];
}
