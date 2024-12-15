import type { Actions } from './$types';
import * as d3 from 'd3';

export async function load() {
	let farms: any[] = [];
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

	try {
		await d3.csv(csvUrl, (d) => {
			// const farmName = d3.csvParse(data.Farm);
			// formattedData.push(farmName);
			farms.push(d);
		});
	} catch (error) {
		console.error('Error fetching or parsing CSV data:', error);
	}

	return { farms }
}

// export const actions = {
// 	default: async ({ request }) => {
// 		const data = await request.formData();
// 		console.log(data)


// 	}
// } satisfies Actions;