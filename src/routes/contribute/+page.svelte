<script>
	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
</script>

<Nav hideSearch={true} />
<main class="main">
	<h1>Contribute</h1>
	<p>
		Anyone is welcome to <a
			href="https://docs.google.com/forms/d/e/1FAIpQLSe9M3cPNsPAWdqSbASt-eMfCddZspQhYPdB1XRocxvQDnLD5g/viewform?usp=sharing"
			>suggest a farm</a
		> to add to the map. Farm submissions will be reviewed before being added. Each farm submitted should
		be committed to sustainable and generative farming practices.
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
