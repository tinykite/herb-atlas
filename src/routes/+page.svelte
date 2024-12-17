<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	import Autocomplete from '../components/Autocomplete.svelte';
	import { statesByAbbreviation, statesByName } from '$lib/stateData';

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
		if (searchQuery in statesByName || searchQuery in statesByAbbreviation) {
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
			if (searchQuery in statesByName) {
				return farms.filter((farm) => farm.State === statesByName[searchQuery]);
			}

			if (searchQuery in statesByAbbreviation) {
				return farms.filter((farm) => farm.State === searchQuery);
			}
		}
	});

	const stringToTitlecase = (string: string) => {
		return string
			.split(' ')
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(' ');
	};
</script>

<div class="wrapper">
	<nav class="nav">
		<h1 class="nav__mark">Local Herbalism Atlas</h1>

		<div class="nav__logoMark">
			<!-- <svg
				class="nav__logo"
				aria-hidden="true"
				viewBox="0 0 28 28"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M14.0022 0C6.26552 0 0 6.26892 0 14C0 21.7311 6.26552 28 14.0022 28C21.7389 28 28 21.7311 28 14C28 6.26892 21.7345 0 14.0022 0ZM13.1834 23.8499L2.30305 12.9712C5.26724 12.1789 8.55543 12.945 10.8804 15.2695C13.2053 17.5941 13.9715 20.8862 13.1834 23.8499ZM14.0022 15.4578L13.5468 14.9106C12.4916 13.733 11.4408 12.5335 10.3856 11.3077C10.0441 10.9093 9.70258 10.5153 9.36982 10.1213C9.19031 9.91995 8.06943 8.60225 8.36278 6.83802C8.41532 6.51407 8.62987 5.192 9.78139 4.51345C10.9636 3.81739 12.4391 4.23327 13.2973 4.86804C13.6256 5.10882 13.8533 5.37148 14.0022 5.57286C14.1467 5.37148 14.3744 5.10882 14.7027 4.86804C15.5609 4.23327 17.0364 3.81739 18.2186 4.51345C19.3701 5.192 19.5847 6.51407 19.6372 6.83802C19.9306 8.60225 18.8097 9.91995 18.6302 10.1213C18.2974 10.5153 17.9559 10.9093 17.6144 11.3077C16.5636 12.5335 15.5084 13.733 14.4532 14.9106L14.0022 15.4578ZM14.8166 23.8499C14.0285 20.8862 14.7947 17.5941 17.1196 15.2695C19.4446 12.945 22.7328 12.1789 25.697 12.9712L14.8166 23.8499Z"
					fill="currentColor"
				/>
			</svg> -->
		</div>

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

		{#if !filteredResults}
			<p class="info__description">
				Sorry, Herbalism Atlas currently doesn't have any farms in <em>{searchQuery}</em>.
			</p>
			<p class="info__description">
				Browse
				<a href="/">all locations</a>
			</p>
		{:else if filteredResults?.length === 1}
			<p>1 location</p>
		{:else}
			<p>{filteredResults.length} locations</p>
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
		padding-inline: 1.5rem;
		height: fit-content;
		color: #175a06;
		background: linear-gradient(45deg, #f7fff2, #baff95);
		box-shadow:
			0 95px 328px 0 rgba(0, 0, 0, 0.02),
			0 22px 74px 0 rgba(0, 0, 0, 0.04),
			0 6px 22px 0 rgba(0, 0, 0, 0.08);
	}

	.nav__logoMark {
		display: grid;
		grid-template-columns: 24px 1fr;
		align-items: center;
		gap: 0.5rem;
	}

	.nav__mark {
		font-family: 'swear-display-cilati', sans-serif;
		font-weight: 600;
		font-style: normal;
		font-size: 2.25rem;
	}

	.info {
		grid-column: 1 / 4;
		margin-block: 2rem;
		margin-inline-start: 1.5rem;
		color: #123722;
		background: #fefaef;
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
		font-weight: 700;
		font-style: normal;
		font-size: 1.25rem;
	}

	.info__description {
		margin-block-start: 1rem;
	}

	.farmList {
		border-top: 1px solid #e8e8e8;
		display: grid;
		column-gap: 2rem;
		row-gap: 1rem;
		/* grid-template-columns: 1fr 1fr; */
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
	}

	.farmList__text {
		margin-block-start: 0.5rem;
	}

	.wrapper {
		display: grid;
	}
</style>
