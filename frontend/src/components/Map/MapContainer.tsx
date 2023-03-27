import React, {Ref, useEffect, useRef, useState} from "react";
import Map, {MapRef, NavigationControl, ViewState} from "react-map-gl";
import {mapboxToken} from "../../config";
import GeocoderControl from "./GeoCoder";

const degToRad = (deg: number) => (deg * Math.PI) / 180.0;

export function MapContainer({viewState, onMove, mapStyle, mapRef}: {
    viewState: Partial<ViewState>,
    onMove: (v: ViewState) => void,
    mapStyle: string,
    mapRef?: Ref<MapRef>
}) {
    const [size, setSize] = useState([600, 600]);
    const containerRef = useRef<HTMLDivElement>(null);
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

    const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

    const transformZoom = (view: ViewState, invert: boolean) => {
        // this takes the zoom of the current view, and returns
        // a new zoom level, which when used at the current view,
        // allows distances to match that of the original zoom level at the equator.
        // setting "invert" to true causes this to be done in reverse.
        // this allows us to match distances on two maps that are currently at different latitudes.

        // if (!invert) console.log(view.zoom);

        // if (view.zoom < 6) return view.zoom;

        let factor = 1 / Math.cos(degToRad(view.latitude || 0));
        if (invert) factor = 1 / factor;

        // interpolate the factor to 1 if zoom level is between 5 and 6,
        // these are the zoom levels where map transitions from globe to mercator
        let alpha = (clamp(view.zoom, 5.5, 6.5) - 5.5) / (6.5-5.5);
        factor = (factor - 1) * alpha + 1;

        let diff = Math.log2(factor);
        return (view.zoom || 0) + diff;
    }

    const [myViewState, setMyViewState] = useState<Partial<ViewState>>({
        longitude: 0,
        latitude: 0,
        zoom: 2
    });

    let combinedViewState = {
        ...myViewState,
        ...viewState
    }

    return <div
        ref={containerRef}
        style={{width: "100%", height: "100%"}}
    >
        <Map
            viewState={{
                ...combinedViewState,
                zoom: transformZoom(combinedViewState as ViewState, true),
                width: size[0], height: size[1]
            } as ViewState & { width: number, height: number }}
            onMove={evt => {
                setMyViewState(evt.viewState);

                onMove({
                    ...evt.viewState,
                    zoom: transformZoom(evt.viewState, false)
                });
            }}
            style={{
                width: size[0],
                height: size[1]
            }}
            projection="globe"
            mapStyle={mapStyle}
            mapboxAccessToken={mapboxToken}
            ref={mapRef}
        >
            <GeocoderControl
                mapboxAccessToken={mapboxToken} position="top-right"
            />
            <NavigationControl position="top-right"/>
        </Map>
    </div>
}