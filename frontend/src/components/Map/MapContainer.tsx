import React, {useEffect, useRef, useState} from "react";
import Map, {NavigationControl, ViewState} from "react-map-gl";
import {mapboxToken} from "../../config";
import GeocoderControl from "./GeoCoder";

export function MapContainer({viewState, onMove}: {
    viewState: Partial<ViewState>,
    onMove: (v: ViewState) => void
}) {
    const [size, setSize] = useState([600, 600]);
    const containerRef = useRef<HTMLDivElement>(null);

    const [myViewState, setMyViewState] = useState<Partial<ViewState>>({
        longitude: 0,
        latitude: 0,
        zoom: 2
    });

    const onResize = () => {
        setSize([
            containerRef.current?.offsetWidth || 600,
            containerRef.current?.offsetHeight || 600,
        ])
    }

    useEffect(() => {
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [containerRef.current]);


    return <div
        ref={containerRef}
        style={{width: "100%", height: "100%"}}
    >
        <Map
            viewState={{
                ...myViewState,
                ...viewState,
                width: size[0], height: size[1]
            } as ViewState & {width: number, height: number}}
            onMove={evt => {
                setMyViewState(evt.viewState);
                onMove(evt.viewState);
            }}
            maxZoom={15}
            style={{
                width: size[0],
                height: size[1]
            }}
            projection="globe"
            mapStyle="mapbox://styles/paricdil/cl6ie0wc9001q15nzmfsmwj80"
            mapboxAccessToken={mapboxToken}
        >
            <GeocoderControl mapboxAccessToken={mapboxToken} position="top-right"/>
            <NavigationControl position="top-right"/>
        </Map>
    </div>
}