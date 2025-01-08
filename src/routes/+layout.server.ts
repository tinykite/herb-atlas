import type { LayoutServerLoad } from './$types';
import { statesByAbbreviation } from '$lib/stateData';
import type { Farm } from '$lib/mapData';
import * as d3 from 'd3';

export const load: LayoutServerLoad = async () => {
    const csvUrl =
    'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

    try {
        const cityStatePairs = new Set();
        const farmLocations = new Set();
        const cityStateGeocodes = new Map();

        // Fetch and parse CSV, specifying the Farm type for the result
        const farms = await d3.csv(csvUrl, (d): Farm => {
            const { CityState, State } = d

            if (State === undefined || CityState === undefined) {
                console.log('Missing State or City/State');
            } // TODO: Handle this gracefully

            if (State in statesByAbbreviation) {
                const fullState = statesByAbbreviation[State as keyof typeof statesByAbbreviation];
                farmLocations.add(fullState);
            }

            cityStatePairs.add(CityState);
            farmLocations.add(CityState);

            if (!cityStateGeocodes.has(d.CityState)) {
                cityStateGeocodes.set(d.CityState, [d.Longitude, d.Latitude]);
            }

            return d as unknown as Farm;
        });

        const farmGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: 'FeatureCollection',
            features: farms.map((farm): GeoJSON.Feature => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [farm.Longitude, farm.Latitude],
                    },
                    properties: {
                        name: farm.Name,
                        state: farm.State,
                        city: farm.City,
                        cityState: farm.CityState,
                        url: farm.Url,
                    },
                };
            }),
        };

        return {
            farmGeoJSON,
            farms,
            cityStateGeocodes,
            farmLocations: [...farmLocations],
            cityStatePairs: [...cityStatePairs],
        };
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
};