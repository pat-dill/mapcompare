import clsx from "clsx";
import React from "react";

export default function FullScreenButton({
    fullscreen,
    setFullscreen,
    className,
}: {
    fullscreen: boolean;
    setFullscreen: (v: boolean) => void;
    className?: string;
}) {
    return (
        <button
            className={clsx("p-2 w-10 h-10 flex justify-center items-center", className)}
            onClick={async () => {
                if (fullscreen) {
                    await document.exitFullscreen();
                } else {
                    await document.body.requestFullscreen();
                }

                setFullscreen(!fullscreen);
            }}
        >
            <i
                className={clsx({
                    "fa fa-down-left-and-up-right-to-center": fullscreen,
                    "fa fa-up-right-and-down-left-from-center": !fullscreen,
                })}
            />
        </button>
    );
}
