import type { Color } from './Color';
import { Dia, type Materia } from 'kesos-ipnsaes-api';
import type { Evento } from './components/Calendario.svelte';
import { Temporal } from '@js-temporal/polyfill';

/**
 * Función para calcular el color de la materia en un tema
 * @param tema Tema de colores representado por un array de Color
 * @param materia Materia a colorear
 * @returns
 */
export const colorMateria = (tema: Color[], materia: Materia) => {
	return tema[materia.hashNombre % tema.length];
};

export const eventosSemanaDeMaterias = (materias: Materia[], tema: Color[]) => {
	let eventos: Record<string, Evento[]> = {};

	for (const dia in Object.keys(Dia).filter((v) => isNaN(Number(v)))) {
		eventos[dia] = eventos[dia] ?? [];
		materias.forEach((materia) => {
			if (materia.estaVacia) return;
			if (materia.horario.length === 0) return;

			materia.horario.forEach((clase) => {
				if (Number(clase.dia) !== Number(dia)) return;
				eventos[dia].push({
					id: materia.id,
					nombre: `${materia.grupo} ${materia.abreviacionNombre}`,
					dia: clase.dia,
					horaInicio: Temporal.PlainTime.from(clase.horaInicio),
					horaFin: Temporal.PlainTime.from(clase.horaFin),
					color: colorMateria(tema, materia).cssRGBA()
				});
			});
		});
	}

	return eventos;
};
