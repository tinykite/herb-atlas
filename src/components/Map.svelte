<script lang="ts">
    import { onMount } from 'svelte';
    import pkg from 'maplibre-gl';
    const {Map, Marker, Popup, FullscreenControl} = pkg;

    let { mapPoints } = $props();
    let mapContainer: HTMLElement | null = $state()

    onMount(() => {
        const map = new Map({
            container: mapContainer,
            style: 'https://api.maptiler.com/maps/dataviz/style.json?key=uCLYsOW1uLfJ3uFvlsku',
        center: [-93.2650, 39.9778],
        zoom: 4
        });

        mapPoints.map(point => {
            const coords = [point.Longitude, point.Latitude]
            const popup = new Popup({offset: 25}).setHTML(`<div><h3>${point.Name}</h3><p>${point.CityState}</p></div>`)

            new Marker({color: "#FF0000"}).setLngLat(coords).setPopup(popup).addTo(map)
        })

        map.addControl(new FullscreenControl());
    });
</script>

<div class="map" bind:this={mapContainer}></div>

<style>
    .map {
        height: 85vh;
    }

    :global(.maplibregl-popup-content) {
        display: grid;
        grid-template-columns: 1fr 0.5rem;
        align-items: center;
        padding-block-start: 1.25rem;
    }
</style>