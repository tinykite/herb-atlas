<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import Nav from '../components/Nav.svelte';
	import { statesByAbbreviation, statesByName, geocodedStateAbbreviations } from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
	import Locations from '../components/Locations.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { farms, farmLocations, cityStatePairs, cityStateGeocodes } = data;

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
				zoom: 6
			};
		}

		if (searchQueryType === 'state' && stringToTitlecase(searchQuery) in statesByName) {
			const stateAbbreviation = statesByName[stringToTitlecase(searchQuery)];
			const metadata = geocodedStateAbbreviations[stateAbbreviation];

			return {
				center: [metadata.longitude, metadata.latitude],
				zoom: metadata?.zoom ?? 6
			};
		}

		if (searchQueryType === 'state' && searchQuery.toUpperCase() in statesByAbbreviation) {
			const metadata = geocodedStateAbbreviations[searchQuery.toUpperCase()];
			return {
				mapCenter: [metadata.longitude, metadata.latitude],
				zoom: metadata?.zoom ?? 6
			};
		}
	});
</script>

<Nav {farmLocations} />
<Locations {farms} {searchQuery} {searchQueryType} />

<Map points={farms} center={mapMetadata.center} zoom={mapMetadata.zoom} />
