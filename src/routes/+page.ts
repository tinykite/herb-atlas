import type { PageLoad } from './$types';
import * as d3 from 'd3';
import { json, error } from '@sveltejs/kit';

export const load = (async () => {
	let farms: any[] = [];
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

	try {
		await d3.csv(csvUrl, (d) => {
			// const farmName = d3.csvParse(data.Farm);
			// formattedData.push(farmName);
			farms.push(d);
		});
		console.log(farms);
	} catch (error) {
		console.error('Error fetching or parsing CSV data:', error);
	}

	return { farms }

}) satisfies PageLoad;
