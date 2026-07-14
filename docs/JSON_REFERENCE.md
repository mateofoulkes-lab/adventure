# Referencia JSON

## Catálogo `adventures/index.json`

`adventures` es un arreglo de libros. Cada entrada usa `id`, `title`, `author`, `summary`, `path`, `cover`, `genre`, `publicationStatus`, `order` y opcionalmente `accentColor`. `path` apunta al `adventure.json`; `cover` apunta al JPG desde la raíz del sitio.

## Aventura `adventure.json`

Propiedades: `id`, `title`, `author`, `summary`, `cover` (`images/cover.jpg`), `version`, `genre`, `startPage`, `totalEndings` y `pages`.

## Página

Cada página vive en `pages` con clave igual a su `id`. Usa `title`, `text`, `image`, `imageAlt`, `choices`, `isEnding`, `endingId` y `endingTitle`. Las páginas finales tienen `isEnding: true`, `endingId`, `endingTitle` y `choices: []`.

## Decisión

Cada decisión tiene `text` y `target`. El `target` debe existir como clave de `pages`. Si hay una sola decisión, el lector la muestra como “Continuar”.

## Rutas JPG e imágenes faltantes

Usá rutas relativas a la carpeta de la aventura: `images/cover.jpg`, `images/page-001.jpg`. Si una imagen no existe, se muestra un placeholder HTML/CSS y se registra una advertencia; no es error fatal.

## Errores frecuentes

- `startPage` apunta a una página inexistente.
- Una decisión apunta a un `target` que no existe.
- Una página no final no tiene decisiones.
- Dos finales comparten `endingId`.
- `totalEndings` no coincide con los finales declarados.
