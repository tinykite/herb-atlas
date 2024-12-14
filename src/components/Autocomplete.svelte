<script lang="ts">
	interface Props {
		options: Array<string>;
	}

	let searchInput = $state();
	let searchQuery = $state('');

	let { options }: Props = $props();
	let locations = $state([]);

	let menu = $state();
	let showMenu = $state(false);

	let filterValue = $state();

	const handleMenuNavigation = (e) => {
		const dataAttributes = e.target.dataset;
		const currentIndex = parseInt(dataAttributes.index);

		switch (e.code) {
			case 'ArrowUp':
				if (currentIndex === 0) {
					const nextIndex = locations.length - 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`);
					nextTarget.focus();
				} else {
					const nextIndex = currentIndex - 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`);
					nextTarget.focus();
				}

			case 'ArrowDown':
				if (currentIndex <= locations.length - 2) {
					const nextIndex = currentIndex + 1;
					const nextTarget = menu.querySelector(`[data-index="${nextIndex}"]`);
					nextTarget.focus();
				} else {
					const nextTarget = menu.querySelector(`[data-index="0"]`);
					nextTarget.focus();
				}
				break;
			case 'Escape':
				searchQuery = '';
				locations = [];
				searchInput.focus();
				break;

			case 'Enter':
			case 'Space':
				filterValue = e.target.dataset.value;
				showMenu = false;
				searchQuery = filterValue;
			default:
				return;
		}
	};
	const handleSearchNavigation = (e) => {
		switch (e.code) {
			case 'Escape':
			case 'Tab':
				locations = [];
				break;
			case 'Shift':
			case 'Space':
			case 'Delete':
				break;
			case 'ArrowDown':
				if (showMenu && document.activeElement === searchInput) {
					const firstOption = menu.querySelectorAll('[data-index]')[0];
					return firstOption.focus();
				}
				break;
			case 'ArrowUp':
				console.log('arrow up hit');
				break;
			case 'enter':
				console.log('enter hit');
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
	};

	const filterOptions = (value: string): string[] => {
		const targetValue = value.toLowerCase();
		return options.filter((option) => option.toLowerCase().includes(targetValue));
	};

	let timer;

	const debounceSearchInput = () => {
		if (searchQuery === '') {
			locations = [];
		}
		clearTimeout(timer);
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
		<label id="search" class="u-visuallyHidden" for="location">Search</label>

		<input
			bind:this={searchInput}
			class="search__input"
			type="search"
			role="combobox"
			aria-controls="location-results"
			aria-autocomplete="list"
			aria-expanded="false"
			autocomplete="off"
			id="location-search"
			placeholder="Search by city or state"
			onkeyup={(e) => handleSearchNavigation(e)}
			oninput={() => debounceSearchInput()}
			bind:value={searchQuery}
			tabindex="-1"
		/>
	</div>
	<ul
		class="autocomplete"
		id="location-results"
		aria-labelledby="location-search"
		role="listbox"
		bind:this={menu}
		onkeydown={(e) => handleMenuNavigation(e)}
	>
		{#if showMenu}
			{#each locations as location, i}
				<li
					class="autocomplete__option"
					role="option"
					aria-selected="false"
					tabindex="-1"
					data-index={i}
					data-value={location}
				>
					<p class="location__commonName">{location}</p>
				</li>
			{/each}
		{/if}
		<!-- {:else if searchQuery}
			<li
				class="autocomplete__option autocomplete__option--empty"
				role="option"
				aria-selected="false"
			>
				No results
			</li>
		{/if} -->
	</ul>
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
		color: #5e5e5e;
	}

	.search:has(input:focus) {
		color: #0f62fe;
	}

	.search__icon {
		position: absolute;
		height: 0.9rem;
		width: auto;
		margin-inline-start: 0.75rem;
		color: currentColor;
		pointer-events: none;
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

	.autocomplete {
		background: white;
		list-style-type: none;
		padding: 0;
		margin-block-start: 1rem;
		border-radius: 0.25rem;
		position: absolute;
		overflow: auto;
		max-height: 50vh;
		width: 100%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.257);
	}

	.autocomplete__option {
		margin: 0;
		padding-inline: 2rem;
		padding-block: 0.5rem;
		border-bottom: 1px solid #ccc;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
		cursor: pointer;
	}

	.autocomplete__option--empty {
		text-align: center;
	}
	.autocomplete__option:hover,
	.autocomplete__option:focus {
		background-color: #c1e4ff;
		border-color: #c1e4ff;
		color: #222;
		outline: none;
	}
</style>
