# Instrucciones para Codex

Este repositorio contiene una web de aventuras interactivas y los libros
publicados dentro de ella.

## Regla fundamental

No escribas una aventura completa de una sola vez.

Trabajá solamente sobre una página narrativa por vez.

## Archivos maestros

Antes de redactar o modificar una página, consultá siempre:

- `adventure.json`
- `bible.md`
- `outline.md`
- `image-prompts.md`

`adventure.json` es la fuente de verdad estructural.

## Flujo obligatorio de escritura

Cuando el usuario describa una nueva página:

1. Revisá la continuidad y el camino que conduce a ella.
2. Redactá una propuesta.
3. Mostrala en el chat.
4. No modifiques archivos todavía.
5. Esperá la aprobación explícita del usuario.

Cuando el usuario pida cambios:

1. Presentá nuevamente el texto completo corregido.
2. No modifiques todavía los archivos.
3. Esperá una nueva aprobación.

Cuando el usuario apruebe el texto:

1. Proponé entre 2 y 3 decisiones, salvo que indique una continuación única.
2. No agregues todavía las decisiones al JSON.
3. Esperá la aprobación del usuario.

Cuando el usuario apruebe las decisiones:

1. Actualizá `adventure.json`.
2. Actualizá `outline.md`.
3. Actualizá `image-prompts.md`.
4. Validá IDs, destinos y continuidad.
5. Mostrá un resumen del cambio.
6. Hacé un commit solamente si el usuario lo solicita.

## Texto aprobado

No modifiques posteriormente un texto aprobado sin autorización explícita.

No hagas correcciones estilísticas silenciosas.

## Límites

No agregues:

- nuevas ramas no aprobadas;
- personajes no acordados;
- objetos con mecánicas;
- variables narrativas;
- inventario;
- estadísticas;
- finales adicionales;
- imágenes SVG;
- imágenes generadas automáticamente.

Las imágenes serán JPG agregadas manualmente por el usuario.
