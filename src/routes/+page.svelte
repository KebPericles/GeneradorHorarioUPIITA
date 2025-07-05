<script lang="ts">
	import { Color, ColoresOwOExtendido, ColoresUwU } from '$lib/Color';
	import ListaMaterias from '$lib/components/ListaMaterias.svelte';
	import SelectorMaterias from '$lib/components/SelectorMaterias.svelte';
	import VisualizadorHorario from '$lib/components/VisualizadorHorario.svelte';
	import { chocanHorario, crearCombinaciones, obtenerTodasLasMaterias } from '$lib/data/db';
	import { Materia, materiasFromDiccionario } from 'kesos-ipnsaes-api';
	import { onMount, untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

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
	let materia: Materia | undefined = $state(undefined);

	/**
	 * Mapeo de id de materia a lista de materias traslapadas
	 */
	let traslapes: Map<string, Materia[]> = new SvelteMap();

	$inspect(materiasSeleccionadas).with(console.debug);

	$effect(() => {
		if (materiasSeleccionadas.length > untrack(() => traslapes.size)) {
			// CASO: Materias agregadas
			let materiasAgregadas = materiasSeleccionadas.filter(
				(materia) => !(materia.id in untrack(() => traslapes.keys()))
			);

			for (let i = 0; i < materiasAgregadas.length; i++) {
				const materia = materiasAgregadas[i];
				untrack(() => traslapes.set(materia.id, []));
			}

			for (let i = 0; i < materiasAgregadas.length; i++) {
				const materia = materiasAgregadas[i];

				for (let j = i + 1; j < materiasSeleccionadas.length; j++) {
					const materiaSeleccionada = materiasSeleccionadas[j];
					if (materiaSeleccionada.nombre === materia.nombre) continue;

					// Verificar si hay traslape
					if (!chocanHorario(materia, materiaSeleccionada)) continue;

					untrack(() => traslapes.get(materia.id)?.push(materiaSeleccionada));
					untrack(() => traslapes.get(materiaSeleccionada.id)?.push(materia));
				}
			}
		} else {
			// CASO: Materias eliminadas
			let idsMateriasSeleccionadas = materiasSeleccionadas.map((materia) => materia.id);

			// Eliminar la materia del registro
			untrack(() =>
				traslapes
					.keys()
					.filter((materiaId) => !idsMateriasSeleccionadas.includes(materiaId))
					.forEach((materiaId) => {
						traslapes.delete(materiaId);
						console.debug('eliminando', materiaId);
					})
			);

			// Eliminar los traslapes en otras materias
			for (const materiaId of untrack(() => traslapes.keys())) {
				let traslape = untrack(() => traslapes.get(materiaId));
				if (!traslape) continue;

				untrack(() =>
					traslapes.set(
						materiaId,
						traslape.filter((materia) => idsMateriasSeleccionadas.includes(materia.id))
					)
				);
			}
		}

		console.debug(
			'traslapes',
			untrack(() => traslapes)
		);
	});

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

	let temaCalendario = $derived(Temas[tema]['tema-calendario'] as Color[]); // TODO: Configurable tema

	// TODO: Menú para seleccionar ciclo escolar
	let cicloEscolar = $derived(datosHorario.cicloEscolar);

	const actualizarBaseDeDatos = async () => {
		todasLasMaterias = await obtenerTodasLasMaterias(cicloEscolar);
	};

	onMount(async () => {
		console.log('onMount');

		await actualizarBaseDeDatos();

		window.postMessage({ tipo: 'PAGINA_CAHUITL_ORARIUX_INIT' });
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
			datosHorario.escuela = (event.data.escuela as String).toUpperCase();
			materiasSeleccionadas = [];
		}
	}}
/>

<header class="flex w-full items-center gap-8 py-4 not-md:flex-col md:flex-row">
	<div class="mx-6 block items-center gap-4">
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
	<ListaMaterias
		bind:materiasSeleccionadas
		tema={temaCalendario}
		bind:materiaParaDetalles={materia}
		{traslapes}
	/>
</div>
<VisualizadorHorario
	{horariosPosibles}
	{cantidadDeMateriasSeleccionadas}
	tema={temaCalendario}
	bind:materia
/>

<style global>
	@reference '../app.css';
	@tailwind utilities;
</style>
