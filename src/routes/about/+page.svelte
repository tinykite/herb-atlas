<script>
	import { DEFAULT_MAP_ZOOM } from '$lib/mapData';

	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';

	const mapCenter = [-96.7431, 78.567];
</script>

<main class="main">
	<h1 class="main__title">About</h1>
	<p class="main__text">
		I started Herb Atlas out of a desire to better visualize for myself how to practice more
		sustainable, bioregional herbalism — a term with roots in the bioregionalism movement and the
		activism of environmentalist Peter Berg.
	</p>
	<p class="main__text">
		I wanted to make it easy for myself, and others, to discover farms growing and selling plants
		that are weedy, abundant, or otherwise well-adapted to a region closer to their home. In the
		process, I'm hoping it also serves as a way to learn about and support sustainable practices
		like <a
			href="https://www.climatehubs.usda.gov/hubs/international/topic/no-till-farming-climate-resilience"
			>no-till farming</a
		>, an important strategy for climate resilience.
	</p>

	<p class="main__text">
		By buying from small, human-scale farms, I've additionally gained much more awareness about how
		to assess the quality of dried herbs through their color, taste, and smell — and learned why it
		matters. Which may feel like an obvious benefit — but when I first started buying medicinal
		herbs, I didn't realize there was more to consider than simply whether or not something was
		organic.
	</p>

	<p>
		I didn't realize that it's abnormal for dried herbs to smell like the dusty pages of an old
		book. Or that it's not normal for a floral member of the mint family to taste kind of
		off-puttingly woody.
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
		Herbal Atlas is a project created by Dakota Sexton. Please feel free to <a
			href="mailto:dakota@tinykitelab.com">get in touch</a
		> for more information, or to flag an issue with any of the information provided by the map.
	</p>
</main>

<Map points={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
