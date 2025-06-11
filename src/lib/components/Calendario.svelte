<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import { Dia, Materia } from 'kesos-ipnsaes-api';
	import { Color } from '$lib/Color';

	interface Props {
		intervaloMinutos: number;
		/**
		 * Mapeo de eventos por día, siempre va a tener todos los días, pero puede ser un arreglo vacío.
		 */
		eventosSemana: Record<string, Evento[]>;
	}
	let { intervaloMinutos = 0, eventosSemana }: Props = $props();

	export type Evento = {
		id: string;
		nombre: string;
		dia: Dia;
		horaInicio: Temporal.PlainTime;
		horaFin: Temporal.PlainTime;
		/**
		 * String del color en algun formato que pueda ser usado por CSS.
		 *
		 * @example rgb(255, 0, 0)
		 */
		color: string;
	};

	let intervaloHoras = $derived.by(() => {
		let intervaloHoras = {
			inicio: Temporal.PlainTime.from({ hour: 23, minute: 59 }),
			fin: Temporal.PlainTime.from({ hour: 0, minute: 0 }),
			duracion: Temporal.Duration.from({ hours: 24, minutes: 0 })
		};

		// Calcula la primer y última hora de los eventos introducidos
		for (const dia in eventosSemana) {
			const eventosDia = eventosSemana[dia];
			for (const eventoDia of eventosDia) {
				const inicioEvento = eventoDia.horaInicio;
				const finEvento = eventoDia.horaFin;

				if (Temporal.PlainTime.compare(intervaloHoras.inicio, inicioEvento) > 0) {
					intervaloHoras.inicio = inicioEvento;
				}

				if (Temporal.PlainTime.compare(intervaloHoras.fin, finEvento) < 0) {
					intervaloHoras.fin = finEvento;
				}
			}
		}

		if (Temporal.PlainTime.compare(intervaloHoras.inicio, intervaloHoras.fin) >= 0) {
			intervaloHoras.inicio = Temporal.PlainTime.from({ hour: 7, minute: 0 });
			intervaloHoras.fin = Temporal.PlainTime.from({ hour: 20, minute: 30 });
		} else {
			intervaloHoras.duracion = intervaloHoras.inicio.until(intervaloHoras.fin);
		}

		return intervaloHoras;
	});

	/**
	 * Calcula las horas que se van a mostrar en el calendario
	 */
	let horasTemporal = $derived.by(() => {
		if (intervaloMinutos === 0) {
			//* Este es un default que aplica para este caso, pero lo ideal sería calcularlo en base a los eventos
			intervaloMinutos = 90;
		}

		let horasImprimir = [];
		for (
			let hora = Temporal.PlainTime.from(intervaloHoras.inicio);
			Temporal.PlainTime.compare(hora, intervaloHoras.fin) < 0;
			hora = hora.add({ minutes: intervaloMinutos })
		) {
			horasImprimir.push(hora);
		}

		return horasImprimir;
	});
	let diasVisibles = $derived.by(() => {
		let dias = Object.keys(Dia)
			.filter((v) => !isNaN(Number(v)))
			.map((v) => Number(v));
		if (eventosSemana[Dia.Sábado].length > 0) return dias; // TODO test para que siempre sean 6 dias
		return dias.slice(0, -1);
	}) as number[];

	const posicionDeHora = (hora: Temporal.PlainTime) => {
		let indiceHora = horasTemporal.indexOf(hora);
		return `grid-area: ${indiceHora + 2} / 1 / ${indiceHora + 3} / 2;`;
	};
	const posicionDeEvento = (evento: Evento) => {
		let posicionStyle = '';

		const horasDesdeInicio = intervaloHoras.inicio.until(evento.horaInicio);
		const duracionEvento = evento.horaInicio.until(evento.horaFin);

		const proporcionHoras =
			horasDesdeInicio.total('minutes') / intervaloHoras.duracion.total('minutes');
		const proporcionDuracion =
			duracionEvento.total('minutes') / intervaloHoras.duracion.total('minutes');

		// TODO:
		// BUG: Error de redondeo,
		posicionStyle = `top: ${Math.floor(proporcionHoras * 100_00) / 100}%;`;

		if (margenEvento) {
			posicionStyle += `height: calc(${Math.floor(proporcionDuracion * 100_00) / 100}% - 2px);`;
		} else {
			posicionStyle += `height: ${Math.floor(proporcionDuracion * 100_00) / 100}%;`;
		}

		return posicionStyle;
	};

	// TODO: Configurables
	const CLASS_MARGEN_EVENTO = 'margen-evento';
	const CLASS_BORDE_REDONDEADO = 'borde-redondeado';
	const bordeRedondeado = false;
	const margenEvento = false;
	const gradienteEvento = false;

	const estiloEvento = (evento: Evento) => {
		let estilo = '';
		estilo += posicionDeEvento(evento);

		// TODO: Colorear materias, aún no tengo algo claro, pero
		// podrían ser colores seleccionados proceduralmente de una lista
		// predefinida. El problema es que podrían ser colores insuficientes
		// para todas las materias, también podrían aplicarse pequeñas variaciones
		// en el color de dos grupos de una misma materia, etc.
		//
		// Otro problema es que hasta ahora solo se puede colorear el fondo, no
		// el texto. Por ende solo se podría ajustar a un tipo de tema (dark o light)
		// y luego aplicar el color de fondo a todo el texto. Tal vez sea prioridad
		// darle soporte a colores de texto.
		//
		// Además actualmente es extendible para que el usuario
		// pueda agregar sus propios colores
		if (gradienteEvento) {
			estilo += `background-image: linear-gradient(to bottom, ${evento.color} 0%, ${Color.parse(evento.color)?.darken(0.12).cssRGBA()} 50%, ${evento.color} 100%);`;
			estilo += `border-image-slice: 1; border-image-source: linear-gradient(to bottom, transparent 0%, ${Color.parse(evento.color)?.darken(0.12).cssRGBA()} 50%, transparent 100%);`;
		} else {
			estilo += `background-color: ${evento.color};`;
		}

		return estilo;
	};
</script>

<div
	class="calendario h-full w-full bg-secondary dark:bg-neutral-600"
	style="--dias-visibles:{diasVisibles.length};--horas-visibles:{horasTemporal.length};"
>
	<div class="encabezado horas" data-alttext="Hrs"><span>Horas</span></div>
	<div class="encabezado lunes" data-alttext="L"><span>Lunes</span></div>
	<div class="encabezado martes" data-alttext="M"><span>Martes</span></div>
	<div class="encabezado miercoles" data-alttext="X">
		<span>Miércoles</span>
	</div>
	<div class="encabezado jueves" data-alttext="J"><span>Jueves</span></div>
	<div class="encabezado viernes" data-alttext="V"><span>Viernes</span></div>
	{#if diasVisibles.length > 5}
		<div class="sabado" data-alttext="S"><span>Sábado</span></div>
	{/if}

	{#each horasTemporal as hora}
		<div
			class="hora1 h-[7svh] w-full bg-primary text-accent brightness-150 opacity-[80%]"
			style={posicionDeHora(hora)}
		>
			{hora.toString({ smallestUnit: 'minute' })}
		</div>
	{/each}

	<!--Columnas de días			-->
	{#each diasVisibles as dia}
		<div
			class="h-full w-full content-center
			[&.margen-materias]:pl-[1px]
			[&.margen-materias]:last:pr-[1px]
			{margenEvento ? CLASS_MARGEN_EVENTO : ''}"
			style="grid-area: 2 / {(dia as number) + 2} / {horasTemporal.length + 2} / {(dia as number) +
				3};"
		>
			<div class="relative flex h-full w-full">
				{#each eventosSemana[dia] as evento}
					<div
						class="absolute z-10 w-full content-center
						text-textomateria font-semibold
						[&.borde-redondeado]:rounded-lg
						[&.margen-materias]:m-[1px]
						[&.margen-materias]:w-[calc(100%-2px)]
						{gradienteEvento ? 'border-4' : ''}
						{margenEvento ? CLASS_MARGEN_EVENTO : ''} {bordeRedondeado ? CLASS_BORDE_REDONDEADO : ''}"
						style="{estiloEvento(evento)} text-box: auto;"
					>
						{evento.nombre}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	@reference '../../app.css';
	.calendario {
		position: relative;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr repeat(var(--dias-visibles), 2fr);
		grid-template-rows: 8svh repeat(var(--horas-visibles), 7svh);
	}

	.calendario > .encabezado {
		@apply content-center bg-primary text-calendario text-xl dark:bg-neutral-900;
	}
	.horas {
		grid-area: 1 / 1 / 2 / 2;
	}
	.lunes {
		grid-area: 1 / 2 / 2 / 3;
	}
	.martes {
		grid-area: 1 / 3 / 2 / 4;
	}
	.miercoles {
		grid-area: 1 / 4 / 2 / 5;
	}
	.jueves {
		grid-area: 1 / 5 / 2 / 6;
	}
	.viernes {
		grid-area: 1 / 6 / 2 / 7;
	}
	.sabado {
		grid-area: 1 / 7 / 2 / 8;
	}
</style>
