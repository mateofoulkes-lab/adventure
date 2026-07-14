import { loadProgress, saveProgress, resetReading, clearProgress, recordEnding } from './progress.js';
import { imageWithPlaceholder } from './library.js';

export function renderReader(app, adventure, basePath, onBackLibrary) {
  let progress = loadProgress(adventure.id, adventure.startPage);
  if (!progress.initiated) progress = saveProgress(adventure.id, { ...progress, initiated: true, currentPage: adventure.startPage });

  function go(pageId) {
    progress = saveProgress(adventure.id, { ...progress, initiated: true, history: [...progress.history, progress.currentPage], currentPage: pageId });
    draw();
  }
  function back() {
    const history = [...progress.history];
    const previous = history.pop();
    if (!previous) return;
    progress = saveProgress(adventure.id, { ...progress, history, currentPage: previous });
    draw();
  }
  function drawError(message) { app.innerHTML = `<section class="reader-page"><p class="error-box">${message}</p><button class="secondary-action" id="backBtn">Regresar</button></section>`; app.querySelector('button').onclick = back; }
  function draw() {
    const page = adventure.pages[progress.currentPage];
    if (!page) { console.error('Página inexistente', progress.currentPage); drawError(`La página ${progress.currentPage} no existe.`); return; }
    if (page.isEnding) var endingState = recordEnding(adventure, page.endingId);
    progress = loadProgress(adventure.id, adventure.startPage);
    app.innerHTML = '';
    const section = document.createElement('section');
    section.className = 'reader-page';
    section.innerHTML = `<nav class="reader-nav" aria-label="Controles de lectura"><button class="secondary-action" id="toLibrary">Biblioteca</button><button class="secondary-action" id="back" ${progress.history.length ? '' : 'disabled'}>Atrás</button><button class="secondary-action" id="restart">Reiniciar lectura actual</button><button class="danger-action" id="clear">Borrar todo el progreso</button></nav><p class="reader-kicker">${adventure.genre} · ${progress.discoveredEndings.length} / ${adventure.totalEndings} finales</p><h2>${adventure.title}</h2>${page.title ? `<h3>${page.title}</h3>` : ''}`;
    section.append(imageWithPlaceholder({ src: new URL(page.image || adventure.cover, basePath).toString(), alt: page.imageAlt || page.title || adventure.title, kind: 'page', pageId: page.id }));
    const text = document.createElement('p'); text.className = 'story-text'; text.textContent = page.text; section.append(text);
    if (page.isEnding) {
      const box = document.createElement('div'); box.className = 'ending-box';
      const missing = Math.max(0, adventure.totalEndings - progress.discoveredEndings.length);
      box.innerHTML = `<p class="ending-label">FINAL</p><h4>${page.endingTitle || page.endingId}</h4><p>${endingState.isNew ? 'Descubriste un final nuevo.' : 'Este final ya había sido encontrado.'}</p><p>${missing ? `Faltan ${missing} finales por descubrir.` : 'Descubriste todos los finales de esta aventura.'}</p>${endingState.completed ? '<span class="stamp large">COLECCIÓN COMPLETA</span>' : ''}`;
      section.append(box);
    }
    const choices = document.createElement('div'); choices.className = 'choices';
    (page.choices || []).forEach((choice, index) => { const btn = document.createElement('button'); btn.className = 'choice-button'; btn.textContent = page.choices.length === 1 ? 'Continuar' : choice.text; btn.setAttribute('aria-label', choice.text); btn.onclick = () => adventure.pages[choice.target] ? go(choice.target) : drawError(`La decisión apunta a una página inexistente: ${choice.target}`); choices.append(btn); });
    section.append(choices); app.append(section);
    section.querySelector('#toLibrary').onclick = onBackLibrary;
    section.querySelector('#back').onclick = back;
    section.querySelector('#restart').onclick = () => { progress = resetReading(adventure); draw(); };
    section.querySelector('#clear').onclick = () => { if (confirm('¿Borrar todo el progreso de esta aventura?')) { clearProgress(adventure.id); progress = loadProgress(adventure.id, adventure.startPage); draw(); } };
  }
  draw();
}
