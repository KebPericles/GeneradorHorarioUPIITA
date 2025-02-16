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
	};

	let intervaloHoras = $derived.by(() => {
		let intervaloHoras = {
			inicio: Temporal.PlainTime.from({ hour: 23, minute: 59 }),
			fin: Temporal.PlainTime.from({ hour: 0, minute: 0 }),
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
			Temporal.PlainTime.compare(hora, intervaloHoras.fin) <= 0;
			hora = hora.add({ minutes: intervaloMinutos })
		) {
			horasImprimir.push(hora);
		}

		return horasImprimir;
	});

	const posicionDeEvento = (evento: Evento) => {
		let posicion = "";

		// TODO: Buscar posición inicial y final de horario de evento
		// Tal vez solo sea necesario buscar el inicio (calcular el top en svh) y calcular la duración del evento, para con eso calcular la altura
		// Esto con la longitud de horasTemporal
		
	};
</script>

<div class="w-full h-full bg-gray-50 dark:bg-gray-700">
	<ul class="flex flex-row w-full h-16">
		<li class="w-full h-full bg-gray-100 dark:bg-gray-800">Horas</li>
		{#each Object.keys(Dia).filter((v) => isNaN(Number(v))) as dia}
			<li class="w-full h-full bg-gray-200 dark:bg-gray-700">{dia}</li>
		{/each}
	</ul>
	<ul class="flex flex-row w-full h-[60svh]">
		<li class="w-full flex flex-col">
			{#each horasTemporal as hora}
				<div class="w-full h-full bg-gray-100 dark:bg-gray-800">
					{hora.toString({ smallestUnit: "minute" })}
				</div>
			{/each}
		</li>
		{#each Object.keys(eventosSemana) as dia}
			<li class="w-full bg-gray-200 relative top-0 bottom-0">
				{#each eventosSemana[dia] as evento}
					<div class="w-full bg-gray-100 dark:bg-gray-800 absolute {posicionDeEvento(evento)} z-10">
						{evento.nombre}
					</div>
				{/each}
			</li>
		{/each}
	</ul>
</div>
