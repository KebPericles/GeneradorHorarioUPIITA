<script lang="ts">
	import ListaMaterias from '$lib/components/ListaMaterias.svelte';
	import SelectorMaterias from '$lib/components/SelectorMaterias.svelte';
	import VisualizadorHorario from '$lib/components/VisualizadorHorario.svelte';
	import {
		crearCombinaciones,
		obtenerNombresDeMaterias,
		obtenerTodasLasMaterias
	} from '$lib/data/db';
	import { Materia, materiasFromJSON } from '$lib/Materias';
	import { onMount } from 'svelte';

	let todasLasMaterias: Materia[] = $state([]);
	let materiasSeleccionadas: Materia[] = $state([]);
	let cantidadDeMateriasSeleccionadas = $derived(materiasSeleccionadas.length);
	let horariosPosibles: Materia[][] = $derived(crearCombinaciones(materiasSeleccionadas));

	// TODO: Menú para seleccionar ciclo escolar
	let cicloEscolar = $state('a');

	const actualizarBaseDeDatos = async () => {
		todasLasMaterias = await obtenerTodasLasMaterias(cicloEscolar);
	};

	onMount(async () => {
		await actualizarBaseDeDatos();
	});
</script>

<header class="w-full justify-between py-4">
	<h1>Generador de horarios UPIITA</h1>
</header>
<div class="flex flex-row gap-4 p-4 not-md:h-auto not-md:flex-wrap md:h-[65svh]">
	<SelectorMaterias {todasLasMaterias} bind:materiasSeleccionadas />
	<ListaMaterias bind:materiasSeleccionadas />
</div>
<VisualizadorHorario {horariosPosibles} {cantidadDeMateriasSeleccionadas} />

<style global lang="postcss">
	@tailwind utilities;
</style>
