import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {useControl} from 'react-map-gl';

import type {MapRef, ControlPosition} from 'react-map-gl';
import {Ref} from "react";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    position?: ControlPosition;

    onCreate?: (evt: { features: object[] }) => void;
    onUpdate?: (evt: { features: object[]; action: string }) => void;
    onDelete?: (evt: { features: object[] }) => void;
};

type DrawProps = DrawControlProps & {
    onDrawLoaded?: (draw: MapboxDraw) => void
}

export default function DrawControl(props: DrawProps) {
    useControl<MapboxDraw>(
        () => {
            const draw = new MapboxDraw(props);
            if (props.onDrawLoaded) props.onDrawLoaded(draw);
            return draw;
        },
        ({map}: { map: MapRef }) => {
            if (props.onCreate) {
                map.on('draw.create', props.onCreate);
            }
            if (props.onUpdate) {
                map.on('draw.update', props.onUpdate);
            }
            if (props.onDelete) {
                map.on('draw.delete', props.onDelete);
            }
        },
        ({map}: { map: MapRef }) => {
            if (props.onCreate) {
                map.off('draw.create', props.onCreate);
            }
            if (props.onUpdate) {
                map.off('draw.update', props.onUpdate);
            }
            if (props.onDelete) {
                map.off('draw.delete', props.onDelete);
            }
        },
        {
            position: props.position
        }
    );

    return null;
}

DrawControl.defaultProps = {
    onCreate: () => {
    },
    onUpdate: () => {
    },
    onDelete: () => {
    }
};