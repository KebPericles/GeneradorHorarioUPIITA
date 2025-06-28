<script lang="ts">
	import { Color } from '$lib/Color';
	import type { Materia } from 'kesos-ipnsaes-api';
	import { colorMateria } from '$lib/util';
	import Eliminar from './Eliminar.svelte';

	interface Props {
		materiasSeleccionadas: Materia[];
		tema: Color[];
	}

	let { materiasSeleccionadas = $bindable([]), tema }: Props = $props();
	let materiasSeleccionadasAnterior: Materia[] = [];
	let articleListaMaterias: HTMLElement;

	$effect(() => {
		if (materiasSeleccionadas.length > materiasSeleccionadasAnterior.length) {
			// Scroll lista
			articleListaMaterias?.scrollTo({
				behavior: 'smooth',
				top: articleListaMaterias?.scrollHeight
			});
		}

		materiasSeleccionadasAnterior = $state.snapshot(materiasSeleccionadas) as Materia[];
	});

	const eliminarMateriaPorId = (idMateria: string) => {
		materiasSeleccionadas = materiasSeleccionadas.filter((materia) => materia.id !== idMateria);
	};
</script>

<article
	class="flex overflow-y-auto not-md:h-[40svh] not-md:w-[100%] md:w-full"
	bind:this={articleListaMaterias}
>
	{#if materiasSeleccionadas.length > 0}
		<ul class="block w-full" id="lista-materias">
			{#each materiasSeleccionadas as materia}
				<li
					class="text-textomateria my-0.5 inline-flex w-[100%] gap-2 rounded-xl p-2 font-semibold hyphens-auto"
					style="background-color: {colorMateria(tema, materia).cssRGBA()};"
				>
					<div class="w-16 content-center text-wrap break-words">
						{materia.grupo}
					</div>
					<div class="w-[calc((100%-5rem)/2)] content-center">
						{materia.nombre}
					</div>
					<div class="w-[calc((100%-5rem)/2)] content-center">
						{materia.profesor}
					</div>
					<div class="w-8 content-center">
						<Eliminar click={eliminarMateriaPorId} nombre={materia.id}></Eliminar>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<h3 class="place-self-center text-center text-2xl">
			Empieza a seleccionar materias para generar un horario. Aquí aparecerán todas las materias
			seleccionadas.
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
