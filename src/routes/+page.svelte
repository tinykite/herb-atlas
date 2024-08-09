<script lang="ts">
	import type { PageData } from './$types';
    import Map from '../components/Map.svelte';
    export let data: PageData;
    const { farms } = data
</script>

<h1>Small Herb Farms in the United States</h1>

<h2>By Name — {farms.length} Farms</h2>
<ul>
{#each farms as farm}
<li>{farm.Name}</li>
{/each}
</ul>

<h2>By Location</h2>
<Map mapPoints={farms}/>
