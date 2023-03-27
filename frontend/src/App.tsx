import React, {useRef, useState} from 'react';
import {MapboxMap, MapRef, ViewState} from 'react-map-gl';
import {MapContainer} from "./components/Map/MapContainer";
import clsx from "clsx";

const styles = {
    "Satellite": "mapbox://styles/paricdil/cl6ie0wc9001q15nzmfsmwj80",
    "Streets": "mapbox://styles/mapbox/streets-v12",
    "Traffic": "mapbox://styles/mapbox/navigation-day-v1"
}

function App() {
    const [style, setStyle] = useState(styles["Satellite"]);
    const [fullscreen, setFullscreen] = useState(false);

    const [sharedState, setSharedState] = useState<Partial<ViewState>>({
        zoom: 2
    });

    const globe = <MapContainer
        // mapRef={mapRef}
        mapStyle={style}
        viewState={sharedState}
        onMove={(viewState) => {
            setSharedState({
                zoom: viewState.zoom,
                pitch: viewState.pitch
            })
        }}
    />

    return <div>
        <div className={clsx(
            "absolute bottom-3 left-3 lg:bottom-5 lg:left-5 z-50",
            "w-1/2 lg:w-64 flex flex-col gap-2"
        )}>
            <select
                className="p-2 rounded-lg bg-white text-gray-800 shadow-sm"
                value={style}
                onChange={e => {
                    setStyle(e.target.value);
                }}
            >
                {Object.entries(styles).map(([name, url]) => {
                    return <option label={name} value={url}>
                        {name}
                    </option>
                })}
            </select>
        </div>

        <div className={clsx(
            "absolute bottom-3 right-3 lg:bottom-5 lg:right-5 z-50",
            "hidden md:block"
        )}>
            <button
                className="bg-black/70 p-2 text-white w-10 h-10 flex justify-center items-center"
                onClick={async () => {
                    if (fullscreen) {
                        await document.exitFullscreen();
                    } else {
                        await document.body.requestFullscreen();
                    }

                    setFullscreen(!fullscreen);
                }}
            >
                <i className={clsx({
                    "fa fa-down-left-and-up-right-to-center": fullscreen,
                    "fa fa-up-right-and-down-left-from-center": !fullscreen
                })}/>
            </button>
        </div>

        <div
            style={{
                width: "100vw", height: "100vh"
            }}
            className={clsx(
                "grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2",
                "bg-black p-2 gap-2"
            )}
        >
            <div className="rounded-lg overflow-hidden">
                {globe}
            </div>
            <div className="rounded-lg overflow-hidden">
                {globe}
            </div>
        </div>
    </div>
}

export default App
