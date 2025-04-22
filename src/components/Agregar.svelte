<script lang="ts">
	interface Props {
		click: (nombre: string) => void;
		nombre: string;
	}
	let { click, nombre }: Props = $props();
</script>

<button
	aria-label="Agregar"
	class="w-full p-0! ratio-1x1 center flex justify-center items-center"
	onclick={() => click(nombre)}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
		<path
			d="M4 12H20M12 4V20"
			stroke="#ffffff"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>
