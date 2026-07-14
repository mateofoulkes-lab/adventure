# Guía de escritura

1. Creá una carpeta en `adventures/mi-aventura/` con `adventure.json` e `images/`.
2. Podés trabajar con archivos auxiliares no consumidos por la web: `bible.md` para reglas y tono, `outline.md` para mapa de ramas e `image-prompts.md` para listar prompts y nombres JPG esperados.
3. Usá IDs simples: `p001`, `p002`; finales como `final-luz`, `final-pozo`.
4. Mantené continuidad revisando que cada decisión tenga `target` existente y que toda página sea alcanzable desde `startPage`.
5. Declarar ilustraciones como `images/page-001.jpg`; pedí o generá imágenes fuera del sitio y copiá manualmente los JPG.
6. Entregá a Codex cambios en JSON y documentación, no imágenes base64 ni SVG.
7. Validá con `validateCurrentCatalog()` en la consola del navegador.
