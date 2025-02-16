<script lang="ts">
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import { ChevronDownOutline } from "flowbite-svelte-icons";
	import { obtenerNombresDeMaterias, obtenerProfesores } from "../lib/data/db";
	import { Materia } from "../lib/Materias";
	import Agregar from "./Agregar.svelte";
	import Eliminar from "./Eliminar.svelte";

	interface Props {
		todasLasMaterias: Materia[];
		materiasSeleccionadas: Materia[];
		classs?: string;
	}

	let {
		todasLasMaterias,
		materiasSeleccionadas = $bindable([]),
		classs,
	}: Props = $props();

	let nombresDeMaterias: string[] = $derived(
		obtenerNombresDeMaterias(todasLasMaterias).values().toArray()
	);
	let profesores: string[] = $derived(
		obtenerProfesores(todasLasMaterias).values().toArray()
	);

	const modosSeleccion: Record<string, () => any[]> = {
		"Por materia": () => {
			return nombresDeMaterias;
		},
		"Por grupo (no disponible)": () => [],
		"Por profesor": () => {
			return profesores;
		},
		"Por horario (no disponible)": () => [],
	};
	const agregarClick: Record<string, (materiaNombre: string) => void> = {
		"Por materia": (materiaNombre: string) => {
			console.log("Agregar por materia: ", materiaNombre);

			let materiasAgregar = todasLasMaterias.filter((materia) => {
				return materia.nombre === materiaNombre;
			});

			materiasAgregar = materiasAgregar.filter((materia) => {
				return !materiasSeleccionadas.some((materiaSeleccionada) => {
					return materia == materiaSeleccionada;
				});
			});

			materiasSeleccionadas.push(...materiasAgregar);
		},
		"Por profesor": (profesorNombre: string) => {
			console.log("Agregar por profesor: ", profesorNombre);

			let materiasAgregar = todasLasMaterias.filter((materia) => {
				return materia.profesor === profesorNombre;
			});

			materiasAgregar = materiasAgregar.filter((materia) => {
				return !materiasSeleccionadas.some((materiaSeleccionada) => {
					return materia == materiaSeleccionada;
				});
			});

			materiasSeleccionadas.push(...materiasAgregar);
		},
	};

	const eliminarClick: Record<string, (materiaNombre: string) => void> = {
		"Por materia": (materiaNombre: string) => {
			console.log("Eliminar por materia: ", materiaNombre);

			materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
				return materia.nombre !== materiaNombre;
			});
		},
		"Por profesor": (profesorNombre: string) => {
			console.log("Eliminar por profesor: ", profesorNombre);

			materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
				return materia.profesor !== profesorNombre;
			});
		},
	};

	let modoSeleccion: string = $state("Por materia");
	let dropdownOpen = $state(false);
	let activeClass =
		"text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-500";

	$effect(() => {
		modosSeleccion[modoSeleccion]();
	});
</script>

<aside class={classs}>
	<div>
		<Button class="w-[100%]"
			>{modoSeleccion}<ChevronDownOutline
				class="w-6 h-6 ms-2 text-white dark:text-white"
			/></Button
		>
		<Dropdown bind:open={dropdownOpen} class="w-[100%]">
			{#each Object.keys(modosSeleccion) as modo}
				<DropdownItem
					class={modo == modoSeleccion ? activeClass : ""}
					on:click={() => {
						modoSeleccion = modo;
						dropdownOpen = false;
					}}>{modo}</DropdownItem
				>
			{/each}
		</Dropdown>
	</div>
	<ul class=" overflow-y-auto m-1">
		{#each modosSeleccion[modoSeleccion]() as seleccionable}
			<li
				class="text-start min-h-12 flex flex-row gap-2 items-center justify-between"
			>
				<div class=" break-words text-wrap px-2">{seleccionable}</div>
				<div class="w-[100px] h-full p-2 flex flex-row gap-1">
					<Agregar
						click={agregarClick[modoSeleccion]}
						materiaNombre={seleccionable}
					/>
					<Eliminar
						click={eliminarClick[modoSeleccion]}
						materiaNombre={seleccionable}
					/>
				</div>
			</li>
		{/each}
	</ul>
</aside>

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
