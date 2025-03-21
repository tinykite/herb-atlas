<script lang="ts">
	import { statesByAbbreviation, statesByName } from '$lib/stateData';
	import { stringToTitlecase } from '$lib/utilities';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import Return from './Return.svelte';
	import { type DSVParsedArray } from 'd3';
	import { type Farm } from '$lib/map';

	interface Props {
		searchQuery: string | null;
		searchQueryType: string | undefined;
		locations: DSVParsedArray<Farm> | undefined;
	}

	let { searchQuery, searchQueryType, locations }: Props = $props();

	let filteredResults = $derived.by(() => {
		if (!locations) {
			return;
		}

		if (!searchQuery) {
			return locations;
		}

		if (searchQueryType === 'cityState') {
			return locations.filter((location) => location.CityState === searchQuery);
		}

		if (searchQueryType === 'state') {
			const titleCaseQuery = stringToTitlecase(searchQuery);
			const upperCaseQuery = searchQuery.toUpperCase();

			if (titleCaseQuery in statesByName) {
				return locations.filter(
					(location) => location.State === statesByName[titleCaseQuery as keyof typeof statesByName]
				);
			}

			if (upperCaseQuery in statesByAbbreviation) {
				return locations.filter((location) => location.State === upperCaseQuery);
			}
		}

		if (searchQueryType === 'farm') {
			return locations.filter((location) => location.Name === searchQuery);
		}
	});
</script>

{#snippet locationDetail(location: string)}
	<div class="locationMarker">
		<svg
			class="locationMarker__icon"
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
		<p class="locationMarker__text">
			<span class="u-visuallyHidden">Located in</span>
			{location}
		</p>
	</div>
{/snippet}

<div class="locations" transition:fade>
	<div class="locations__introduction">
		<h2 class="locations__title">
			{#if searchQuery}
				{searchQuery}
			{:else}
				All Farms
			{/if}
		</h2>

		{#if searchQueryType === 'farm' && filteredResults}
			{@render locationDetail(filteredResults[0].CityState)}
		{:else if !filteredResults || filteredResults.length === 0}
			<p class="locations__description">
				Sorry, Herbalism Atlas currently doesn't have any farms in <em>{searchQuery}</em>.
			</p>
			<p class="locations__description">
				Browse
				<a href="/">all locations</a>
			</p>
		{:else if filteredResults?.length === 1}
			<p class="locations__count">1 location</p>
		{:else}
			<p class="locations__count">{filteredResults.length} locations</p>
		{/if}
	</div>

	<!-- Locations -->
	{#if (!searchQueryType || searchQueryType !== 'farm') && filteredResults}
		<ul class="locationList">
			{#each filteredResults as location}
				<li class="location location--listItem">
					<h3 class="location__name">
						<a class="location__link" href={`?q=${location.Name}&type=farm`}>
							{location.Name}
						</a>
					</h3>
					{@render locationDetail(location.CityState)}
				</li>
			{/each}
		</ul>
	{/if}

	{#if searchQueryType === 'farm' && filteredResults}
		<div class="location">
			<h3 class="location__heading">About the Farm</h3>

			<p class="location__text">
				{#if filteredResults[0].Description}{filteredResults[0].Description}
				{:else}
					Description in-progress
				{/if}
			</p>

			{#if filteredResults[0].Url}
				<p class="location__text link">
					<svg
						class="link__icon"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path
							d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
						/></svg
					>
					<a href={filteredResults[0].Url}>{filteredResults[0].Name} Website</a>
				</p>
			{/if}

			{#if filteredResults[0].Email}
				<p class="location__text link">
					<svg
						class="link__icon"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						><rect width="20" height="16" x="2" y="4" rx="2" /><path
							d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
						/></svg
					>
					<a href={`mailto:${filteredResults[0].Email}`}>{filteredResults[0].Name} Email</a>
				</p>
			{/if}
		</div>
	{/if}

	{#if !!page.url.searchParams.get('q')}
		<Return />
	{/if}
</div>

<style>
	.locations {
		grid-column: 1 / -1;
		margin-block: 2rem;
		margin-inline: auto;
		color: #006b38;
		background: #faf6d4;
		position: relative;
		z-index: 100;
		padding-block: 1.5rem;
		box-shadow:
			0 100px 80px 0 rgba(0, 0, 0, 0.02),
			0 22px 18px 0 rgba(0, 0, 0, 0.04),
			0 6px 5px 0 rgba(0, 0, 0, 0.08);

		@media (min-width: 30rem) {
			width: max-content;
			max-width: 50ch;
			margin-inline: 3.375rem;
			border-radius: 1rem;
		}
	}

	.locations__introduction,
	.location {
		padding-inline: 1.5rem;
	}
	.locations__title,
	.location__heading {
		font-family: 'Tiempos Text';
	}
	.locations__description {
		padding-block-start: 1rem;
	}

	.locations__count {
		font-style: italic;
		margin-block-end: 1rem;
	}

	.locationList {
		border-top: 1px solid #e8e8e8;
		display: grid;
		column-gap: 2rem;
		margin-inline: 0;
		padding-inline: 0;
		list-style-type: none;
	}

	.location {
		padding-block: 1.25rem;
	}

	.location__text {
		margin-block-start: 0.5rem;
	}

	.link + .link {
		margin-block-start: 0;
	}

	.location--listItem {
		margin: 0;
		position: relative;
		border-bottom: 1px solid #e8e8e8;

		&:hover {
			background: rgba(255, 253, 235, 1);
		}
	}

	.location__name {
		font-family: 'Tiempos Text';
		font-weight: 800;
		font-style: normal;
		font-size: 1rem;
	}

	.location__link {
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

	.locationMarker {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		margin-block-start: 0.5rem;
	}

	.locationMarker__icon {
		height: 1rem;
		width: auto;
	}

	.locationMarker__text {
		font-size: 1rem;
		line-height: 1.2;
		font-style: italic;
	}

	.link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.link__icon {
		height: 1rem;
		width: auto;
	}
</style>
