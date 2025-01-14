import { type Map as MapType} from 'maplibre-gl'
export interface Farm {
    Name: string;
    State: string;
    City: string;
    CityState: string;
    Url: string;
    Longitude: number;
    Latitude: number;
}

export interface MarkerLayerType {
    map: MapType;
    layerId: string;
    sourceId: string;
    iconImage?: string;
    paint: object | undefined;
}

interface ImageLayerType {
    map: MapType,
    imageUrl: string,
    imageId: string
}

export const DEFAULT_MAP_CENTER = [-106, 40.9778]
export const DEFAULT_MAP_ZOOM = 3.5

export const DEFAULT_MARKER_LAYOUT = {
    'icon-anchor': 'center',
    'icon-size': 0.85,
    'icon-allow-overlap': true,
};

export const getLayout = ({layerId, iconImage}: {layerId: string, iconImage: string}) => {

    if (layerId === 'markers' || layerId === 'markersHovered') {
        return {
            ...DEFAULT_MARKER_LAYOUT,
            'icon-image': iconImage
        };
    }

    return {
        ...DEFAULT_MARKER_LAYOUT,
        'text-font': ['Libre Franklin Medium'],
        'text-size': 13,
        'text-max-width': 20,
        'text-field': ['get', 'name'],
        'text-variable-anchor': ['bottom'],
        'text-variable-anchor-offset': ['bottom', [0, 2.5], 'left', [1, 0]],
        'text-optional': true,
        'text-allow-overlap': true
    }

};

export const addMarkerLayer = ({ map, layerId, sourceId, iconImage, paint = {} }: MarkerLayerType) => {
    map.addLayer({
        id: layerId,
        type: 'symbol',
        source: sourceId,
        layout: getLayout({layerId, iconImage}),
        paint
    });
};

export const loadMapImage = async ({map, imageUrl, imageId}: ImageLayerType ) => {
    try {
        const image = await map.loadImage(imageUrl);
        map.addImage(imageId, image.data);
      } catch (error) {
        console.error(`Error loading image (${imageUrl}):`, error);
      }
}