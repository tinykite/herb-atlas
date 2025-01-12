<script>
	import { DEFAULT_MAP_ZOOM } from '$lib/mapData';
	import Map from '../../components/Map.svelte';

	const mapCenter = [-96.7431, 78.567];
</script>

<main class="main">
	<h1 class="main__title">About</h1>
	<p class="main__text">
		Herb Atlas is an interactive map that highlights small, human-scale farms growing medicinal
		herbs with a committment to sustainable and regenerative farming practices. The project was
		inspired by a desire to better familiarize myself with bioregionalism herbalism — a term with
		roots in the bioregionalism movement and the activism of environmentalist Peter Berg.
	</p>
	<p class="main__text">
		There are no exact definitions of what bioregional herbalism is or has to be. But quite simply,
		I wanted to make it easy for myself, and others, to discover farms growing and selling plants
		that are weedy, abundant, or otherwise well-adapted to a region closer to their home.
	</p>

	<p>
		In the process, I'm hoping this website also serves as a way to learn about and support farms
		with a committment to sustainable practices that promote climate resilience, such as <a
			href="https://www.climatehubs.usda.gov/hubs/international/topic/no-till-farming-climate-resilience"
			>no-till farming</a
		>. Buying from human-scale farms can additionally teach you to better understand color, smell,
		and taste as key indicators of an herb's quality.
	</p>

	<p>
		Which may all feel obvious — but when I first started buying medicinal herbs, I had no idea
		there was more to consider than simply whether or not something was organic. This project hopes
		to make that just a little easier to understand.
	</p>

	<h2 class="main__subheading">Contribute</h2>
	<p class="main__text">
		Anyone is welcome to <a
			href="https://docs.google.com/forms/d/e/1FAIpQLSe9M3cPNsPAWdqSbASt-eMfCddZspQhYPdB1XRocxvQDnLD5g/viewform?usp=sharing"
			>suggest a farm</a
		> to add to the map. Farm submissions will be reviewed before being added. Each farm submitted should
		be committed to regenerative farming practices.
	</p>

	<h2 class="main__subheading">Contact</h2>
	<p class="main__text">
		Herb Atlas is a project created by Dakota Sexton. Please feel free to <a
			href="mailto:dakota@tinykitelab.com">get in touch</a
		> for more information, or to flag an issue with any of the information provided by the map.
	</p>
</main>

<Map geoJSON={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
