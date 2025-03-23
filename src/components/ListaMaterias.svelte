<script lang="ts">
	import type { Materia } from "../lib/Materias";

	interface Props {
		materiasSeleccionadas: Materia[];
	}

	let { materiasSeleccionadas = $bindable([]) }: Props = $props();
</script>

<article class="w-full md:w-full flex overflow-y-auto">
	{#if materiasSeleccionadas.length > 0}
		<ul class="flex flex-col w-full">
			{#each materiasSeleccionadas as materia}
				<li class="bg-amber-800 rounded-xl p-2 m-0.5">
					<div class="flex flex-row gap-1 items-center">
						<div class="min-w-16 h-full rounded-xl p-2">
							{materia.grupo}
						</div>
						<div class="w-full h-full bg-amber-500 rounded-xl p-2">
							{materia.nombre}
						</div>
						<div class="w-full h-full bg-amber-500 rounded-xl p-2">
							{materia.profesor}
						</div>
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
