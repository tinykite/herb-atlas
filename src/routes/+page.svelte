<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let formattedData = [];
	const csvUrl =
		'https://docs.google.com/spreadsheets/d/1hgFHSzxmGEZ0oiJLnalemEr6vp_nHd15m-jc5EH2ahY/gviz/tq?tqx=out:csv';

	const fetchData = async () => {
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
	};

	onMount(() => {
		fetchData();
	});
</script>
