<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import { statesByAbbreviation, statesByName, geocodedStateAbbreviations } from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
	import Locations from '../components/Locations.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { farms, cityStatePairs, cityStateGeocodes, farmGeoJSON } = data;

	let searchQuery = $derived(page.url.searchParams.get('q'));

	let searchQueryType = $derived.by(() => {
		if (!searchQuery) {
			return;
		}

		if (
			stringToTitlecase(searchQuery) in statesByName ||
			searchQuery.toUpperCase() in statesByAbbreviation
		) {
			return 'state';
		}

		if (cityStatePairs && cityStatePairs.includes(searchQuery)) {
			return 'cityState';
		}

		return 'unknown';
	});

	let mapMetadata = $derived.by(() => {
		if (!searchQuery || searchQueryType === 'unknown') {
			return {
				center: DEFAULT_MAP_CENTER,
				zoom: 3.5
			};
		}

		if (cityStateGeocodes && searchQueryType === 'cityState') {
			return {
				center: cityStateGeocodes.get(searchQuery),
				zoom: 8
			};
		}

		if (searchQueryType === 'state' && stringToTitlecase(searchQuery) in statesByName) {
			const stateAbbreviation = statesByName[stringToTitlecase(searchQuery)];
			const metadata = geocodedStateAbbreviations[stateAbbreviation];

			return {
				center: [metadata.longitude, metadata.latitude],
				zoom: metadata?.zoom ?? 5.5
			};
		}

		if (searchQueryType === 'state' && searchQuery.toUpperCase() in statesByAbbreviation) {
			const metadata = geocodedStateAbbreviations[searchQuery.toUpperCase()];
			return {
				mapCenter: [metadata.longitude, metadata.latitude],
				zoom: metadata?.zoom ?? 5.5
			};
		}
	});

	let filteredResults = $derived.by(() => {
		if (!searchQuery) {
			return farms;
		}

		if (searchQueryType === 'cityState') {
			return farms.filter((farm) => farm.CityState === searchQuery);
		}

		if (searchQueryType === 'state') {
			const titleCaseQuery = stringToTitlecase(searchQuery);
			const upperCaseQuery = searchQuery.toUpperCase();

			if (titleCaseQuery in statesByName) {
				return farms.filter((farm) => farm.State === statesByName[titleCaseQuery]);
			}

			if (upperCaseQuery in statesByAbbreviation) {
				return farms.filter((farm) => farm.State === upperCaseQuery);
			}
		}
	});

	let inactiveFarms = $derived.by(() => {
		return farms?.filter((farm) => !filteredResults?.includes(farm));
	});
</script>

<Locations {farms} {searchQuery} {searchQueryType} />

<Map
	points={filteredResults}
	inactivepoints={inactiveFarms}
	geoJSON={farmGeoJSON}
	center={mapMetadata.center}
	zoom={mapMetadata.zoom}
/>
