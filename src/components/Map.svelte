<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { PUBLIC_MAP_TILE_URL } from '$env/static/public';
	import customLayers from '$lib/testTheme';
	import { goto } from '$app/navigation';
	import { svgStringToImageSrc } from '$lib/utilities';
	import { markerIcon } from '$lib/marker';

	const { Map } = maplibregl;
	interface Props {
		center: Array<Number>;
		zoom: Number;
		geoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
	}

	/* DEBUG ONLY */
	// let infoDiv: HTMLElement;
	let { center, zoom, geoJSON } = $props();
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

			if (lng !== parseFloat(center[0]) || lat !== parseFloat(center[1])) {
				map.flyTo({
					zoom,
					center
				});
			}
		}
	});

	onMount(() => {
		map = new Map({
			container: mapContainer as HTMLElement,
			style: {
				version: 8,
				glyphs: '/fonts/{fontstack}/{range}.pbf',
				sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
				sources: {
					protomaps: {
						type: 'vector',
						tiles: [PUBLIC_MAP_TILE_URL],
						maxzoom: 6,
						attribution:
							'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
					}
				},
				layers: customLayers as maplibregl.LayerSpecification[]
			},
			center,
			zoom,
			maxZoom: 10
		});

		// Create an image from SVG
		const svgImage = new Image(23, 35);
		svgImage.onload = () => {
			map.addImage('svg', svgImage);
		};
		svgImage.src = svgStringToImageSrc(markerIcon);

		map.on('click', 'farms', (e) => {
			const name = e.features[0].properties.name;
			goto(`/?q=${name}&type=farm`);
		});

		map.on('mouseenter', 'farms', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'farms', () => {
			map.getCanvas().style.cursor = '';
		});

		/* DEBUG ONLY */
		// map.on('move', updateInfo);
		// map.on('zoom', updateInfo);
		// updateInfo();

		// map.on('zoom', () => {
		// 	const layers = map.getStyle().layers;
		// 	console.log('hi');
		// 	console.log(layers);
		// });

		map.on('load', async () => {
			mapContainer?.style.setProperty('opacity', 1);
			map.addSource('locations', {
				type: 'geojson',
				data: geoJSON
			});
			map.addLayer({
				id: 'farms',
				type: 'symbol',
				source: 'locations',
				layout: {
					'icon-anchor': 'top',
					'icon-image': 'svg', // Using a built-in icon (you can choose other symbols)
					'icon-size': 0.85, // Size of the icon
					'icon-allow-overlap': true // Allow icon to overlap with other features
				}
			});
		});
	});

	/* DEBUG ONLY */
	// const updateInfo = () => {
	// 	const center = map.getCenter();
	// 	const zoom = map.getZoom();
	// 	infoDiv.textContent = `Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(
	// 		4
	// 	)}, Zoom: ${zoom.toFixed(2)}`;
	// };
</script>

<div class="map">
	<div class="map__graphic" bind:this={mapContainer}></div>
</div>

<!-- 
<div class="mapInfo" bind:this={infoDiv} /> -->

<div class="mapInfo"></div>

<style>
	.map {
		position: fixed;
		height: 100%;
		width: 100%;
	}
	.map__graphic {
		height: 100vh;
		opacity: 0;
		transition: 0.3s ease;
	}

	.mapInfo {
		position: absolute;
		z-index: 1000000;
		background: white;
	}

	:global(.maplibregl-popup-content) {
		display: grid;
		grid-template-columns: 1fr 0.5rem;
		align-items: center;
		padding-block-start: 1.25rem;
	}

	:global(.marker__popup) {
		font-family: 'franklin-gothic-urw', sans-serif;
		font-weight: 500;
		font-style: normal;
	}

	:global(.marker__heading) {
		font-weight: 500;
		font-style: normal;
	}
</style>
