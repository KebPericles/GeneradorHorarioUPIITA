<script lang="ts">
	import Paginador from "./Paginador.svelte";
	import { Dia, type Materia } from "../lib/Materias";
	import Calendario, { type Evento } from "./Calendario.svelte";
	import { Temporal } from "@js-temporal/polyfill";

	interface Props {
		horariosPosibles: Materia[][];
		cantidadDeMateriasSeleccionadas: number;
	}

	let { horariosPosibles, cantidadDeMateriasSeleccionadas }: Props = $props();

	let pagina = $state(0);
	let paginas = $derived.by(() => {
		return horariosPosibles.length;
	});

	$effect(() => {
		pagina = horariosPosibles.length ? 0 : 0;
	});

	const eventosSemana: Record<string, Evento[]> = $derived.by(() => {
		let eventos: Record<string, Evento[]> = {};

		for (const dia in Object.keys(Dia).filter((v) => isNaN(Number(v)))) {
			eventos[dia] = eventos[dia] ?? [];
			horariosPosibles[pagina].forEach((materia) => {
				if (materia.estaVacia) return;
				if (materia.horario.length === 0) return;

				materia.horario.forEach((clase) => {
					if (clase.dia.toString() !== dia) return;
					eventos[dia].push({
						id: materia.id,
						nombre: `${materia.grupo} ${materia.abreviacionNombre}`,
						dia: clase.dia,
						horaInicio: Temporal.PlainTime.from(clase.horaInicio),
						horaFin: Temporal.PlainTime.from(clase.horaFin),
						color: materia.color.cssRGBA(),
					});
				});
			});
		}

		return eventos;
	});
</script>

<main class="flex flex-col gap-2 w-full">
	<Paginador bind:pagina {paginas} />
	{#if horariosPosibles[pagina]?.length > 0}
		<article class="relative w-full">
			<Calendario intervaloMinutos={90} {eventosSemana}></Calendario>
			<pre>
				{JSON.stringify(horariosPosibles[pagina], null, 2)}
			</pre>
		</article>
	{:else if cantidadDeMateriasSeleccionadas === 0}
		<h3>Aún no has seleccionado ninguna materia.</h3>
	{:else}
		<h3>No hay horarios disponibles para las materias seleccionadas.</h3>
	{/if}
</main>
