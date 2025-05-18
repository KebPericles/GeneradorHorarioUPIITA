<script lang="ts">
	import type { Snippet } from 'svelte';

	// Extraído de https://svelte.dev/playground/4c5dfd34cc634774bd242725f0fc2dab?version=5.30.2
	import type { FocusEventHandler } from 'svelte/elements';

	interface Props {
		open: boolean;
		class: string;
		children: Snippet;
		titulo: Snippet;
	}

	let {
		open = $bindable(false),
		class: className = 'flex items-center justify-between',
		children,
		titulo
	}: Props = $props();

	const handleDropdownClick = () => {
		open = !open; // togle state on click
	};

	const handleDropdownFocusLoss: FocusEventHandler<HTMLDivElement> = ({
		relatedTarget,
		currentTarget
	}) => {
		// use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget?.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		open = false;
	};
</script>

<div class="dropdown {className}" onfocusout={handleDropdownFocusLoss}>
	<button class="w-full !rounded-l-none !rounded-br-none" onclick={handleDropdownClick}>
		{@render titulo()}
		{#if open}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<title>Close Dropdown</title>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<title>Open Dropdown</title>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		{/if}
	</button>
	<ul class="w-full shadow absolute z-10" style:display={open ? 'block' : 'none'}>
		{@render children?.()}
	</ul>
</div>
