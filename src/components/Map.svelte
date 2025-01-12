<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, {
		type MapEventType,
		type Map as MapType,
		type LayerSpecification
	} from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { PUBLIC_MAP_TILE_URL } from '$env/static/public';
	import customLayers from '$lib/testTheme';
	import { goto } from '$app/navigation';
	import { svgStringToImageSrc } from '$lib/utilities';
	import { markerIcon } from '$lib/marker';
	import { DEFAULT_MARKER_LAYOUT } from '$lib/mapData';

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

	interface MarkerLayerType {
		map: MapType;
		layerId: string;
		sourceId: string;
		iconImage: string;
		paint: {};
	}

	const addMarkerLayer = ({ map, layerId, sourceId, iconImage, paint }: MarkerLayerType) => {
		map.addLayer({
			id: layerId,
			type: 'symbol',
			source: sourceId,
			layout: getLayout(iconImage) as any,
			paint
		});
	};

	const getLayout = (iconImage: string) => {
		return {
			...DEFAULT_MARKER_LAYOUT,
			'icon-image': iconImage
		};
	};

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

		// Create an image from SVG
		const markerImage = new Image(23, 35);
		markerImage.onload = () => {
			map.addImage('markerImage', markerImage, {
				'text-color': 'green',
				'text-halo-color': 'white',
				'text-halo-width': 1,
				'text-halo-blur': 1,
				'text-opacity': ['interpolate', ['linear'], ['zoom'], 7.9, 0, 8, 1]
			});
		};
		markerImage.src = svgStringToImageSrc(markerIcon);

		map.on('click', 'farms', (e: MapEventType) => {
			const name = e.features[0].properties.name;
			goto(`/?q=${name}&type=farm`);
		});

		map.on('mouseenter', 'farms', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'farms', () => {
			map.getCanvas().style.cursor = '';
		});

		map.on('load', async () => {
			mapContainer?.style.setProperty('opacity', 1);
			map.addSource('locations', {
				type: 'geojson',
				data: geoJSON
			});

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
