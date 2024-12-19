import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import * as d3 from 'd3';

export async function load() {
	let farms: any[] = [];
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

	try {
		await d3.csv(csvUrl, (d) => {
			farms.push(d);
		});
	} catch (error) {
		console.error('Error fetching or parsing CSV data:', error);
	}

	return { farms }
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const location = data.get('location')
		throw redirect(303, `/?q=${location}`);

	}
} satisfies Actions;