<script lang="ts">
	import { obtenerNombresDeMaterias, obtenerProfesores } from '$lib/data/db';
	import { Materia } from '$lib/Materias';
	import Agregar from './Agregar.svelte';
	import Eliminar from './Eliminar.svelte';
	import FlechaDropdown from './FlechaDropdown.svelte';
	import Dropdown from './Dropdown.svelte';

	interface Props {
		todasLasMaterias: Materia[];
		materiasSeleccionadas: Materia[];
	}

	let { todasLasMaterias, materiasSeleccionadas = $bindable([]) }: Props = $props();

	let nombresDeMaterias: string[] = $derived(
		obtenerNombresDeMaterias(todasLasMaterias).values().toArray()
	);
	let profesores: string[] = $derived(obtenerProfesores(todasLasMaterias).values().toArray());

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
		'Por materia': {
			selector: () => nombresDeMaterias,
			menuDetalle: (materiaNombre: string) => {
				return todasLasMaterias
					.filter((materia) => materia.nombre === materiaNombre)
					.map((materia) => {
						return { nombre: materia.profesor, idMateria: materia.id };
					});
			},
			agregar: (materiaNombre: string) => {
				console.log('Agregar por materia: ', materiaNombre);

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
				console.log('Eliminar por materia: ', materiaNombre);

				materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
					return materia.nombre !== materiaNombre;
				});
			}
		},
		'Por profesor': {
			selector: () => profesores,
			menuDetalle: (profesorNombre: string) => {
				return [];
			},
			agregar: (profesorNombre: string) => {
				console.log('Agregar por profesor: ', profesorNombre);

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
				console.log('Eliminar por profesor: ', profesorNombre);

				materiasSeleccionadas = materiasSeleccionadas.filter((materia) => {
					return materia.profesor !== profesorNombre;
				});
			}
		},
		'Por horario (no disponible)': {
			selector: () => [],
			menuDetalle: (horario: string) => {
				return [];
			},
			agregar: (horario: string) => {
				console.log('Agregar por horario: ', horario);
			},
			eliminar: (horario: string) => {
				console.log('Eliminar por horario: ', horario);
			}
		},
		'Por grupo (no disponible)': {
			selector: () => [],
			menuDetalle: (grupo: string) => {
				return [];
			},
			agregar: (grupo: string) => {
				console.log('Agregar por grupo: ', grupo);
			},
			eliminar: (grupo: string) => {
				console.log('Eliminar por grupo: ', grupo);
			}
		}
	};

	const agregarMateriaPorId = (idMateria: string) => {
		let materia = todasLasMaterias.find((materia) => materia.id === idMateria);
		if (!materia) throw new Error('No se encontró la materia con ese id');
		if (materiasSeleccionadas.some((materia) => materia.id === idMateria)) return; // La materia ya está seleccionada
		materiasSeleccionadas.push(materia);
	};
	const eliminarMateriaPorId = (idMateria: string) => {
		materiasSeleccionadas = materiasSeleccionadas.filter((materia) => materia.id !== idMateria);
	};

	let modoSeleccion: string = $state('Por materia');
	let dropdownOpen = $state(false);
	let activeClass = ' hover:text-green-700 dark:hover:text-green-500';

	$effect(() => {
		modosSeleccion[modoSeleccion].selector();
	});
	let visible = $state(true);
	/**
	 * Cuando se hace click en un elemento del selector, se abre el detalle de ese elemento
	 */
	let seleccionMenuExpandido: string = $state('');
	$effect(() => {
		if (seleccionMenuExpandido === '') {
			return;
		}
		const offset = document.getElementById('selector-' + seleccionMenuExpandido)?.offsetTop;
		const selector = document.getElementById('selector-materias');
		const offsetInicial: number | undefined = (selector?.childNodes[0] as any)?.offsetTop;

		if (offset === undefined || offsetInicial === undefined)
			throw new Error('No hay nada en el selector');

		selector?.scrollTo({
			behavior: 'smooth',
			top: offset - offsetInicial
		});
	});
</script>

<aside
	class=" relative block transition-[width] transition-discrete not-has-checked:w-0 not-md:h-[60svh] not-md:w-[100%] md:h-full has-checked:md:w-[40%] has-checked:lg:w-[40%]"
>
	{#if visible}
		<input hidden class="peer" type="checkbox" checked />
	{:else}
		<input hidden class="peer" type="checkbox" />
	{/if}

	<div
		class="absolute top-0 bottom-0 -left-12 w-12 flex-col justify-center bg-accent p-2 not-md:hidden md:flex"
	>
		<button
			aria-label="Mostrar u ocultar selector de materias"
			class="contents h-full w-full"
			onclick={() => (visible = !visible)}
		>
			{#if visible}
				<FlechaDropdown orientacion="izquierda" ></FlechaDropdown>
			{:else}
				<FlechaDropdown orientacion="derecha" ></FlechaDropdown>
			{/if}
		</button>
	</div>

	<div class="relative h-11 w-full peer-not-checked:hidden">
		<Dropdown bind:open={dropdownOpen} class="w-[100%]">
			{#each Object.keys(modosSeleccion) as modo}
				<li class="w-full bg-primary h-10 content-center {modo === modoSeleccion ? activeClass : ''}">
					<button class="nostyle "
						onclick={() => {
							modoSeleccion = modo;
							dropdownOpen = false;
						}}
					>
						{modo}
					</button>
				</li>
			{/each}

			{#snippet titulo()}
				{modoSeleccion}
			{/snippet}
		</Dropdown>
	</div>
	<ul
		class="block h-[calc(100%-2.75rem)] overflow-y-auto p-1 peer-not-checked:hidden"
		id="selector-materias"
	>
		{#each modosSeleccion[modoSeleccion].selector() as seleccionable}
			<li
				class="gradiente my-1 flex min-h-12 flex-col justify-center border-b-2 border-solid text-start last:border-b-0"
				id={'selector-' + seleccionable}
			>
				<div class="flex h-auto w-full flex-row items-center justify-between py-3">
					<button
						class="nostyle ml-0.5 flex h-full w-[25px] flex-row"
						onclick={() =>
							(seleccionMenuExpandido =
								seleccionMenuExpandido === seleccionable ? '' : seleccionable)}
					>
						{#if seleccionMenuExpandido === seleccionable}
							<FlechaDropdown orientacion="abajo" class="w-full" />
						{:else}
							<FlechaDropdown orientacion="derecha" class="w-full " />
						{/if}
					</button>
					<div class="w-full px-2 text-wrap break-words hyphens-auto">
						{seleccionable}
					</div>
					<div class="mr-1 flex h-full w-[75px] flex-row gap-1 p-0">
						<Agregar click={modosSeleccion[modoSeleccion].agregar} nombre={seleccionable} />
						<Eliminar click={modosSeleccion[modoSeleccion].eliminar} nombre={seleccionable} />
					</div>
				</div>
				{#if seleccionMenuExpandido === seleccionable}
					<ul class="flex h-auto w-full flex-col">
						{#each modosSeleccion[modoSeleccion].menuDetalle(seleccionable) as detalle}
							<li class="flex min-h-12 flex-row text-start">
								<div class="flex w-full flex-row items-center justify-between gap-2">
									<div class="flex h-full w-[50px] flex-row gap-1 p-2"></div>
									<div class=" w-full px-2 text-wrap break-words hyphens-auto">
										{detalle.nombre}
									</div>
									<div class="flex h-full w-[100px] flex-row gap-1 p-2">
										<Agregar click={agregarMateriaPorId} nombre={detalle.idMateria} />
										<Eliminar click={eliminarMateriaPorId} nombre={detalle.idMateria} />
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
		);
		border-image-slice: 1;
	}
</style>
