import { statesByAbbreviation, statesByName } from '$lib/stateData';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import * as d3 from 'd3';

export async function load() {
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
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const location = data.get('location')
		throw redirect(303, `/?q=${location}`);

	}
} satisfies Actions;