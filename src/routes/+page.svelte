<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import Nav from '../components/Nav.svelte';
	import {
		statesByAbbreviation,
		statesByName,
		geocodedStateAbbreviations,
		geocodedStateNames
	} from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';
	import Locations from '../components/Locations.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { farms, farmLocations, cityStatePairs, cityStateGeocodes } = data;

	let searchQuery = $derived($page.url.searchParams.get('q'));

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

	let mapCenter = $derived.by(() => {
		if (!searchQuery || searchQueryType === 'unknown') {
			return DEFAULT_MAP_CENTER;
		}

		if (cityStateGeocodes && searchQueryType === 'cityState') {
			return cityStateGeocodes.get(searchQuery);
		}

		if (searchQueryType === 'state' && stringToTitlecase(searchQuery) in statesByName) {
			const coordinates = geocodedStateNames[stringToTitlecase(searchQuery)];
			return [coordinates.Longitude, coordinates.Latitude];
		}

		if (searchQueryType === 'state' && searchQuery.toUpperCase() in statesByAbbreviation) {
			const coordinates = geocodedStateAbbreviations[searchQuery.toUpperCase()];
			return [coordinates.Longitude, coordinates.Latitude];
		}
	});
</script>

<Nav {farmLocations} />
<Locations {farms} {searchQuery} {searchQueryType} />

<Map mapPoints={farms} {mapCenter} />
