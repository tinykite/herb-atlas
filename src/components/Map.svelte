<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, {
		type Map as MapType,
		type LayerSpecification,
		type MapMouseEvent
	} from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { PUBLIC_MAP_TILE_URL } from '$env/static/public';
	import customLayers from '$lib/herbalismThemeAdvanced';
	import { goto } from '$app/navigation';
	import { addMarkerLayer, loadMapImage } from '$lib/map';
	import markerImage from '$lib/assets/marker.png';
	import markerImageHovered from '$lib/assets/markerHovered.png';

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

	let hoveredStateId: string | null;

	const handleHoverEnter = (e: MapMouseEvent) => {
		if (e.features.length > 0) {
			if (hoveredStateId) {
				map.setFeatureState({ source: 'locations', id: hoveredStateId }, { hover: false });
			}
			hoveredStateId = e.features[0].id;
			map.setFeatureState({ source: 'locations', id: hoveredStateId }, { hover: true });
		}
	};

	const handleHoverExit = (e: MapMouseEvent) => {
		if (hoveredStateId) {
			map.setFeatureState({ source: 'locations', id: hoveredStateId }, { hover: false });
		}
		hoveredStateId = null;
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
						attribution:
							'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',

						maxzoom: 6.9
					}
				},
				layers: customLayers as LayerSpecification[]
			},
			center,
			zoom,
			maxZoom: 6.9,
			minZoom: 3.5
		});

		map.on('load', async () => {
			mapContainer?.style.setProperty('opacity', '1');

			if (!!geoJSON && geoJSON?.features?.length) {
				map.addSource('locations', {
					type: 'geojson',
					data: geoJSON,
					generateId: true,
					cluster: true,
					clusterMaxZoom: 5,
					clusterRadius: 50
				});

				try {
					await loadMapImage({ map, imageUrl: markerImage, imageId: 'markerImage' });
					await loadMapImage({ map, imageUrl: markerImageHovered, imageId: 'markerImageHovered' });
				} catch (error) {
					console.error('Error loading marker images:', error);
				}

				map.addLayer({
					id: 'clusters',
					type: 'circle',
					source: 'locations',
					filter: ['has', 'point_count'],
					paint: {
						'circle-color': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							'#002104',
							['step', ['get', 'point_count'], '#ae017e', 3, '#7a0177', 5, '#49006a']
						],
						'circle-radius': ['step', ['get', 'point_count'], 18, 4, 24, 5, 42]
					}
				});

				map.addLayer({
					id: 'cluster-count',
					type: 'symbol',
					source: 'locations',
					filter: ['has', 'point_count'],
					layout: {
						'text-font': ['Libre Franklin Regular'],
						'text-field': '{point_count_abbreviated}',
						'text-size': 12
					},
					paint: {
						'text-color': 'white'
					}
				});
				``;

				addMarkerLayer({
					map,
					layerId: 'labels',
					sourceId: 'locations',
					paint: {
						'text-color': 'green',
						'text-halo-color': 'white',
						'text-halo-width': 1,
						'text-halo-blur': 1,
						'text-opacity': ['interpolate', ['linear'], ['zoom'], 6.8, 0, 6.9, 1]
					}
				});

				addMarkerLayer({
					map,
					layerId: 'markers',
					sourceId: 'locations',
					iconImage: 'markerImage'
				});

				addMarkerLayer({
					map,
					layerId: 'markersHovered',
					sourceId: 'locations',
					iconImage: 'markerImageHovered',
					paint: {
						'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0]
					}
				});
			}
		});

		map.on('click', 'clusters', async (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['clusters']
			});
			const clusterId = features[0].properties.cluster_id;

			const meta = map.getSource('locations') as any;

			if (!meta) {
				return;
			}

			const zoom = await meta.getClusterExpansionZoom(clusterId);
			const coordinates = features[0].geometry?.coordinates;
			map.easeTo({
				center: coordinates,
				zoom
			});
		});

		map.on('click', 'markers', (e) => {
			if (e.features && e.features.length) {
				const name = e.features[0].properties.name;
				goto(`/?q=${name}&type=farm`);
			}
		});

		map.on('mouseenter', 'markers', (e) => {
			map.getCanvas().style.cursor = 'pointer';
			handleHoverEnter(e);
		});

		map.on('mouseleave', 'markers', (e) => {
			map.getCanvas().style.cursor = '';
			handleHoverExit(e);
		});

		map.on('mouseenter', 'clusters', (e) => {
			map.getCanvas().style.cursor = 'pointer';
			handleHoverEnter(e);
		});

		map.on('mouseleave', 'clusters', (e) => {
			map.getCanvas().style.cursor = '';
			handleHoverExit(e);
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

	.mapInfo {
		position: absolute;
		z-index: 300;
		top: 0;
		left: 0;
		background: white;
	}
</style>
