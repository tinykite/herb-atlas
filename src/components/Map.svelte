<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { layersWithCustomTheme } from 'protomaps-themes-base';
	import { HERBALISM_THEME } from '$lib/herbalismTheme';
	import { PUBLIC_MAP_TILE_URL } from '$env/static/public';

	const { Map, Marker, Popup, LngLat } = maplibregl;

	let { mapPoints, mapCenter } = $props();
	let mapContainer: HTMLElement | null | undefined = $state();
	let map = $state();

	const protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	interface mapPoint {
		Latitude: string;
		Longitude: string;
		Name: string;
		CityState: string;
	}

	$effect(() => {
		if (!!map) {
			const { lat, lng } = map.getCenter();

			if (lng !== parseFloat(mapCenter[0]) || lat !== parseFloat(mapCenter[1])) {
				map.flyTo({
					zoom: 6,
					center: mapCenter
				});
			}
		}
	});

	onMount(() => {
		map = new Map({
			container: mapContainer as HTMLElement,
			style: {
				version: 8,
				glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
				sources: {
					protomaps: {
						type: 'vector',
						tiles: [PUBLIC_MAP_TILE_URL],
						maxzoom: 6,
						attribution:
							'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
					}
				},
				layers: layersWithCustomTheme('protomaps', HERBALISM_THEME, 'en')
			},
			center: mapCenter,
			zoom: 3.5,
			maxZoom: 10
		});

		mapPoints.map((point: mapPoint) => {
			const coords = new LngLat(parseFloat(point.Longitude), parseFloat(point.Latitude));
			const popup = new Popup({ offset: 25 }).setHTML(
				`<div><h3>${point.Name}</h3><p>${point.CityState}</p></div>`
			);
			new Marker({ color: '#743A78', scale: 0.85 }).setLngLat(coords).setPopup(popup).addTo(map);
		});
	});
</script>

<div class="map">
	<div class="map__graphic" bind:this={mapContainer}></div>
</div>

<style>
	.map {
		position: fixed;
		height: 100%;
		width: 100%;
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
