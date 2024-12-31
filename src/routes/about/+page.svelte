<script>
	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
</script>

<Nav hideSearch={true} />
<main class="main">
	<h1>About</h1>
	<p>
		I started Herb Atlas out of a desire to better visualize for myself how to practice sustainable,
		bioregional herbalism — a term with roots in the bioregionalism movement and the activism of
		environmentalist Peter Berg.
	</p>
	<p>
		As a budding herbalist, I've also often felt surprised and bewildered by the differences between
		herbs I could buy from small organic farms and larger resalers. Which may feel obvious. But the
		differences in smell and taste alone made me wonder if instead of telling what people should buy
		(organic herbs, which are grown worldwide) it'd be easier to help people understand where to buy
		them.
	</p>
	<p>
		Herb Atlas is a project that intends to map out small local farmers — to help individuals better
		prioritize where to find medicinal herbs, and what relationships with local farmers they may be
		able to build.
	</p>
</main>

<Map mapPoints={[]} mapCenter={DEFAULT_MAP_CENTER} />

<style>
	.main {
		grid-column: 1 / -1;
		max-width: 55vw;
		margin-block: 2rem;
		margin-inline: auto;
		color: #397740;
		background: #faf6d4;
		position: relative;
		z-index: 300;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow:
			0 100px 80px 0 rgba(0, 0, 0, 0.02),
			0 22px 18px 0 rgba(0, 0, 0, 0.04),
			0 6px 5px 0 rgba(0, 0, 0, 0.08);
	}

	.main * + * {
		margin-block-start: 0.5rem;
	}
</style>
