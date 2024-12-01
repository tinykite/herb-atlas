<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import layers from 'protomaps-themes-base';

	const { Map, Marker, Popup, FullscreenControl } = maplibregl;

	let { mapPoints } = $props();
	let mapContainer: HTMLElement | null = $state();

	const protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	const TILE_URL = 'TEST';

	onMount(() => {
		const map = new Map({
			container: mapContainer,
			style: {
				version: 8,
				glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
				sources: {
					protomaps: {
						type: 'vector',
						url: 'pmtiles://' + TILE_URL,
						attribution:
							'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
					}
				},
				layers: layers('protomaps', 'white')
			},
			center: [-93.265, 39.9778],
			zoom: 4,
			maxZoom: 10
		});

		mapPoints.map((point) => {
			const coords = [point.Longitude, point.Latitude];
			const popup = new Popup({ offset: 25 }).setHTML(
				`<div><h3>${point.Name}</h3><p>${point.CityState}</p></div>`
			);

			new Marker({ color: '#FF0000' }).setLngLat(coords).setPopup(popup).addTo(map);
		});

		map.addControl(new FullscreenControl());
	});
</script>

<div class="map" bind:this={mapContainer}></div>

<style>
	.map {
		height: 85vh;
	}

	:global(.maplibregl-popup-content) {
		display: grid;
		grid-template-columns: 1fr 0.5rem;
		align-items: center;
		padding-block-start: 1.25rem;
	}
</style>
