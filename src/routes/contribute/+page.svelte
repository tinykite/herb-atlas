<script>
	import { browser } from '$app/environment';
	import { DEFAULT_MAP_ZOOM } from '$lib/map';
	import Map from '../../components/Map.svelte';

	const mapCenter = [-71.6455, 48.4918];
</script>

{#if browser}
	<script async src="https://js.stripe.com/v3/buy-button.js">
	</script>
{/if}

<main class="main" id="main" class="main">
	<h1 class="main__title">Contribute</h1>
	<p class="main__text">
		Anyone is welcome to <a
			href="https://docs.google.com/forms/d/e/1FAIpQLSe9M3cPNsPAWdqSbASt-eMfCddZspQhYPdB1XRocxvQDnLD5g/viewform?usp=sharing"
			>suggest a farm</a
		> to add to the map. Farm submissions will be reviewed before being added. Each farm submitted should
		be committed to regenerative farming practices.
	</p>

	<p class="main__text">
		Tips are also appreciated. You can submit a <a href="https://buy.stripe.com/00g2ay6zI08mcdWfYY"
			>one-time Stripe payment</a
		> to help cover the cost of keeping the site alive.
	</p>

	<stripe-buy-button
		buy-button-id="buy_btn_1QcGKFLml7eB9mqiB95jUphI"
		publishable-key="pk_live_51J9x6VLml7eB9mqiUSbtX3eG3nQPmdeT0OMWf2P17gNLvitJlZiLVTw4MFjWRwE0UghoLjbehXt3XTYrneeyCU4G00SWPQ7sjq"
	>
	</stripe-buy-button>
</main>

<Map geoJSON={[]} center={mapCenter} zoom={DEFAULT_MAP_ZOOM} />
