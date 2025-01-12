export const DEFAULT_MAP_CENTER = [-106, 40.9778]
export const DEFAULT_MAP_ZOOM = 3.5
export interface Farm {
    Name: string;
    State: string;
    City: string;
    CityState: string;
    Url: string;
    Longitude: number;
    Latitude: number;
}

export const DEFAULT_MARKER_LAYOUT = {
    'icon-anchor': 'center',
    'icon-size': 0.85,
    'icon-allow-overlap': true,
    'text-font': ['Libre Franklin Medium'],
    'text-size': 13,
    'text-max-width': 20,
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom'],
    'text-variable-anchor-offset': ['bottom', [0, 2.5], 'left', [1, 0]],
    'text-optional': true
};