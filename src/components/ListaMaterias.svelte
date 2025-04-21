<script lang="ts">
	import type { Materia } from "../lib/Materias";

	interface Props {
		materiasSeleccionadas: Materia[];
	}

	let { materiasSeleccionadas = $bindable([]) }: Props = $props();
	let materiasSeleccionadasAnterior: Materia[] = [];

	$effect(() => {
		if (materiasSeleccionadas.length > materiasSeleccionadasAnterior.length) {
			document
				.getElementById("lista-materias")
				?.lastElementChild?.scrollIntoView({
					behavior: "smooth",
					block: "end",
					inline: "end",
				});
		}

		materiasSeleccionadasAnterior = $state.snapshot(
			materiasSeleccionadas
		) as Materia[];
	});
</script>

<article class="not-md:w-[100%] md:w-full not-md:h-[60svh] flex overflow-y-auto">
	{#if materiasSeleccionadas.length > 0}
		<ul class="block w-full" id="lista-materias">
			{#each materiasSeleccionadas as materia}
				<li
					class="w-[100%] inline-flex gap-2 p-2 my-0.5 bg-amber-600 rounded-xl"
				>
					<div class="w-16 content-center break-words text-wrap">
						{materia.grupo}
					</div>
					<div class="w-[calc((100%-5rem)/2)] content-center">
						{materia.nombre}
					</div>
					<div class="w-[calc((100%-5rem)/2)] content-center">
						{materia.profesor}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<h3 class="text-center place-self-center text-2xl">
			Empieza a seleccionar materias para generar un horario. Aquí aparecerán
			todas las materias seleccionadas.
		</h3>
	{/if}
</article>

<style>
	/* width */
	::-webkit-scrollbar {
		width: 8px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f100;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
