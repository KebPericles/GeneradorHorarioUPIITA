<script lang="ts">
	import Paginador from './Paginador.svelte';
	import { type Materia } from 'kesos-ipnsaes-api';
	import Calendario, { type Evento } from './Calendario.svelte';
	import { Color } from '$lib/Color';
	import { eventosSemanaDeMaterias } from '$lib/util';

	interface Props {
		horariosPosibles: Materia[][];
		cantidadDeMateriasSeleccionadas: number;
		tema: Color[];
		/**
		 * Materia a mostrar en la vista de horario
		 */
		materia?: Materia;
	}

	const VISTAS = {
		HORARIOS_POSIBLES: 0,
		MATERIA: 1
	};

	let {
		horariosPosibles,
		cantidadDeMateriasSeleccionadas,
		tema,
		materia = $bindable()
	}: Props = $props();

	let vista = $derived.by(() => {
		if (materia) return VISTAS.MATERIA;
		else return VISTAS.HORARIOS_POSIBLES;
	});
	let pagina = $state(0);
	let paginas = $derived.by(() => {
		return horariosPosibles.length;
	});

	$effect(() => {
		pagina = horariosPosibles.length ? 0 : 0;
	});

	const eventosSemana: Record<string, Evento[]> = $derived.by(() => {
		if (vista === VISTAS.HORARIOS_POSIBLES)
			return eventosSemanaDeMaterias(horariosPosibles[pagina], tema);
		else if (vista === VISTAS.MATERIA && materia) return eventosSemanaDeMaterias([materia], tema);
		else throw new Error('Algo salió mal al seleccionar la vista de horario');
	});
</script>

<main class="flex min-h-[80svh] w-full flex-col gap-2" id="vista-horario">
	{#if vista === VISTAS.HORARIOS_POSIBLES}
		<Paginador bind:pagina {paginas} />
	{:else if vista === VISTAS.MATERIA}
		<nav class="flex h-10 w-full flex-col gap-2">
			<h2 class="text-2xl">Viendo horario de: {materia?.nombre}</h2>
		</nav>
	{/if}
	{#if horariosPosibles[pagina]?.length > 0 || materia }
		<article class="relative w-full">
			<Calendario intervaloMinutos={90} {eventosSemana}></Calendario>
		</article>
	{:else if cantidadDeMateriasSeleccionadas === 0}
		<h3>Aún no has seleccionado ninguna materia.</h3>
	{:else}
		<h3>No hay horarios disponibles para las materias seleccionadas.</h3>
	{/if}
</main>
