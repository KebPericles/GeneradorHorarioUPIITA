# Generador de horario UPIITA
[![Deploy to GitHub Pages](https://github.com/KebPericles/GeneradorHorarioUPIITA/actions/workflows/deploy.yml/badge.svg)](https://github.com/KebPericles/GeneradorHorarioUPIITA/actions/workflows/deploy.yml) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/KebPericles/GeneradorHorarioUPIITA)
## Créditos

- Wilpan: ayuda con la lógica

## Documentación

### Tareas

- Selector de semestre/escuela
  - Selección de ciclo escolar
  - Selección de carrera
    - Primera vez menú en grande para seleccionar carrera y guardar en local storage
    - Luego menú en pequeño para seleccionar carrera y guardar en local storage
  - Extraer datos
  - Guardar en local storage la selección de materias

- Menú para seleccionar las materias a incluir en el horario

  - Selección por profesor (no prioridad)
  - Selección por materia (no prioridad)
  - Excluir horarios (no prioridad)

- Menú de materias seleccionadas

  - Reordenar a voluntad (no prioridad)

- Visualizar horarios ---------|> (Requerimiento fundamental)

  - Diseño adaptable
  - Diseño ---------|> (Requerimiento fundamental)
    - Colores de materias
    - Espaciado entre columnas

- Barra de busqueda tanto en el menú de selección como en la selección

- Compartir el horario generado

### Glosario

- Materia: se refiere al conjunto de asignatura, grupo, profesor y horario de clase. Nota: oficialmente materia es la asignatura.
- Asignatura: se refiere a la clase de la materia.

### Mejoras

- Diferentes carreras
  - Tal vez separar los horarios de cada carrera en archivos.
- Soporte para niveles de materias (extendible a semestres, trayectorias recomendadas, etc.)
- Compartir horario
- Soporte para otras escuelas
- Integración con el SAES
  - Cupos disponibles
    - Extensión para checar cupos disponibles entre ambas páginas: esta idea se ve más prometedora, ya que no será necesario montar un servidor
    - Socket para checar cupos disponibles

### Base de datos

Los datos de los horarios se extraen del SAES con ayuda de la extensión MOD SAES así:

1. Se seleccionan todas las materias
2. Se copia el elemento HTML de la tabla de materias que genera y se pega en Excel, se guarda en formato CSV UTF-8 con el nombre del ciclo escolar (ej. 2019-1).
3. Se convierte a JSON con ejecutando `pnpm run csv2json ciclo_escolar`, donde `ciclo_escolar` es el nombre del ciclo escolar.

Nota: de momento solo se ha testeado en UPIITA.
