<script lang="ts">
	import { Color, ColoresOwOExtendido, ColoresUwU } from '$lib/Color';
	import ListaMaterias from '$lib/components/ListaMaterias.svelte';
	import SelectorMaterias from '$lib/components/SelectorMaterias.svelte';
	import VisualizadorHorario from '$lib/components/VisualizadorHorario.svelte';
	import { crearCombinaciones, obtenerTodasLasMaterias } from '$lib/data/db';
	import { Materia, materiasFromDiccionario } from 'kesos-ipnsaes-api';
	import { onMount } from 'svelte';

	let todasLasMaterias: Materia[] = $state([]);
	let materiasSeleccionadas: Materia[] = $state([]);
	let cantidadDeMateriasSeleccionadas = $derived(materiasSeleccionadas.length);
	let horariosPosibles: Materia[][] = $derived(crearCombinaciones(materiasSeleccionadas));

	const Temas: Record<string, Record<string, string | Color[]>> = {
		OwO: { 'data-theme': 'light', 'tema-calendario': ColoresOwOExtendido },
		UwU: { 'data-theme': 'dark', 'tema-calendario': ColoresUwU },
		Wil: { 'data-theme': 'wil', 'tema-calendario': ColoresOwOExtendido }
	};
	let tema = 'UwU';
	let temaHtml = $derived(Temas[tema]['data-theme'] as string);
	$effect(() => {
		document.documentElement.setAttribute('data-theme', temaHtml);
	});
	// TODO: Configurable tema
	let temaCalendario = $derived(Temas[tema]['tema-calendario'] as Color[]);

	// TODO: Menú para seleccionar ciclo escolar
	let cicloEscolar = $state('a');

	const actualizarBaseDeDatos = async () => {
		todasLasMaterias = await obtenerTodasLasMaterias(cicloEscolar);
	};

	onMount(async () => {
		await actualizarBaseDeDatos();
	});
	
</script>

<svelte:window
	onmessage={async (event) => {
		console.log('Recibido mensaje: ', event);
		if (event.data?.tipo === 'TODAS_MATERIAS_A_GENERADOR') {
			console.log('TODAS_MATERIAS_A_GENERADOR');
			console.debug(event.data);
			cicloEscolar = event.data.cicloEscolar;
			todasLasMaterias = materiasFromDiccionario(event.data.materias);
			materiasSeleccionadas = [];
		}
	}}
/>

<header class="w-full justify-between py-4">
	<h1>Generador de horarios UPIITA</h1>
</header>
<div class="flex flex-row gap-4 p-4 not-md:h-auto not-md:flex-wrap md:h-[65svh]">
	<SelectorMaterias {todasLasMaterias} bind:materiasSeleccionadas />
	<ListaMaterias bind:materiasSeleccionadas tema={temaCalendario} />
</div>
<VisualizadorHorario {horariosPosibles} {cantidadDeMateriasSeleccionadas} tema={temaCalendario} />

<style global>
	@reference '../app.css';
	@tailwind utilities;
</style>
