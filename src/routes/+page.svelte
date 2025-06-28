<script lang="ts">
	import { Color, ColoresOwOExtendido, ColoresUwU } from '$lib/Color';
	import ListaMaterias from '$lib/components/ListaMaterias.svelte';
	import SelectorMaterias from '$lib/components/SelectorMaterias.svelte';
	import VisualizadorHorario from '$lib/components/VisualizadorHorario.svelte';
	import { crearCombinaciones, obtenerTodasLasMaterias } from '$lib/data/db';
	import { Materia, materiasFromDiccionario } from 'kesos-ipnsaes-api';
	import { onMount } from 'svelte';

	const NO_ESCUELA = 'Sin escuela';

	let datosHorario = $state({
		cicloEscolar: 'a',
		tema: 'UwU',
		escuela: NO_ESCUELA
	});
	$effect(() => {
		if (datosHorario.escuela && datosHorario.escuela !== NO_ESCUELA) {
			document.title = `Cahuitl Orariux - ${datosHorario.escuela}`;
		} else {
			document.title = 'Cahuitl Orariux';
		}
	});

	let todasLasMaterias: Materia[] = $state([]);
	let materiasSeleccionadas: Materia[] = $state([]);
	let cantidadDeMateriasSeleccionadas = $derived(materiasSeleccionadas.length);
	let horariosPosibles: Materia[][] = $derived(crearCombinaciones(materiasSeleccionadas));

	const Temas: Record<string, Record<string, string | Color[]>> = {
		OwO: { 'data-theme': 'light', 'tema-calendario': ColoresOwOExtendido },
		UwU: { 'data-theme': 'dark', 'tema-calendario': ColoresUwU },
		Wil: { 'data-theme': 'wil', 'tema-calendario': ColoresOwOExtendido }
	};
	let tema = $derived(datosHorario.tema);
	let temaHtml = $derived(Temas[tema]['data-theme'] as string);
	$effect(() => {
		document.documentElement.setAttribute('data-theme', temaHtml);
	});
	// TODO: Configurable tema
	let temaCalendario = $derived(Temas[tema]['tema-calendario'] as Color[]);

	// TODO: Menú para seleccionar ciclo escolar
	let cicloEscolar = $derived(datosHorario.cicloEscolar);

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
			datosHorario.cicloEscolar = event.data.cicloEscolar;
			todasLasMaterias = materiasFromDiccionario(event.data.materias);
			materiasSeleccionadas = [];
		}
	}}
/>

<header class="flex w-full flex-row items-center gap-8 py-4">
	<div class="block items-center gap-4 mx-6">
		<h1 class="text-6xl!">Cahuitl Orariux</h1>
		<h6 class="text-xs">"No se trata de lo que es, sino de lo que puede ser"</h6>
	</div>
	<div class="flex flex-row items-center gap-4">
		<h2 class="text-4xl">{datosHorario.escuela}</h2>
	</div>
	<div class="flex flex-row items-center gap-4">
		<h2 class="text-4xl">{datosHorario.cicloEscolar}</h2>
	</div>
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
