<script lang="ts">
	import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
	import { ChevronDownOutline } from "flowbite-svelte-icons";
	import { obtenerNombresDeMaterias, obtenerProfesores } from "../lib/data/db";
	import { Materia } from "../lib/Materias";
	import Agregar from "./Agregar.svelte";
	import Eliminar from "./Eliminar.svelte";
	import FlechaDropdown from "./FlechaDropdown.svelte";

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

	/**
	 * Proxy para el menú de detalle de un elemento seleccionable
	 */
	interface elementoDetalle {
		/**
		 * Nombre a mostrar en el menú de detalle
		 */
		nombre: string;
		/**
		 * Id de la materia para agregarla
		 */
		idMateria: string;
	}
	interface ModoSeleccion {
		/**
		 * Determina los nombres de los elementos seleccionables, dado el modo de seleccion
		 */
		selector: () => string[];
		/**
		 * Determina los elementos que se mostraran en el menu de detalle de un elemento, dado el modo de seleccion.
		 *
		 */
		menuDetalle: (nombre: string) => elementoDetalle[];
		/**
		 * Determina el evento de click en agregar en el selector de elementos, dado el modo de seleccion
		 */
		agregar: (nombre: string) => void;
		/**
		 * Determina el evento de click en eliminar en el selector de elementos, dado el modo de seleccion
		 */
		eliminar: (nombre: string) => void;
	}

	const modosSeleccion: Record<string, ModoSeleccion> = {
		"Por materia": {
			selector: () => nombresDeMaterias,
			menuDetalle: (materiaNombre: string) => {
				return todasLasMaterias
					.filter((materia) => materia.nombre === materiaNombre)
					.map((materia) => {
						return { nombre: materia.profesor, idMateria: materia.id };
					});
			},
			agregar: (materiaNombre: string) => {
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
			eliminar: (materiaNombre: string) => {
				console.log("Eliminar por materia: ", materiaNombre);

				materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
					return materia.nombre !== materiaNombre;
				});
			},
		},
		"Por profesor": {
			selector: () => profesores,
			menuDetalle: (profesorNombre: string) => {
				return [];
			},
			agregar: (profesorNombre: string) => {
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
			eliminar: (profesorNombre: string) => {
				console.log("Eliminar por profesor: ", profesorNombre);

				materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
					return materia.profesor !== profesorNombre;
				});
			},
		},
		"Por horario (no disponible)": {
			selector: () => [],
			menuDetalle: (horario: string) => {
				return [];
			},
			agregar: (horario: string) => {
				console.log("Agregar por horario: ", horario);
			},
			eliminar: (horario: string) => {
				console.log("Eliminar por horario: ", horario);
			},
		},
		"Por grupo (no disponible)": {
			selector: () => [],
			menuDetalle: (grupo: string) => {
				return [];
			},
			agregar: (grupo: string) => {
				console.log("Agregar por grupo: ", grupo);
			},
			eliminar: (grupo: string) => {
				console.log("Eliminar por grupo: ", grupo);
			},
		},
	};

	const agregarMateriaPorId = (idMateria: string) => {
		let materia = todasLasMaterias.find((materia) => materia.id === idMateria);
		if (!materia) throw new Error("No se encontró la materia con ese id");
		if (materiasSeleccionadas.some((materia) => materia.id === idMateria))
			return; // La materia ya está seleccionada
		materiasSeleccionadas.push(materia);
	};
	const eliminarMateriaPorId = (idMateria: string) => {
		materiasSeleccionadas = materiasSeleccionadas.filter(
			(materia) => materia.id !== idMateria
		);
	};

	let modoSeleccion: string = $state("Por materia");
	let dropdownOpen = $state(false);
	let activeClass =
		"text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-500";

	$effect(() => {
		modosSeleccion[modoSeleccion].selector();
	});
	let visible = $state(true);
	/**
	 * Cuando se hace click en un elemento del selector, se abre el detalle de ese elemento
	 */
	let seleccionMenuExpandido: string = $state("");
	$effect(() => {
		if (seleccionMenuExpandido === "") {
			return;
		}
		const offset = document.getElementById(
			"selector-" + seleccionMenuExpandido
		)?.offsetTop;
		const selector = document.getElementById("selector-materias");
		const offsetInicial: number | undefined = (selector?.childNodes[0] as any)
			?.offsetTop;

		if (offset === undefined || offsetInicial === undefined)
			throw new Error("No hay nada en el selector");

		selector?.scrollTo({
			behavior: "smooth",
			top: offset - offsetInicial,
		});
	});
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
				<FlechaDropdown orientacion="izquierda"></FlechaDropdown>
			{:else}
				<FlechaDropdown orientacion="derecha"></FlechaDropdown>
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
	<ul
		class="block h-[calc(100%-2.75rem)] overflow-y-auto p-1 peer-not-checked:hidden"
		id="selector-materias"
	>
		{#each modosSeleccion[modoSeleccion].selector() as seleccionable}
			<li
				class="text-start min-h-12 flex flex-col my-1 border-b-2 border-solid last:border-b-0 gradiente justify-center"
				id={"selector-" + seleccionable}
			>
				<div class="flex flex-row w-full items-center justify-between h-auto">
					<button
						class="w-[25px] h-full flex flex-row nostyle ml-0.5"
						onclick={() =>
							(seleccionMenuExpandido =
								seleccionMenuExpandido === seleccionable ? "" : seleccionable)}
					>
						{#if seleccionMenuExpandido === seleccionable}
							<FlechaDropdown orientacion="abajo" styleClass="w-full" />
						{:else}
							<FlechaDropdown orientacion="derecha" styleClass="w-full" />
						{/if}
					</button>
					<div class="w-full break-words hyphens-auto text-wrap px-2">
						{seleccionable}
					</div>
					<div class="w-[75px] h-full p-0 flex flex-row gap-1 mr-1">
						<Agregar
							click={modosSeleccion[modoSeleccion].agregar}
							nombre={seleccionable}
						/>
						<Eliminar
							click={modosSeleccion[modoSeleccion].eliminar}
							nombre={seleccionable}
						/>
					</div>
				</div>
				{#if seleccionMenuExpandido === seleccionable}
					<ul class="flex flex-col w-full h-auto">
						{#each modosSeleccion[modoSeleccion].menuDetalle(seleccionable) as detalle}
							<li class="text-start min-h-12 flex flex-row">
								<div
									class="flex flex-row w-full items-center justify-between gap-2"
								>
									<div class="w-[50px] h-full p-2 flex flex-row gap-1"></div>
									<div class=" break-words hyphens-auto text-wrap px-2 w-full">
										{detalle.nombre}
									</div>
									<div class="w-[100px] h-full p-2 flex flex-row gap-1">
										<Agregar
											click={agregarMateriaPorId}
											nombre={detalle.idMateria}
										/>
										<Eliminar
											click={eliminarMateriaPorId}
											nombre={detalle.idMateria}
										/>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
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

	button.nostyle:focus {
		background-color: transparent;
		outline: 0;
	}

	.gradiente {
		border-image-source: linear-gradient(
			to right,
			transparent 0%,
			rgba(255, 255, 255, 0.7) 50%,
			transparent 100%
		) ;
		border-image-slice: 1;
	}
</style>
