<button popovertarget="info" class="popoverTrigger">
	<svg
		class="popoverTrigger__icon"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
	>
	<span class="u-visuallyHidden">More info for understanding this list of farms</span>
</button>

<div id="info" popover="auto" role="note" aria-label="password instructions" class="popover">
	<div id="instruct">Sustainable medicinal herbalism farms.</div>
</div>

<style>
	.popoverTrigger {
		anchor-name: --myAnchor;
		width: fit-content;
		background: transparent;
		border: transparent;
		height: 1rem;
		width: auto;
		color: #38753f;
		cursor: pointer;
	}

	.popoverTrigger__icon {
		height: 1rem;
		width: auto;
	}

	.popover {
		position: fixed;
		position-anchor: --myAnchor;
		left: calc(anchor(left) + 1.5rem);
		top: anchor(top);
		font-size: 1rem;
		border: none;
		padding: 1rem;
		font-family: 'Tiempos Text';
		font-weight: 500;
		border-radius: 1rem;
	}
</style>
