import type { PageLoad } from './$types';
import { json, error } from '@sveltejs/kit';
import * as d3 from 'd3';

export const load = (async () => {
	let formattedData: any[] = [];
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

	try {
		const data = await d3.csv(csvUrl, (data) => {
			// const farmName = d3.csvParse(data.Farm);
			// formattedData.push(farmName);
			formattedData.push(data);
		});
		console.log(formattedData);
	} catch (error) {
		console.error('Error fetching or parsing CSV data:', error);
	}

	return { formattedData }

}) satisfies PageLoad;
