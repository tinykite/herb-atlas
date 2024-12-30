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
		<a href="/" class="nav__link">
			<span class="u-visuallyHidden">Herb Atlas</span>
			<svg
				aria-hidden="true"
				class="nav__logo"
				width="138"
				height="26"
				viewBox="0 0 138 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M1.79691 14L-8.35262e-07 11L20 11L20 14L1.79691 14Z" fill="#397740" />
				<path d="M136.203 14L138 11L118 11L118 14L136.203 14Z" fill="#397740" />
				<path
					d="M6.88601 7.40833L13 12.9759L6.91813 18.5749C4.90036 20.4139 2.98255 20.2738 1.47256 19.2771C-0.098993 18.2433 -0.181096 16.2556 0.229419 14.9988C0.553369 14.0069 1.22804 13.3265 1.61535 13.0064C1.22626 12.6881 0.547122 12.0116 0.217817 11.0216C-0.199837 9.76761 -0.128443 7.77899 1.43598 6.73465C2.9406 5.73034 4.85753 5.57979 6.88511 7.40833L6.88601 7.40833Z"
					fill="#397740"
				/>
				<path
					d="M131.114 7.40833L125 12.9759L131.082 18.5749C133.1 20.4139 135.017 20.2738 136.527 19.2771C138.099 18.2433 138.181 16.2556 137.771 14.9988C137.447 14.0069 136.772 13.3265 136.385 13.0064C136.774 12.6881 137.453 12.0116 137.782 11.0216C138.2 9.76761 138.128 7.77899 136.564 6.73465C135.059 5.73034 133.142 5.57979 131.115 7.40833L131.114 7.40833Z"
					fill="#397740"
				/>
				<path
					d="M18.6924 6.88601L13.5233 13L13.5233 12.9991L13.5215 13L8.32314 6.91813C6.61571 4.90036 6.74576 2.98255 7.67113 1.47257C8.63277 -0.0989926 10.4782 -0.181095 11.6451 0.22942C12.5661 0.55337 13.1977 1.22804 13.495 1.61535C13.7904 1.22626 14.4186 0.547122 15.3377 0.217818C16.502 -0.199836 18.3483 -0.128443 19.3179 1.43598C20.2504 2.9406 20.3901 4.85753 18.6924 6.88511L18.6924 6.88601Z"
					fill="#397740"
				/>
				<path
					d="M119.308 6.88601L124.477 13L124.477 12.9991L124.478 13L129.677 6.91813C131.384 4.90036 131.254 2.98255 130.329 1.47257C129.367 -0.0989926 127.522 -0.181095 126.355 0.22942C125.434 0.55337 124.802 1.22804 124.505 1.61535C124.21 1.22626 123.581 0.547122 122.662 0.217818C121.498 -0.199836 119.652 -0.128443 118.682 1.43598C117.75 2.9406 117.61 4.85753 119.308 6.88511L119.308 6.88601Z"
					fill="#397740"
				/>
				<path
					d="M18.6924 19.114L13.5233 13L13.5233 13.0009L13.5215 13L8.32314 19.0819C6.61571 21.0996 6.74576 23.0175 7.67113 24.5274C8.63277 26.099 10.4782 26.1811 11.6451 25.7706C12.5661 25.4466 13.1977 24.772 13.495 24.3846C13.7904 24.7737 14.4186 25.4529 15.3377 25.7822C16.502 26.1998 18.3483 26.1284 19.3179 24.564C20.2504 23.0594 20.3901 21.1425 18.6924 19.1149L18.6924 19.114Z"
					fill="#397740"
				/>
				<path
					d="M119.308 19.114L124.477 13L124.477 13.0009L124.478 13L129.677 19.0819C131.384 21.0996 131.254 23.0175 130.329 24.5274C129.367 26.099 127.522 26.1811 126.355 25.7706C125.434 25.4466 124.802 24.772 124.505 24.3846C124.21 24.7737 123.581 25.4529 122.662 25.7822C121.498 26.1998 119.652 26.1284 118.682 24.564C117.75 23.0594 117.61 21.1425 119.308 19.1149L119.308 19.114Z"
					fill="#397740"
				/>
				<path
					d="M114.158 5.86399V10.312H110.606V5.512C110.606 4.55199 110.35 3.976 109.742 3.976C109.134 3.976 108.91 4.55199 108.91 5.512V8.424C108.91 9.736 109.326 10.184 110.286 11.112L112.11 12.776C113.678 14.28 114.222 15.24 114.222 17.64V20.456C114.222 23.56 112.462 25.256 109.646 25.256C106.798 25.256 105.198 23.56 105.198 20.456V15.912H108.782V20.808C108.782 21.768 109.038 22.344 109.646 22.344C110.254 22.344 110.478 21.768 110.478 20.808V17.736C110.478 16.424 110.19 16.136 109.198 15.24L107.31 13.544C105.934 12.264 105.198 11.144 105.198 8.936V5.86399C105.198 2.75999 106.926 1.064 109.774 1.064C112.622 1.064 114.158 2.75999 114.158 5.86399Z"
					fill="#397740"
				/>
				<path
					d="M97.5697 1.32001H101.986L104.834 25H101.09L100.674 19.848H98.6897L98.2737 25H94.7217L97.5697 1.32001ZM99.3297 11.848L98.9457 16.712H100.418L100.002 11.848L99.7137 7.75201H99.6177L99.3297 11.848Z"
					fill="#397740"
				/>
				<path d="M87.204 25V1.32001H91.012V21.864H94.244V25H87.204Z" fill="#397740" />
				<path
					d="M86.184 4.45601H83.656V25H79.848V4.45601H77.32V1.32001H86.184V4.45601Z"
					fill="#397740"
				/>
				<path
					d="M70.851 1.32001H75.267L78.115 25H74.371L73.955 19.848H71.971L71.555 25H68.003L70.851 1.32001ZM72.611 11.848L72.227 16.712H73.699L73.283 11.848L72.995 7.75201H72.899L72.611 11.848Z"
					fill="#397740"
				/>
				<path
					d="M64.3612 16.296V20.552C64.3612 23.4 62.6972 25 59.9772 25H54.9852V1.32001H59.8492C62.5692 1.32001 64.2332 2.92001 64.2332 5.80001V9.86401C64.2332 11.24 63.9452 12.328 62.4412 13.064C63.9452 13.832 64.3612 14.92 64.3612 16.296ZM60.4252 10.024V5.80001C60.4252 4.74401 60.1692 4.16801 59.5292 4.16801H58.8252V11.624H59.5292C60.1692 11.624 60.4252 11.048 60.4252 10.024ZM60.5532 20.52V16.072C60.5532 15.048 60.2972 14.472 59.6572 14.472H58.8252V22.152H59.6572C60.2972 22.152 60.5532 21.576 60.5532 20.52Z"
					fill="#397740"
				/>
				<path
					d="M49.8345 22.376V16.168C49.8345 15.144 49.5785 14.568 48.9385 14.568H48.1065V25H44.2665V1.32001H49.2585C51.9785 1.32001 53.6425 2.92001 53.6425 5.80001V9.92801C53.6425 11.272 53.2905 12.36 51.7865 13.096C53.2905 13.864 53.6425 14.952 53.6425 16.328V22.376C53.6425 23.24 53.7705 24.136 54.1225 25H50.2825C49.8985 24.232 49.8345 23.208 49.8345 22.376ZM49.8345 10.088V5.80001C49.8345 4.74401 49.5785 4.16801 48.9385 4.16801H48.1065V11.688H48.9385C49.5785 11.688 49.8345 11.112 49.8345 10.088Z"
					fill="#397740"
				/>
				<path
					d="M35.7977 25V1.32001H43.2217V4.45601H39.6057V11.464H42.8377V14.6H39.6057V21.864H43.2217V25H35.7977Z"
					fill="#397740"
				/>
				<path
					d="M30.592 25V14.664H28.544V25H24.704V1.32001H28.544V11.432H30.592V1.32001H34.4V25H30.592Z"
					fill="#397740"
				/>
			</svg>
		</a>

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
		align-items: center;
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

	.nav__logo {
		height: 1.75rem;
		width: auto;
		fill: #397740;
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
		color: #397740;
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
			background: rgba(255, 253, 235, 1);
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
