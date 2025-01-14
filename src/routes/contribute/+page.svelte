<script>
	import { DEFAULT_MAP_ZOOM } from '$lib/map';
	import Map from '../../components/Map.svelte';

	const mapCenter = [-96.7431, 78.567];
</script>

<main class="main">
	<h1 class="main__title">Contribute</h1>
	<p class="main__text">
		Anyone is welcome to <a
			href="https://docs.google.com/forms/d/e/1FAIpQLSe9M3cPNsPAWdqSbASt-eMfCddZspQhYPdB1XRocxvQDnLD5g/viewform?usp=sharing"
			>suggest a farm</a
		> to add to the map. Farm submissions will be reviewed before being added. Each farm submitted should
		be committed to regenerative farming practices.
	</p>
</main>

<Map geoJSON={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
