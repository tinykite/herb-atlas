<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, { type Map as MapType, type LayerSpecification } from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { PUBLIC_MAP_TILE_URL } from '$env/static/public';
	import customLayers from '$lib/herbalismThemeAdvanced';
	import { goto } from '$app/navigation';
	import { addMarkerLayer, loadMapImage } from '$lib/map';
	import markerImage from '$lib/assets/marker.png';

	const { Map } = maplibregl;
	interface Props {
		center: Array<Number>;
		zoom: Number;
		geoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
	}

	let { center, zoom, geoJSON } = $props();
	let mapContainer: HTMLElement | null | undefined = $state();
	let map = $state() as MapType;

	const protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

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
				layers: customLayers as LayerSpecification[]
			},
			center,
			zoom,
			maxZoom: 10
		});

		map.on('load', async () => {
			mapContainer?.style.setProperty('opacity', '1');
			map.addSource('locations', {
				type: 'geojson',
				data: geoJSON
			});

			try {
				await loadMapImage({ map, imageUrl: markerImage, imageId: 'markerImage' });
			} catch (error) {
				console.error('Error loading marker images:', error);
			}

			addMarkerLayer({
				map,
				layerId: 'markers',
				sourceId: 'locations',
				iconImage: 'markerImage',
				paint: {
					'text-color': 'green',
					'text-halo-color': 'white',
					'text-halo-width': 1,
					'text-halo-blur': 1,
					'text-opacity': ['interpolate', ['linear'], ['zoom'], 7.9, 0, 8, 1]
				}
			});
		});

		map.on('click', 'markers', (e) => {
			if (e.features && e.features.length) {
				const name = e.features[0].properties.name;
				goto(`/?q=${name}&type=farm`);
			}
		});

		map.on('mouseenter', 'markers', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'markers', () => {
			map.getCanvas().style.cursor = '';
		});
	});
</script>

<div class="map">
	<div class="map__graphic" bind:this={mapContainer}></div>
</div>

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
</style>
