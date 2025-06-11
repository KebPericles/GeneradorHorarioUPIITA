import { HORA_REGEX, materiasFromJSON, type Clase, type Materia } from 'kesos-ipnsaes-api';

export const obtenerTodasLasMaterias = async (cicloEscolar: string) => {
	let todasLasMaterias: Materia[];

	let materiasString = await (await fetch(`/data/${cicloEscolar}.json`)).text();
	todasLasMaterias = materiasFromJSON(materiasString);

	return todasLasMaterias;
};

/**
 *
 * @param materias
 * @returns Set de todos los nombres de las materias
 */
export const obtenerNombresDeMaterias = (materias: Materia[]) => {
	return new Set(materias.map((materia) => materia.nombre));
};

export const crearCombinaciones = (materiasSeleccionadas: Materia[]) => {
	let horariosMateria: Map<string, Materia[]> = new Map();
	let nombres: Set<string> = new Set();

	for (let i = 0; i < materiasSeleccionadas.length; i++) {
		const materia = materiasSeleccionadas[i];
		nombres.add(materia.nombre);
		if (!horariosMateria.has(materia.nombre)) {
			horariosMateria.set(materia.nombre, []);
		}

		horariosMateria.get(materia.nombre)?.push(materia);
	}

	let horariosPosibles: Materia[][] = [];
	let listaNombres = [...nombres];

	const chocanHoras = (clase1: Clase, clase2: Clase): boolean => {
		if (clase1.dia != clase2.dia) return false;

		let matchInicio1 = clase1.horaInicio.match(HORA_REGEX);
		let matchFin1 = clase1.horaFin.match(HORA_REGEX);
		let matchInicio2 = clase2.horaInicio.match(HORA_REGEX);
		let matchFin2 = clase2.horaFin.match(HORA_REGEX);

		if (matchInicio1 === null)
			throw new Error('La hora de inicio de la clase 1 no es una hora válida');
		if (matchFin1 === null) throw new Error('La hora de fin de la clase 1 no es una hora válida');
		if (matchInicio2 === null)
			throw new Error('La hora de inicio de la clase 2 no es una hora válida');
		if (matchFin2 === null) throw new Error('La hora de fin de la clase 2 no es una hora válida');

		let clase1Inicio = Number(matchInicio1[1]) + Number(matchInicio1[2]) / 60;
		let clase1Fin = Number(matchFin1[1]) + Number(matchFin1[2]) / 60;
		let clase2Inicio = Number(matchInicio2[1]) + Number(matchInicio2[2]) / 60;
		let clase2Fin = Number(matchFin2[1]) + Number(matchFin2[2]) / 60;

		return (
			(clase1Inicio <= clase2Inicio && clase2Inicio < clase1Fin) ||
			(clase2Inicio <= clase1Inicio && clase1Inicio < clase2Fin)
		);
	};

	const chocanHorario = (materia1: Materia, materia2: Materia): boolean => {
		for (let j = 0; j < materia1.horario.length; j++) {
			const clase1 = materia1.horario[j];
			for (let k = 0; k < materia2.horario.length; k++) {
				const clase2 = materia2.horario[k];
				if (chocanHoras(clase1, clase2)) return true;
			}
		}
		return false;
	};

	const crearHorario = (horario: Materia[] = []) => {
		const i = horario.length;

		if (i >= listaNombres.length) {
			horariosPosibles.push(horario);
			return;
		}

		let listaMaterias: Materia[] = horariosMateria.get(listaNombres[i]) ?? [];

		for (let j = 0; j < listaMaterias.length; j++) {
			const materia = listaMaterias[j];
			let materiaValida = true;

			for (let k = 0; k < horario.length && materiaValida; k++) {
				const materiaRegistrada = horario[k];
				materiaValida = materiaValida && !chocanHorario(materia, materiaRegistrada);
			}

			if (!materiaValida) continue;

			crearHorario([...horario, materia]);
		}
	};

	crearHorario();

	return horariosPosibles;
};

export const obtenerProfesores = (materias: Materia[]) => {
	let profesores: Set<string> = new Set();

	materias.forEach((materia) => {
		profesores.add(materia.profesor);
	});

	return profesores;
};
