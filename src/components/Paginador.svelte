<script lang="ts">
	interface Props {
		pagina: number;
		paginas: number;
	}
	let { pagina = $bindable(), paginas }: Props = $props();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		document
			.getElementById("vista-horario")
			?.scrollIntoView({ behavior: "smooth" });

		if (e.key === "ArrowLeft") {
			pagina = Math.max(0, pagina - 1);
		} else if (e.key === "ArrowRight") {
			pagina = Math.min(paginas - 1, pagina + 1);
		}
	}}
/>

<nav class="flex justify-center gap-2 w-full h-10">
	<button
		class="w-auto h-full flex justify-center"
		disabled={pagina === 0}
		aria-label="Ir al principio"
		onclick={() => (pagina = 0)}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			transform="rotate(180)"
			><g fill-rule="evenodd" clip-rule="evenodd" fill="#fff"
				><path
					d="M12.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 12l-3.293-3.293a1 1 0 0 1 0-1.414Z"
				/><path
					d="M6.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L9.586 12 6.293 8.707a1 1 0 0 1 0-1.414Z"
				/></g
			></svg
		>
	</button>
	<button
		class="w-auto h-full flex justify-center has-tooltip"
		disabled={pagina === 0}
		aria-label="Anterior"
		onclick={(e) => (pagina = Math.max(0, pagina - 1))}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			transform="rotate(180)"
			><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"
			></g><g>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
					fill="#ffffff"
				></path>
			</g>
		</svg>
	</button>
	<div class="relative w-0 h-0 tooltip">
		<div
			class="relative -top-2 z-50 w-36 whitespace-normal break-words rounded-lg bg-black py-1.5 px-3 font-sans text-sm font-normal text-white focus:outline-none"
		>
			Puedes usar la flecha izquierda.
		</div>
	</div>
	<div class="w-md align-middle flex justify-center self-center text-xl">
		{#if paginas > 0}
			{pagina + 1} / {paginas}
		{:else}
			0
		{/if}
	</div>
	<button
		class="w-auto h-full flex justify-center has-tooltip"
		disabled={pagina === paginas - 1}
		aria-label="Siguiente (puedes usar la flecha derecha)"
		onclick={(e) => (pagina = Math.min(paginas - 1, pagina + 1))}
	>
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"
			></g><g>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
					fill="#ffffff"
				></path>
			</g>
		</svg>
	</button>
	<div class="relative -left-19 w-0 h-0 tooltip">
		<div
			class="relative -top-2 z-50 w-36 -left-36 whitespace-normal break-words rounded-lg bg-black py-1.5 px-3 font-sans text-sm font-normal text-white focus:outline-none"
		>
			Puedes usar la flecha derecha
		</div>
	</div>

	<button
		class="w-auto h-full flex justify-center has-tooltip"
		disabled={pagina === paginas - 1}
		aria-label="Ir al final"
		onclick={() => (pagina = paginas - 1)}
	>
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
			><g fill-rule="evenodd" clip-rule="evenodd" fill="#fff"
				><path
					d="M12.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 12l-3.293-3.293a1 1 0 0 1 0-1.414Z"
				/><path
					d="M6.293 7.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L9.586 12 6.293 8.707a1 1 0 0 1 0-1.414Z"
				/></g
			></svg
		>
	</button>
</nav>

<style>
	svg {
		@apply h-full;
	}
</style>
