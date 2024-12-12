<script lang="ts">
	import type { PageData } from './$types';
	import Map from '../components/Map.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { farms } = data;

	let locations = $state([]);
	let searchQuery = $state('');
	let latestRequestId = $state(0);

	let timer;
	const debounce = () => {
		if (searchQuery === '') {
			locations = [];
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			handleLocationSearch();
		}, 1000);
	};

	const handleLocationSearch = async () => {
		/* Removed Geocoding lookyp */
	};
</script>

<div class="wrapper">
	<nav class="nav">
		<div class="nav__logoMark">
			<svg
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
			</svg>
			<h1 class="nav__mark">Herbalism Atlas</h1>
		</div>

		<div class="searchWrapper">
			<search class="search">
				<svg
					class="search__icon"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
				>
				<label id="search" class="u-visuallyHidden" for="location">Search</label>

				<input
					class="search__input"
					type="search"
					role="combobox"
					id="location-search"
					aria-controls="location-results"
					placeholder="Search by location"
					aria-autocomplete="list"
					aria-expanded="false"
					autocomplete="off"
					oninput={() => debounce()}
					bind:value={searchQuery}
				/>
			</search>
			<ul
				class="autocompleteResponse"
				id="location-results"
				aria-labelledby="location-search"
				role="listbox"
			>
				{#if locations}
					{#each locations as location}
						<li class="autocompleteResponse__item" role="option" aria-disabled="true">
							<p class="location__commonName">{location.display_name}</p>
							<p class="location__state">
								{#if location.name !== location.address.state}
									{location.address.state}
								{/if}
							</p>
						</li>
					{/each}
				{:else}
					<li
						class="autocompleteResponse__item autocompleteResponse__item--empty"
						role="option"
						aria-disabled="true"
					>
						No results
					</li>
				{/if}
			</ul>
		</div>
	</nav>

	<Map mapPoints={farms} />
</div>

<style>
	.nav {
		display: flex;
		justify-content: space-between;
		position: relative;
		z-index: 100;
		margin-block-start: 1rem;
		margin-inline: 1.5rem;
		height: fit-content;
		color: #0c3307;
	}

	.nav__logoMark {
		display: grid;
		grid-template-columns: 24px 1fr;
		align-items: center;
		gap: 0.5rem;
	}

	.nav__mark {
		font-family: 'pressio-condensed', sans-serif;
		font-weight: 600;
		font-style: normal;
	}

	.search {
		display: flex;
		align-items: center;
		column-gap: 0.5rem;
		position: relative;
	}

	.search__icon {
		position: absolute;
		height: 0.9rem;
		width: auto;
		margin-inline-start: 0.75rem;
		color: #5e5e5e;
	}

	.search__input {
		border-radius: 1.25rem;
		padding-inline-start: 1.85rem;
		padding-inline-end: 1rem;
		padding-block: 0.25rem;
		border: 1px solid #d0d7de;
		outline-offset: 4px;
	}

	.search__input::placeholder {
		font-size: 0.85rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #5e5e5e;
	}

	.autocompleteResponse {
		background: white;
		list-style-type: none;
		padding: 0;
		margin-block-start: 1rem;
		border-radius: 0.25rem;
		position: absolute;
		overflow-y: scroll;
		max-height: 50vh;
	}

	.autocompleteResponse__item {
		padding-inline: 2rem;
		padding-block: 0.5rem;
		border-bottom: 1px solid #ccc;
	}

	.autocompleteResponse__item--empty {
		text-align: center;
	}

	.location__state {
		text-transform: uppercase;
		color: #666;
	}
</style>
