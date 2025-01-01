<script>
	import Nav from '../../components/Nav.svelte';
	import Map from '../../components/Map.svelte';
	import { browser } from '$app/environment';

	const mapCenter = [-71.6455, 48.4918];
</script>

{#if browser}
	<script async src="https://js.stripe.com/v3/buy-button.js">
	</script>
{/if}

<Nav hideSearch={true} />
<main class="main">
	<h1 class="main__title">Tip Jar</h1>
	<p class="main__text">
		Herb Atlas is a free, single-human endeavor created by Dakota Sexton. Tips are wildly
		appreciated. You can submit a <a href="https://buy.stripe.com/00g2ay6zI08mcdWfYY"
			>one-time Stripe payment</a
		> to help cover the cost of keeping the site alive.
	</p>

	<stripe-buy-button
		buy-button-id="buy_btn_1QcGKFLml7eB9mqiB95jUphI"
		publishable-key="pk_live_51J9x6VLml7eB9mqiUSbtX3eG3nQPmdeT0OMWf2P17gNLvitJlZiLVTw4MFjWRwE0UghoLjbehXt3XTYrneeyCU4G00SWPQ7sjq"
	>
	</stripe-buy-button>
</main>

<Map points={[]} center={mapCenter} zoom={5} />
