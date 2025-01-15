<script>
	import { DEFAULT_MAP_ZOOM } from '$lib/map';
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
		to make that a little easier.
	</p>

	<h2 class="main__subheading">Land Acknowledgment</h2>
	<p>
		This website was created in Minneapolis, in Mni Sóta Makoce. As the <a
			href="https://nativegov.org/about/our-land-acknowledgement-statement/"
			>Native Governance Center</a
		>
		so well describes,
	</p>
	<blockquote>
		"Mni Sota Makoce (Minnesota) is the homeland of the Dakota people. The Dakota have lived here
		for many thousands of years. Anishinaabe people reside here, too, and reached their current
		homelands after following the megis shell to the food that grows on water (manoomin, or wild
		rice). Indigenous people from other Native nations also reside in Minnesota and have made
		innumerable contributions to our region."
	</blockquote>

	<p>
		It feels important to consider the past, present, and future of the land I occupy, but I
		understand that acknowledgment alone is not enough — it is only a starting place. As <a
			href="https://www.queeringthemap.com">Queering the Map</a
		>
		puts it (emphasis mine), "It is pertinent that we continuously reflect <em>and act</em>
		on the ways in which LGBTQIA+ life is complicit in ongoing processes of settler-colonialism."
	</p>

	<p>
		<a href="https://native-land.ca">Native Land Digital</a> maintains an interactive map as a public
		space where "non-Indigenous people can be invited and challenged to learn more about the lands they
		inhabit, the history of those lands, and how to actively be part of a better future going forward
		together."
	</p>
	<h2 class="main__subheading">Contact</h2>
	<p class="main__text">
		Herb Atlas is a project created by Dakota Sexton. Please feel free to <a
			href="mailto:dakota@tinykitelab.com">get in touch</a
		> for more information, or to flag an issue with any of the information provided by the map.
	</p>
</main>

<Map geoJSON={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
