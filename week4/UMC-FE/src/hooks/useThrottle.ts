import { useState, useEffect, useRef } from 'react';

export const useThrottle = <T>(value: T, interval: number = 500): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(Date.now());

    useEffect(() => {
        const now = Date.now();
        const timeRemaining = interval - (now - lastExecuted.current);
        if (timeRemaining <= 0) {
            setThrottledValue(value);
            lastExecuted.current = now;
        } else {
            const timerId = setTimeout(() => {
                setThrottledValue(value);
                lastExecuted.current = Date.now();
            }, timeRemaining);
            return () => clearTimeout(timerId);
        }
    }, [value, interval]);

    return throttledValue;
};