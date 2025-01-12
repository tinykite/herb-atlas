<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	interface Props {
		options: Array<string>;
	}

	let searchInput = $state('') as unknown as HTMLInputElement;
	let searchQuery = $state(page.url.searchParams.get('q'));

	let { options }: Props = $props();
	let locations: Array<string> = $state([]);

	let menu = $state() as unknown as HTMLElement;
	let showMenu = $state(false);

	let filterValue: string = $state('');

	const handleClick = (event: Event) => {
		let value;
		const target = event.target as HTMLElement;

		if (target.matches('p')) {
			const parentTarget = target.parentElement;
			value = parentTarget && parentTarget.dataset.value;
		} else {
			value = target.dataset.value;
		}

		if (value) {
			handleUpdate(value);
		}
	};

	const handleUpdate = (value: string) => {
		searchQuery = value;
		showMenu = false;

		goto(`/?q=${value}`);
	};

	const handleMenuNavigation = (event: KeyboardEvent) => {
		if (!event.target) {
			return;
		}

		const target = event.target as HTMLElement;
		const dataAttributes = target.dataset;

		if (!dataAttributes.index) {
			return;
		}

		const currentIndex = parseInt(dataAttributes.index);

		switch (event.code) {
			case 'ArrowUp':
				if (currentIndex === 0) {
					const nextIndex = locations.length - 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
					nextTarget.focus();
				} else {
					const nextIndex = currentIndex - 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
					nextTarget.focus();
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (currentIndex <= locations.length - 2) {
					const nextIndex = currentIndex + 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
					nextTarget.focus();
				} else {
					const nextTarget = menu.querySelector(`[data-index="0"]`) as HTMLElement;
					nextTarget.focus();
				}
				break;
			case 'Escape':
				searchInput.focus();
				break;
			case 'Tab':
			case 'Enter':
			case 'Space':
				filterValue = (event.target as HTMLElement).dataset.value as string;
				handleUpdate(filterValue);
			default:
				return;
		}
	};
	const handleSearchNavigation = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'Escape':
			case 'Tab':
				locations = [];
				break;
			case 'ArrowDown':
				if (showMenu && document.activeElement === searchInput) {
					const firstOption = menu.querySelectorAll('[data-index]')[0] as HTMLElement;
					return firstOption.focus();
				}
				break;
			default:
				return;
		}
	};

	const handleLocationSearch = () => {
		if (searchQuery.length < 2) {
			return;
		}

		const autocompleteSuggestions = filterOptions(searchQuery);

		if (autocompleteSuggestions.length) {
			locations = autocompleteSuggestions;
			showMenu = true;
		}

		if (!autocompleteSuggestions.length && locations.length) {
			locations = [];
		}
	};

	const filterOptions = (value: string): string[] => {
		const targetValue = value.toLowerCase();
		return options.filter((option) => option.toLowerCase().includes(targetValue));
	};

	let timer: any;

	const debounceSearchInput = () => {
		clearTimeout(timer);
		if (searchQuery === '') {
			locations = [];
			if (page.url.searchParams.get('q')) {
				goto('/');
			}
		}

		timer = setTimeout(() => {
			handleLocationSearch();
		}, 200);
	};
</script>

<search class="searchWrapper">
	<div class="search">
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

		<form method="POST" action="/">
			<label id="search" class="u-visuallyHidden" for="location">Search</label>
			<input
				bind:this={searchInput}
				class="search__input"
				type="search"
				role="combobox"
				aria-controls="location-results"
				aria-autocomplete="list"
				aria-expanded={showMenu}
				autocomplete="off"
				name="location"
				id="location"
				placeholder="Search by city or state"
				onkeyup={(e) => handleSearchNavigation(e)}
				oninput={() => debounceSearchInput()}
				bind:value={searchQuery}
			/>
		</form>
	</div>
	{#if showMenu}
		<ul
			class="autocomplete"
			id="location-results"
			aria-labelledby="location-search"
			role="listbox"
			bind:this={menu}
			onclick={(e) => handleClick(e)}
			onkeydown={(e) => handleMenuNavigation(e)}
		>
			{#each locations as location, i}
				<li
					class="autocomplete__option"
					role="option"
					aria-selected="false"
					tabindex="-1"
					data-index={i}
					data-value={location}
				>
					<svg
						class="autocomplete__icon"
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
					<p class="location__commonName">{location}</p>
				</li>
			{/each}

			{#if searchQuery.length >= 3 && locations.length === 0}
				<li
					class="autocomplete__option autocomplete__option--empty"
					role="option"
					aria-selected="false"
				>
					No farms in {searchQuery}
				</li>
			{/if}
		</ul>
	{/if}
</search>

<style>
	.searchWrapper {
		position: relative;
	}
	.search {
		display: flex;
		align-items: center;
		column-gap: 0.5rem;
		position: relative;
		color: #39350f;
	}

	.search__icon {
		position: absolute;
		height: 1.125rem;
		width: auto;
		margin-inline-start: 0.75rem;
		color: currentColor;
		pointer-events: none;
	}

	.search__input {
		border-radius: 4rem;
		padding-inline-start: 2.25rem;
		padding-inline-end: 2.25rem;
		padding-block: 0.5rem;
		border: 1px solid #39350f;
		outline-offset: 2px;
		font-size: 1rem;
		font-family: 'franklin-gothic-urw', sans-serif;
		font-weight: 400;
		font-style: normal;
	}
	.search__input:hover {
		border-color: #39350f;
	}
	.search__input:focus-visible,
	.search__input:focus {
		outline-style: solid;
		outline-width: 2px;
		outline-color: #4900fc;
	}

	.search__input::placeholder {
		font-size: 0.8rem;
		font-family: 'franklin-gothic-urw', sans-serif;
		font-weight: 500;
		font-style: normal;
		color: #757575;
	}

	.search__input::-webkit-search-cancel-button {
		position: absolute;
		right: 1rem;
	}

	.autocomplete {
		display: grid;
		position: absolute;
		border-radius: 0.5rem;
		background: white;
		list-style-type: none;
		padding: 0;
		margin-block-start: 1rem;
		overflow: auto;
		max-height: 50vh;
		width: 100%;
		box-shadow:
			0 4px 80px 4px rgba(0, 0, 0, 0.02),
			0 1px 22px 0 rgba(0, 0, 0, 0.08);
	}

	.autocomplete__option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		cursor: pointer;
		border-bottom: 1px solid rgba(56, 80, 50, 0.1);
	}

	.autocomplete__icon {
		height: 1rem;
		width: auto;
	}

	.autocomplete__option--empty {
		text-align: center;
	}
	.autocomplete__option:hover,
	.autocomplete__option:focus {
		background-color: #4c3a78;
		color: #fff;
		outline: none;
	}
</style>
