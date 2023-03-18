import "./lib/firebase";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import Map, {
    MapRef,
    NavigationControl, ViewState
} from 'react-map-gl';
import {mapboxToken} from "./config";
import GeocoderControl from "./components/Map/GeoCoder";
import {MapContainer} from "./components/Map/MapContainer";
import clsx from "clsx";

function App() {
    const [sharedState, setSharedState] = useState<Partial<ViewState>>({
        zoom: 2
    });

    const globe = <MapContainer
        viewState={sharedState}
        onMove={(viewState) => {
            setSharedState({
                zoom: viewState.zoom,
                bearing: viewState.bearing,
                pitch: viewState.pitch
            })
        }}
    />

    return <div
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
}

export default App
