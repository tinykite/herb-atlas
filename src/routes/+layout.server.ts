import type { LayoutServerLoad } from './$types';
import { statesByAbbreviation } from '$lib/stateData';
import * as d3 from 'd3';

export const load: LayoutServerLoad = async () => {
    const csvUrl =
    'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';
try {
    const cityStatePairs = new Set()
    const farmLocations = new Set()

    const cityStateGeocodes = new Map()
    const farms = await d3.csv(csvUrl, (d) => {
        const {CityState, State} = d

        if (State === undefined || CityState === undefined) {
            console.log('Missing State or City/State')
        } // TODO: Handle this gracefully

        if (Object.hasOwn(statesByAbbreviation, State)) {
            const fullState = statesByAbbreviation[State]
            farmLocations.add(fullState)
        }

        cityStatePairs.add(CityState)
        farmLocations.add(CityState)

        if (!cityStateGeocodes.has(d.CityState)) {
            cityStateGeocodes.set(d.CityState, [d.Longitude, d.Latitude])
        }

        return d
    })
    return { farms, cityStateGeocodes, farmLocations: [...farmLocations], cityStatePairs: [...cityStatePairs]  }
} catch (error) {
    console.error('Error fetching or parsing CSV data:', error);
}
};