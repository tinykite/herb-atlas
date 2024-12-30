<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import Autocomplete from '../components/Autocomplete.svelte';
	import {
		statesByAbbreviation,
		statesByName,
		geocodedStateAbbreviations,
		geocodedStateNames
	} from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';
	import { DEFAULT_MAP_CENTER } from '$lib/mapData';

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

<div class="wrapper">
	<nav class="nav">
		<a href="/" class="nav__link"><h1 class="nav__mark">Herbalism Atlas</h1></a>
		<Autocomplete options={farmLocations} />
	</nav>

	<div class="info">
		<h2 class="info__title">
			{#if searchQuery}
				{searchQuery}
			{:else}
				All Farms
			{/if}
		</h2>

		{#if !filteredResults || filteredResults.length === 0}
			<p class="info__description">
				Sorry, Herbalism Atlas currently doesn't have any farms in <em>{searchQuery}</em>.
			</p>
			<p class="info__description">
				Browse
				<a href="/">all locations</a>
			</p>
		{:else if filteredResults?.length === 1}
			<p class="info__locations">1 location</p>
		{:else}
			<p class="info__locations">{filteredResults.length} locations</p>
		{/if}

		<ul class="farmList">
			{#each filteredResults as farm}
				<li class="farmList__item">
					{#if farm.Url}
						<h3 class="farmList__name">
							<a class="farmList__link" href={`${farm.Url}`}>
								{farm.Name}
							</a>
						</h3>
					{:else}
						<h3 class="farmList__name">
							{farm.Name}
						</h3>
					{/if}
					<div class="locationGroup">
						<svg
							class="locationGroup__icon"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							aria-hidden="true"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
							/><circle cx="12" cy="10" r="3" /></svg
						>
						<p class="locationGroup__text">
							<span class="u-visuallyHidden">Located in</span>
							{farm.CityState}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<Map mapPoints={farms} {mapCenter} />
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
	}

	.nav {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		position: relative;
		z-index: 100;
		padding-block: 1rem;
		padding-inline: 3.375rem;
		height: fit-content;
		color: #385032;
		background: #faf6d4;
		box-shadow:
			0 95px 328px 0 rgba(0, 0, 0, 0.02),
			0 22px 74px 0 rgba(0, 0, 0, 0.04),
			0 6px 22px 0 rgba(0, 0, 0, 0.08);
	}

	.nav__link {
		text-decoration: none;
	}

	.nav__mark {
		font-family: 'abolition', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 2rem;
		color: #397740;
	}

	.info {
		grid-column: 1 / -1;
		max-width: max-content;
		margin-block: 2rem;
		margin-inline: 3.375rem;
		color: #5b561f;
		background: #faf6d4;
		position: relative;
		z-index: 300;
		padding-block: 1.5rem;
		border-radius: 1rem;
		box-shadow:
			0 100px 80px 0 rgba(0, 0, 0, 0.02),
			0 22px 18px 0 rgba(0, 0, 0, 0.04),
			0 6px 5px 0 rgba(0, 0, 0, 0.08);
	}

	.info__title,
	.info__locations {
		padding-inline: 1.5rem;
	}

	.info__title {
		font-family: 'Tiempos Text';
		font-weight: 800;
		font-style: normal;
		font-size: 1.5rem;
	}

	.info__locations {
		font-style: italic;
		margin-block-end: 1rem;
	}

	.farmList {
		border-top: 1px solid #e8e8e8;
		display: grid;
		column-gap: 2rem;
		margin-inline: 0;
		padding-inline: 0;
		list-style-type: none;
	}

	.farmList__item {
		margin: 0;
		padding-inline: 1.5rem;
		padding-block: 1.25rem;
		border-bottom: 1px solid #e8e8e8;
		position: relative;

		&:hover {
			background: #184b35;
			color: #f2f2f2;
		}
	}

	.farmList__name {
		font-family: 'Tiempos Text';
		font-weight: 800;
		font-style: normal;
		font-size: 1rem;
		margin: 0;
		padding: 0;
	}

	.farmList__link {
		text-decoration: none;
		&:after {
			content: '';
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
	}

	.locationGroup {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		margin-block-start: 0.25rem;
	}

	.locationGroup__icon {
		height: 1rem;
		width: auto;
	}

	.locationGroup__text {
		font-size: 1rem;
		line-height: 1;
		font-style: italic;
	}

	.wrapper {
		display: grid;
	}
</style>
