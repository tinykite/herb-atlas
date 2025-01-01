<script>
	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
</script>

<Nav hideSearch={true} />
<main class="main">
	<h1>Tip Jar</h1>
	<p>
		Herb Atlas is a free, single-human endeavor created and maintained by Dakota Sexton. Tips are
		wildly appreciated. You can submit a <a href="https://buy.stripe.com/00g2ay6zI08mcdWfYY"
			>one-time Stripe payment</a
		> to help cover the cost of keeping the site alive.
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
