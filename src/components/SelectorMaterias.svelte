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
	let visible = $state(true);
</script>

<aside
	class=" transition-[width] transition-discrete has-checked:lg:w-[40%] has-checked:md:w-[40%] not-md:w-[100%] not-md:h-[60svh] md:h-full not-has-checked:w-0 block relative"
>
	{#if visible}
		<input hidden class="peer" type="checkbox" checked />
	{:else}
		<input hidden class="peer" type="checkbox" />
	{/if}

	<div
		class="absolute top-0 bottom-0 -left-12 w-12 md:flex flex-col justify-center p-2 bg-amber-950 not-md:hidden"
	>
		<button
			aria-label="Mostrar u ocultar selector de materias"
			class="w-full h-full contents"
			onclick={() => (visible = !visible)}
		>
			{#if visible}
				<svg
					class="h-full w-auto"
					fill="#ffffff"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 512.01 512.01"
					xml:space="preserve"
					stroke="#ffffff"
					stroke-width="0.00512006"
					><g stroke-width="0"></g><g
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke="#CCCCCC"
						stroke-width="2.048024"
					></g><g>
						<g>
							<g>
								<path
									d="M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0 L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251 c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z"
								></path>
							</g>
						</g>
					</g></svg
				>
			{:else}
				<svg
					class="h-full w-auto"
					fill="#ffffff"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 512.01 512.01"
					xml:space="preserve"
					stroke="#ffffff"
					stroke-width="0.00512006"
					transform="matrix(-1, 0, 0, 1, 0, 0)"
					><g stroke-width="0"></g><g
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke="#CCCCCC"
						stroke-width="2.048024"
					></g><g>
						<g>
							<g>
								<path
									d="M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0 L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251 c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z"
								></path>
							</g>
						</g>
					</g></svg
				>
			{/if}
		</button>
	</div>

	<div class="relative w-full h-11 peer-not-checked:hidden">
		<Button class="w-[100%] h-full"
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
	<ul class="h-[calc(100%-2.75rem)] overflow-y-auto p-1 peer-not-checked:hidden">
		{#each modosSeleccion[modoSeleccion]() as seleccionable}
			<li
				class="text-start min-h-12 flex flex-row gap-2 items-center justify-between"
			>
				<div class=" break-words hyphens-auto text-wrap px-2">
					{seleccionable}
				</div>
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
