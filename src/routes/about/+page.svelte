<script>
	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';
	import { DEFAULT_MAP_ZOOM } from '$lib/mapData';

	const mapCenter = [-96.7431, 78.567];
</script>

<Nav hideSearch={true} />
<main class="main">
	<h1 class="main__title">About</h1>
	<p class="main__text">
		I started Herb Atlas out of a desire to better visualize for myself how to practice sustainable,
		bioregional herbalism — a term with roots in the bioregionalism movement and the activism of
		environmentalist Peter Berg.
	</p>
	<p class="main__text">
		As a budding herbalist, I've also often felt surprised and bewildered by the differences between
		herbs I could buy from small organic farms and larger resalers. Which may feel obvious. But the
		differences in smell and taste alone made me wonder if instead of telling what people should buy
		(organic herbs, which are grown worldwide) it'd be easier to help people understand where to buy
		them.
	</p>
	<p class="main__text">
		Herb Atlas is a project that intends to map out small local farmers — to help individuals better
		prioritize where to find medicinal herbs, and what relationships with local farmers they may be
		able to build.
	</p>

	<h2 class="main__subheading">Contribute</h2>
	<p class="main__text">
		Anyone is welcome to <a
			href="https://docs.google.com/forms/d/e/1FAIpQLSe9M3cPNsPAWdqSbASt-eMfCddZspQhYPdB1XRocxvQDnLD5g/viewform?usp=sharing"
			>suggest a farm</a
		> to add to the map. Farm submissions will be reviewed before being added. Each farm submitted should
		be committed to sustainable and generative farming practices.
	</p>
</main>

<Map points={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
