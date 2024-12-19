<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import Autocomplete from '../components/Autocomplete.svelte';
	import { statesByAbbreviation, statesByName } from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { farms } = data;

	const farmLocations = farms.reduce((farmLocations, currentFarm) => {
		const currentLocation = currentFarm.CityState;
		const currentState = statesByAbbreviation[currentFarm.State];

		let options = [];

		if (!farmLocations.includes(currentState)) {
			options.push(currentState);
		}

		options.push(currentLocation);

		return [...farmLocations, ...options];
	}, []);

	const cityStatePairs = farms.reduce((farmLocations, currentFarm) => {
		const currentLocation = currentFarm.CityState;

		if (farmLocations.includes(currentLocation)) {
			return farmLocations;
		}

		return [...farmLocations, currentLocation];
	}, []);

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

		if (cityStatePairs.includes(searchQuery)) {
			return 'cityState';
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
					<h3 class="farmList__name">
						{farm.Name}
					</h3>
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
						<p class="locationGroup__text">{farm.CityState}</p>
					</div>

					<!-- <h4 class="farmList__forSale">For Sale</h4> -->
					<!-- <p class="farmList__text">{stringToTitlecase(farm.Categories)}</p> -->
					<!-- 
					<h4 class="farmList__forSale">Order Online</h4> -->
					<!-- {farm['Sells Online']}
					<p>
						{#if farm.Website}<a href={`${farm.website}`}>Website</a>`{/if}
					</p> -->
				</li>
			{/each}
		</ul>
	</div>

	<Map mapPoints={farms} />
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
		grid-column: 1 / 4;
		margin-block: 2rem;
		margin-inline-start: 3.375rem;
		color: #5b561f;
		background: #faf6d4;
		position: relative;
		z-index: 300;
		padding-block-start: 1.25rem;
		padding-inline: 1.5rem;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow:
			0 100px 80px 0 rgba(0, 0, 0, 0.02),
			0 22px 18px 0 rgba(0, 0, 0, 0.04),
			0 6px 5px 0 rgba(0, 0, 0, 0.08);
	}

	.info__title {
		font-family: 'Tiempos Text';
		font-weight: 800;
		font-style: normal;
		font-size: 1.25rem;
	}

	.info__description {
		margin-block-start: 1rem;
	}

	.info__locations {
		font-style: italic;
	}

	.farmList {
		border-top: 1px solid #e8e8e8;
		display: grid;
		column-gap: 2rem;
		row-gap: 1rem;
		margin-block-start: 1rem;
		margin-inline: 0;
		padding-block-start: 1rem;
		padding-inline: 0;
		list-style-type: none;
	}

	.farmList__item {
		padding-block-end: 1.25rem;
		border-bottom: 1px solid #e8e8e8;
	}

	.farmList__name {
		font-family: 'Tiempos Text';
		font-weight: 700;
		font-style: normal;
		font-size: 1rem;
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
