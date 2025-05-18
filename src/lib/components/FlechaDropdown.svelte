<script lang="ts">
	interface Props {
		orientacion: 'izquierda' | 'derecha' | 'arriba' | 'abajo';
		class?: string;
		fill?: string;
	}

	let { orientacion, class: styleClass, fill="fill-primary" }: Props = $props();

	const rotacion = {
		izquierda: 'rotate-0',
		derecha: 'rotate-180',
		arriba: 'rotate-90',
		abajo: 'rotate-270'
	};
</script>

<svg
	class="h-auto w-auto {rotacion[orientacion]} {styleClass} {fill}"
	fill="#ffffff"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 512.01 512.01"
	xml:space="preserve"
	stroke="#ffffff"
	stroke-width="0.00512006"
	><g stroke-width="0" class="svelte-104mgg5"></g><g
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke="#CCCCCC"
		stroke-width="2.048024"
		class="svelte-104mgg5"
	></g><g class="svelte-104mgg5"
		><g class="svelte-104mgg5"
			><g class="svelte-104mgg5"
				><path
					d="M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0 L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251 c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z"
					class="svelte-104mgg5"
				></path></g
			></g
		></g
	></svg
>

<style>
	svg:active {
		border: 0;
		outline: 0;
	}
</style>
