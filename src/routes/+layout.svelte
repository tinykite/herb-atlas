<script lang="ts">
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
	import '../styles/maplibre.css';
	import type { PageData } from './$types';
	import Nav from '../components/Nav.svelte';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { children, data }: Props = $props();

	const { farms, farmLocations, cityStatePairs, cityStateGeocodes } = data;
</script>

<div class="wrapper">
	<Nav {farmLocations} />
	{@render children?.()}
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
	}
</style>
