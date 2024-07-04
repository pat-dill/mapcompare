import { useEffect, useRef } from "react";

export function useSyncedInterval(cb: () => void, intervalMs: number, offsetMs: number = 0) {
    // Hook that runs a callback on an interval. Multiple instances of this
    // hook with the same interval will run in sync.

    const getCounter = () => Math.floor((new Date().valueOf() - offsetMs) / intervalMs);

    const requestRef = useRef<number>();
    const counter = useRef<number>(getCounter());

    const animate = () => {
        const newCount = getCounter();

        if (newCount !== counter.current) {
            try {
                const promise = new Promise<void>(function (resolve) {
                    try {
                        cb();
                    } catch (e) {
                        console.error(e);
                    }
                    resolve();
                });
                promise.then();
            } catch (e) {
                console.error(e);
            }

            counter.current = newCount;
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current as number);
        };
    }, [cb, intervalMs, offsetMs]);
}
