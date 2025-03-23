<script lang="ts">
	import { Temporal } from "@js-temporal/polyfill";
	import { Dia, Materia } from "../lib/Materias";

	interface Props {
		intervaloMinutos: number;
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
			duracion: Temporal.Duration.from({ hours: 24, minutes: 0 }),
		};

		// Calcula la primer y última hora de los eventos introducidos
		for (const dia in eventosSemana) {
			const eventosDia = eventosSemana[dia];
			for (const eventoDia of eventosDia) {
				const inicioEvento = eventoDia.horaInicio;
				const finEvento = eventoDia.horaFin;

				if (
					Temporal.PlainTime.compare(intervaloHoras.inicio, inicioEvento) > 0
				) {
					intervaloHoras.inicio = inicioEvento;
				}

				if (Temporal.PlainTime.compare(intervaloHoras.fin, finEvento) < 0) {
					intervaloHoras.fin = finEvento;
				}
			}
		}

		if (
			Temporal.PlainTime.compare(intervaloHoras.inicio, intervaloHoras.fin) >= 0
		) {
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

	const posicionDeEvento = (evento: Evento) => {
		let posicionStyle = "";

		const horasDesdeInicio = intervaloHoras.inicio.until(evento.horaInicio);
		const duracionEvento = evento.horaInicio.until(evento.horaFin);

		const proporcionHoras =
			horasDesdeInicio.total("minutes") /
			intervaloHoras.duracion.total("minutes");
		const proporcionDuracion =
			duracionEvento.total("minutes") /
			intervaloHoras.duracion.total("minutes");

		// TODO:
		// BUG: Error de redondeo,
		posicionStyle = `top: ${Math.floor(proporcionHoras * 100_00) / 100}%;`;
		posicionStyle += `height: ${Math.floor(proporcionDuracion*100_00) / 100}%;`;

		return posicionStyle;
	};
	const estiloEvento = (evento: Evento) => {
		let estilo = "";
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
		// pueda agregar sus propios colores.
		estilo += `background-color: ${evento.color};`;

		return estilo;
	};
</script>

<div class="calendario w-full h-full bg-gray-50 dark:bg-gray-700 rounded-4xl">
	<ul class="flex flex-row w-full h-[8svh]">
		<li class="w-full h-full bg-gray-100 dark:bg-gray-800">Horas</li>
		{#each Object.keys(Dia).filter((v) => isNaN(Number(v))) as dia}
			<li class="w-full h-full bg-gray-200 dark:bg-gray-700">{dia}</li>
		{/each}
	</ul>
	<ul class="flex flex-row w-full max-h-[80svh]">
		<li class="w-full flex flex-col">
			{#each horasTemporal as hora}
				<div class="w-full h-[7svh] bg-gray-100 dark:bg-gray-800">
					{hora.toString({ smallestUnit: "minute" })}
				</div>
			{/each}
		</li>
		{#each Object.keys(eventosSemana) as dia}
			<li class="w-full bg-gray-200 relative top-0 bottom-0">
				{#each eventosSemana[dia] as evento}
					<div
						class="w-full bg-gray-100 dark:bg-gray-800 absolute z-10"
						style={estiloEvento(evento)}
					>
						{evento.nombre}
					</div>
				{/each}
			</li>
		{/each}
	</ul>
</div>
