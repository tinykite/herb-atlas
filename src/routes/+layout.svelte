<script lang="ts">
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
