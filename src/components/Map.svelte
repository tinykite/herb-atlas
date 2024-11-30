<script setup lang="ts">
    import { onMount } from 'svelte';
    import pkg from 'maplibre-gl';
    const {Map, Marker, Popup, FullscreenControl} = pkg;

    export let mapPoints; 
    console.log(mapPoints)
    let mapContainer: HTMLElement

    onMount(() => {
        const map = new Map({
            container: mapContainer,
            style: 'https://api.maptiler.com/maps/dataviz/style.json?key=uCLYsOW1uLfJ3uFvlsku',
        center: [-93.2650, 39.9778],
        zoom: 4
        });

        mapPoints.map(point => {
            const coords = [point.Longitude, point.Latitude]
            const popup = new Popup({offset: 25}).setHTML(`<h3>${point.Name}</h3><p>${point.CityState}</p>`)

            new Marker({color: "#FF0000"}).setLngLat(coords).setPopup(popup).addTo(map)
        })

        map.addControl(new FullscreenControl());
    });
</script>

<div class="map" bind:this={mapContainer} />

<style>
    .map {
        height: 65vh;
    }
</style>