import type { PageLoad } from './$types';
import * as d3 from 'd3';

export const load = (async () => {
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';
	try {
		const cityStateGeocodes = new Map()
		const farms = await d3.csv(csvUrl, (d) => {
			if (!cityStateGeocodes.has(d.CityState)) {
				cityStateGeocodes.set(d.CityState, [d.Longitude, d.Latitude])
			}
			return d
		})
		return { farms, cityStateGeocodes }
	} catch (error) {
		console.error('Error fetching or parsing CSV data:', error);
	}


}) satisfies PageLoad;
