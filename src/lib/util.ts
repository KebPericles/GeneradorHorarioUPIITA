import type { Color } from "./Color";
import type { Materia } from "kesos-ipnsaes-api";

/**
 * Función para calcular el color de la materia en un tema
 * @param tema Tema de colores representado por un array de Color
 * @param materia Materia a colorear
 * @returns
 */
export const colorMateria = (tema: Color[], materia: Materia) => {
	return tema[materia.hashNombre % tema.length];
};
