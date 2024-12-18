<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { layersWithCustomTheme } from 'protomaps-themes-base';
	import { HERBALISM_THEME } from '$lib/herbalismTheme';

	const { Map, Marker, Popup, LngLat } = maplibregl;

	let { mapPoints } = $props();
	let mapContainer: HTMLElement | null | undefined = $state();

	const protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	const TILE_URL = '/planet_z6.pmtiles';

	interface mapPoint {
		Latitude: string;
		Longitude: string;
		Name: string;
		CityState: string;
	}

	onMount(() => {
		const map = new Map({
			container: mapContainer as HTMLElement,
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
				layers: layersWithCustomTheme('protomaps', HERBALISM_THEME, 'en')
			},
			center: [-95.9, 40.9778],
			zoom: 4,
			maxZoom: 10
		});

		mapPoints.map((point: mapPoint) => {
			const coords = new LngLat(parseFloat(point.Longitude), parseFloat(point.Latitude));
			const popup = new Popup({ offset: 25 }).setHTML(
				`<div><h3>${point.Name}</h3><p>${point.CityState}</p></div>`
			);

			new Marker({ color: '#5b561f' }).setLngLat(coords).setPopup(popup).addTo(map);
		});
	});
</script>

<div class="map">
	<div class="map__graphic" bind:this={mapContainer}></div>
</div>

<div class="map__overlay"></div>

<style>
	.map {
		position: fixed;
		height: 100%;
		width: 100%;
		background: #cbf2b6;
	}

	.map__overlay {
		pointer-events: none;
		position: fixed;
		width: 100vw;
		height: 100vh;
		mix-blend-mode: saturation;
	}
	.map__graphic {
		height: 100vh;
	}

	:global(.maplibregl-popup-content) {
		display: grid;
		grid-template-columns: 1fr 0.5rem;
		align-items: center;
		padding-block-start: 1.25rem;
	}
</style>
