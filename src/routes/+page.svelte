<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import { statesByName, geocodedStateAbbreviations } from '$lib/stateData';
	import { getQueryType, stringToTitlecase } from '$lib/utilities';
	import { DEFAULT_MAP_CENTER, type Location } from '$lib/map';
	import Locations from '../components/Locations.svelte';

	interface Props {
		data: PageData;
	}

	const getStateQueryType = ({ searchQuery }: { searchQuery: string }) => {
		if (stringToTitlecase(searchQuery) in statesByName) {
			return 'fullName';
		}

		return 'abbreviation';
	};

	const getStateMetadata = ({ searchQuery }: { searchQuery: string }) => {
		const stateQueryType = getStateQueryType({ searchQuery });
		let location: Location = {
			latitude: '0',
			longitude: '0'
		};

		if (stateQueryType === 'fullName') {
			const abbreviation =
				statesByName[stringToTitlecase(searchQuery) as keyof typeof statesByName];
			location =
				geocodedStateAbbreviations[abbreviation as keyof typeof geocodedStateAbbreviations];
		}

		if (stateQueryType === 'abbreviation') {
			location =
				geocodedStateAbbreviations[
					searchQuery.toUpperCase() as keyof typeof geocodedStateAbbreviations
				];
		}

		return {
			center: [location.longitude, location.latitude],
			zoom: location?.zoom ?? 5.5
		};
	};

	let { data }: Props = $props();
	const { farms, cityStatePairs, cityStateGeocodes, farmGeoJSON, farmCoordinatesByName } = data;

	let searchQuery: string | null = $derived(page.url.searchParams.get('q'));
	let type = $derived(page.url.searchParams.get('type'));

	let searchQueryType = $derived.by(() => {
		return getQueryType({ query: searchQuery, type, cityStatePairs });
	});

	let mapMetadata = $derived.by(() => {
		if (cityStateGeocodes && searchQueryType === 'cityState') {
			return {
				center: cityStateGeocodes.get(searchQuery),
				zoom: 8
			};
		}

		if (farmCoordinatesByName && searchQueryType === 'farm') {
			return {
				center: farmCoordinatesByName.get(searchQuery),
				zoom: 8
			};
		}

		if (searchQuery && searchQueryType === 'state') {
			return getStateMetadata({ searchQuery });
		}

		return {
			center: DEFAULT_MAP_CENTER,
			zoom: 3.5
		};
	});
</script>

<Locations {farms} {searchQuery} {searchQueryType} />

<Map geoJSON={farmGeoJSON} center={mapMetadata.center} zoom={mapMetadata.zoom} />
