import React, { useEffect, useState } from "react";
import { ViewState } from "react-map-gl";
import { MapContainer } from "./components/map/MapContainer";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import { useAnimationFrame, useSpring, useSyncedInterval } from "pat-web-utils";
import { useIsMobile } from "./useIsMobile";
import { useClickAnyWhere } from "usehooks-ts";
import { useSearchParamState } from "./useSearchParamState";
import FullScreenButton from "./components/buttons/FullScreenButton";
import ShareButton from "./components/buttons/ShareButton";
import ToggleButton from "./components/buttons/ToggleButton";

const styles = {
    Satellite: "mapbox://styles/paricdil/cl6ie0wc9001q15nzmfsmwj80",
    Transportation: "mapbox://styles/paricdil/cljem5ocn001801qu6tjd7gid",
    Streets: "mapbox://styles/mapbox/streets-v12",
    Traffic: "mapbox://styles/mapbox/navigation-day-v1",
};

function App() {
    const [styleId, setStyleId] = useSearchParamState<keyof typeof styles>("style", "Satellite");
    const style = styles[styleId];
    const [fullscreen, setFullscreen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [sharedState, setSharedState] = useState<Partial<ViewState>>({});
    const [leftState, setLeftState] = useState<Partial<ViewState>>({});
    const [rightState, setRightState] = useState<Partial<ViewState>>({});

    const [overlayMode, setOverlayMode] = useState(false);

    useEffect(() => {
        const appHeight = () => {
            const doc = document.documentElement;
            doc.style.setProperty("--app-height", `${window.innerHeight}px`);
        };
        window.addEventListener("resize", appHeight);
        appHeight();
    }, []);

    useEffect(() => {
        setSharedState({
            zoom: searchParams.get("zoom") ? parseFloat(searchParams.get("zoom") as string) : 2,
            pitch: searchParams.get("pitch") ? parseFloat(searchParams.get("pitch") as string) : 0,
        });
        setLeftState({
            latitude: searchParams.get("leftLat") ? parseFloat(searchParams.get("leftLat") as string) : 0,
            longitude: searchParams.get("leftLng") ? parseFloat(searchParams.get("leftLng") as string) : 0,
            bearing:
                searchParams.get("leftBearing") ? parseFloat(searchParams.get("leftBearing") as string) : 0,
        });
        setRightState({
            latitude: searchParams.get("rightLat") ? parseFloat(searchParams.get("rightLat") as string) : 0,
            longitude: searchParams.get("rightLng") ? parseFloat(searchParams.get("rightLng") as string) : 0,
            bearing:
                searchParams.get("rightBearing") ? parseFloat(searchParams.get("rightBearing") as string) : 0,
        });

        if (!searchParams.has("leftLat") && !searchParams.has("leftLng")) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    setLeftState({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        bearing: 0,
                    });
                    setRightState({
                        // NYC
                        latitude: 40.7128,
                        longitude: -74.006,
                        bearing: 0,
                    });
                    setSharedState((prev) => ({ ...prev, zoom: 10 }));
                },
                console.warn,
                {
                    maximumAge: Infinity,
                }
            );
        }
    }, []);

    useSyncedInterval(() => {
        if (typeof sharedState.zoom === "number") {
            searchParams.set("zoom", `${sharedState.zoom?.toFixed(1)}`);
        }
        if (sharedState.pitch) {
            searchParams.set("pitch", `${sharedState.pitch?.toFixed(0)}`);
        } else {
            searchParams.delete("pitch");
        }

        if (typeof leftState.latitude === "number") {
            searchParams.set("leftLat", `${leftState.latitude?.toFixed(3)}`);
        }
        if (typeof leftState.longitude === "number") {
            searchParams.set("leftLng", `${leftState.longitude?.toFixed(3)}`);
        }
        if (leftState.bearing) {
            searchParams.set("leftBearing", `${leftState.bearing?.toFixed(0)}`);
        } else {
            searchParams.delete("leftBearing");
        }
        if (typeof rightState.latitude === "number") {
            searchParams.set("rightLat", `${rightState.latitude?.toFixed(3)}`);
        }
        if (typeof rightState.longitude === "number") {
            searchParams.set("rightLng", `${rightState.longitude?.toFixed(3)}`);
        }
        if (rightState.bearing) {
            searchParams.set("rightBearing", `${rightState.bearing?.toFixed(0)}`);
        } else {
            searchParams.delete("rightBearing");
        }

        setSearchParams(searchParams);
    }, 250);

    const isMobile = useIsMobile();

    const [goalControlsOpacity, setGoalControlsOpacity] = useState(1);
    const [lastClick, setLastClick] = useState(performance.now());
    useClickAnyWhere(() => {
        setLastClick(performance.now());
    });
    useAnimationFrame(() => {
        if (isMobile) {
            setGoalControlsOpacity(performance.now() - lastClick > 5000 ? 0 : 1);
        } else {
            setGoalControlsOpacity(1);
        }
    });
    useEffect(() => {
        setLastClick(performance.now());
    }, [isMobile]);
    const controlsOpacity = useSpring(goalControlsOpacity, 1, goalControlsOpacity === 0 ? 15 : 1e10);

    return (
        <div className="h-mobile">
            <div
                className={clsx(
                    "absolute bottom-3 left-3 lg:bottom-5 lg:left-5 z-50",
                    "w-1/2 sm:w-64 flex flex-col gap-2"
                )}
            >
                <select
                    className="p-2 rounded-lg bg-white text-gray-800 shadow-sm mapboxgl-ctrl"
                    value={styleId}
                    onChange={(e) => {
                        setStyleId(e.target.value as keyof typeof styles);
                    }}
                >
                    {Object.entries(styles).map(([name, url]) => {
                        return (
                            <option label={name} value={name}>
                                {name}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div
                className={clsx(
                    "controls absolute bottom-3 right-3 lg:bottom-5 lg:right-5 z-50",
                    "flex flex-col gap-2"
                )}
            >
                <ShareButton className="bg-white text-black rounded-md" />

                {document.fullscreenEnabled && (
                    <FullScreenButton
                        fullscreen={fullscreen}
                        setFullscreen={setFullscreen}
                        className="bg-white text-black rounded-md"
                    />
                )}

                <ToggleButton
                    value={overlayMode}
                    setValue={setOverlayMode}
                    className="bg-white text-black rounded-md"
                />
            </div>

            <div
                style={{
                    width: "100vw",
                    height: "var(--app-height)",
                }}
                className={clsx(
                    {
                        "grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2": !overlayMode,
                        "absolute top-0 left-0 w-full h-full": overlayMode,
                    },
                    "bg-black p-2 gap-2"
                )}
            >
                <div className={clsx(
                    "rounded-lg overflow-hidden mix-blend-difference",
                    {"absolute top-0 left-0 w-full h-full": overlayMode}
                )}>
                    <MapContainer
                        mapStyle={style}
                        viewState={{
                            ...sharedState,
                            ...leftState,
                        }}
                        onMove={(viewState) => {
                            setSharedState({
                                zoom: viewState.zoom,
                                pitch: viewState.pitch,
                            });
                            setLeftState({
                                latitude: viewState.latitude,
                                longitude: viewState.longitude,
                                bearing: viewState.bearing,
                            });
                        }}
                        controlsPos={isMobile ? "bottom-left" : "top-left"}
                    />
                </div>
                <div className={clsx(
                    "rounded-lg overflow-hidden mix-blend-difference",
                    {"absolute top-0 left-0 w-full h-full": overlayMode}
                )}>
                    <MapContainer
                        mapStyle={style}
                        viewState={{
                            ...sharedState,
                            ...rightState,
                        }}
                        onMove={(viewState) => {
                            setSharedState({
                                zoom: viewState.zoom,
                                pitch: viewState.pitch,
                            });
                            setRightState({
                                latitude: viewState.latitude,
                                longitude: viewState.longitude,
                                bearing: viewState.bearing,
                            });
                        }}
                        controlsPos={isMobile ? "top-left" : "top-left"}
                    />
                </div>
            </div>

            <style>{`
                .mapboxgl-ctrl, .controls {
                    ${controlsOpacity >= 0.01 ? `opacity: ${controlsOpacity}` : "display: none"};
                }
        `}</style>
        </div>
    );
}

export default App;
