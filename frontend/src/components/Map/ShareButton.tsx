import clsx from "clsx";
import React, { useState } from "react";
import { useAnimationFrame } from "pat-web-utils";
import { useCopyToClipboard } from "usehooks-ts";

export default function ShareButton({ url, className }: { url: string; className?: string }) {
    const [copiedAt, setCopiedAt] = useState(0);
    const [showCheck, setShowCheck] = useState(false);
    const [hasShare, setHasShare] = useState(false);
    const [_, copyToClipboard] = useCopyToClipboard();

    useAnimationFrame(() => {
        setShowCheck(performance.now() - copiedAt <= 1000);
        setHasShare(Object.hasOwn(navigator, "share"));
    });

    return (
        <button
            className={clsx("p-2 w-10 h-10 flex justify-center items-center", className)}
            onClick={async () => {
                try {
                    await navigator.share({ url });
                } catch (e) {
                    console.warn(e);
                    await copyToClipboard(url);
                    setCopiedAt(performance.now());
                }
            }}
        >
            <i
                className={clsx({
                    "fa fa-share": !showCheck && hasShare,
                    "fa fa-link": !showCheck && !hasShare,
                    "fa fa-check": showCheck,
                })}
            />
        </button>
    );
}
