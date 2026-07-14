# Elige tu propia aventura en la web

Sitio estático para leer aventuras ramificadas como una biblioteca de libros juveniles de misterio y aventura. No usa backend, base de datos, autenticación ni frameworks.

## Abrir localmente

```bash
python3 -m http.server 8000
```

Luego abrir `http://localhost:8000`.

## Estructura

- `index.html`: entrada única estática.
- `css/styles.css`: identidad editorial, variables de color y tipografía.
- `js/`: biblioteca, lector, progreso y validador.
- `adventures/index.json`: catálogo editable.
- `adventures/demo/adventure.json`: aventura demo con 11 páginas y 3 finales.
- `schemas/`: plantilla y esquema JSON.
- `docs/`: guía de escritura y referencia JSON.
- `.github/workflows/deploy-pages.yml`: despliegue a GitHub Pages.

## Tipografía

La fuente display elegida es **Eczar** desde Google Fonts: es libre, expresiva, serif decorativa, con contraste y personalidad cercanos a la referencia ITC Benguiat sin redistribuir fuentes comerciales. Las variables son `--font-display`, `--font-reading` y `--font-ui`. Para reemplazarla, cambiá el `link` de fuentes en `index.html` y `--font-display` en `css/styles.css`.

## Agregar una aventura

1. Copiá `schemas/adventure-template.json` a `adventures/mi-aventura/adventure.json`.
2. Creá `adventures/mi-aventura/images/`.
3. Agregá manualmente JPG como `cover.jpg`, `page-001.jpg`, `page-002.jpg`.
4. Editá `adventures/index.json` con `id`, `title`, `author`, `summary`, `path`, `cover`, `genre`, `publicationStatus` y `order`.
5. No hace falta tocar el código principal.

## Placeholders

Si falta `cover.jpg` o cualquier `page-XXX.jpg`, el sitio oculta la imagen rota, registra una advertencia en consola y muestra un placeholder hecho solo con HTML/CSS: `PORTADA PENDIENTE` o `ILUSTRACIÓN PENDIENTE`.

## Progreso

Se guarda en `localStorage` por aventura: página actual, historial real, finales descubiertos, fecha de última lectura y estado completado. “Reiniciar lectura actual” conserva finales; “Borrar todo el progreso” elimina todo después de confirmar.

## Validar

Abrí la consola del navegador y ejecutá:

```js
validateCurrentCatalog()
```

Detecta destinos rotos, páginas inaccesibles, finales duplicados, `totalEndings` incorrecto e imágenes faltantes como advertencias.

## GitHub Pages

El workflow incluido publica la rama `main`. En GitHub, activá Pages con “GitHub Actions”. Todas las rutas son relativas y funcionan bajo subcarpetas.

## Limitaciones del MVP

No hay editor visual, usuarios, sincronización, inventario, combate, variables narrativas, condiciones ni generación automática de historias o imágenes.
