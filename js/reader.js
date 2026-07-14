import { loadProgress, saveProgress, resetReading, clearProgress, recordEnding } from './progress.js';
import { imageWithPlaceholder } from './library.js';

function headerHtml(adventure, progress) {
  return `<header class="reader-header"><div class="reader-brand">ELIGE TU PROPIA<br>AVENTURA</div><p>${progress.discoveredEndings.length} / ${adventure.totalEndings} finales encontrados</p></header><button class="library-link" id="toLibrary">VOLVER A BIBLIOTECA</button>`;
}

function statusLabel(progress) {
  if (progress.completed) return 'COMPLETADA';
  return progress.initiated ? 'EN CURSO' : 'NO INICIADA';
}

export function renderBookIntro(app, item, adventure, basePath, onBackLibrary, onStartReader) {
  const progress = loadProgress(adventure.id, adventure.startPage);
  const coverSrc = adventure.cover ? new URL(adventure.cover, basePath).toString() : item.cover;
  app.innerHTML = '';
  const section = document.createElement('section');
  section.className = 'reader-page book-intro';
  section.innerHTML = `${headerHtml(adventure, progress)}<div class="intro-layout"><div class="intro-cover"></div><div class="intro-copy"><p class="reader-kicker">${adventure.genre || item.genre || 'Aventura'}</p><h2>${adventure.title}</h2><p class="intro-author">${adventure.author || item.author || ''}</p><p class="intro-summary">${adventure.summary || item.summary || ''}</p><dl class="intro-stats"><div><dt>Estado</dt><dd>${statusLabel(progress)}</dd></div><div><dt>Finales</dt><dd>${progress.discoveredEndings.length} / ${adventure.totalEndings}</dd></div>${progress.initiated ? `<div><dt>Progreso</dt><dd>Página ${String(progress.currentPage || adventure.startPage).toUpperCase()}</dd></div>` : ''}</dl><button class="primary-action intro-start" id="startReading">${progress.initiated ? 'CONTINUAR LEYENDO' : 'COMENZAR A LEER'}</button>${progress.initiated ? '<button class="text-action" id="restartIntro">REINICIAR LECTURA</button>' : ''}</div></div>`;
  section.querySelector('.intro-cover').append(imageWithPlaceholder({ src: coverSrc, alt: `Portada de ${adventure.title}`, kind: 'cover' }));
  app.append(section);
  section.querySelector('#toLibrary').onclick = onBackLibrary;
  section.querySelector('#startReading').onclick = onStartReader;
  const restart = section.querySelector('#restartIntro');
  if (restart) restart.onclick = () => { resetReading(adventure); onStartReader(); };
}

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
    let endingState = null;
    if (page.isEnding) endingState = recordEnding(adventure, page.endingId);
    progress = loadProgress(adventure.id, adventure.startPage);
    app.innerHTML = '';
    const section = document.createElement('section');
    section.className = 'reader-page';
    section.innerHTML = `${headerHtml(adventure, progress)}<article class="reading-column">${progress.history.length ? '<button class="back-link" id="back" aria-label="Volver a la decisión anterior">← Atrás</button>' : '<span class="back-link disabled" aria-hidden="true">← Atrás</span>'}</article>`;
    const article = section.querySelector('.reading-column');
    if (page.image) {
      article.append(imageWithPlaceholder({ src: new URL(page.image, basePath).toString(), alt: page.imageAlt || page.title || adventure.title, kind: 'page', pageId: page.id }));
    } else {
      section.classList.add('text-only-page');
    }
    const text = document.createElement('p'); text.className = 'story-text'; text.textContent = page.text; article.append(text);
    if (page.isEnding) {
      const box = document.createElement('div'); box.className = 'ending-box';
      const missing = Math.max(0, adventure.totalEndings - progress.discoveredEndings.length);
      box.innerHTML = `<p class="ending-label">FINAL</p><h3>${page.endingTitle || page.endingId}</h3><p>${endingState.isNew ? 'Descubriste un final nuevo.' : 'Este final ya había sido encontrado.'}</p><p>${progress.discoveredEndings.length} / ${adventure.totalEndings} finales encontrados. ${missing ? `Faltan ${missing}.` : 'Colección completa.'}</p>${endingState.completed ? '<span class="stamp large">COLECCIÓN COMPLETA</span>' : ''}`;
      article.append(box);
    }
    const choices = document.createElement('div'); choices.className = 'choices';
    (page.choices || []).forEach(choice => { const btn = document.createElement('button'); btn.className = 'choice-button'; btn.textContent = page.choices.length === 1 ? 'Continuar' : choice.text; btn.setAttribute('aria-label', choice.text); btn.onclick = () => adventure.pages[choice.target] ? go(choice.target) : drawError(`La decisión apunta a una página inexistente: ${choice.target}`); choices.append(btn); });
    if (page.isEnding) {
      choices.innerHTML += '<button class="choice-button" id="endingBack">Volver a la última decisión</button><button class="choice-button" id="restart">Empezar de nuevo</button><button class="choice-button" id="endingLibrary">Volver a biblioteca</button>';
    }
    article.append(choices); app.append(section);
    section.querySelector('#toLibrary').onclick = onBackLibrary;
    const backBtn = section.querySelector('#back'); if (backBtn) backBtn.onclick = back;
    const endingBack = section.querySelector('#endingBack'); if (endingBack) endingBack.onclick = back;
    const restart = section.querySelector('#restart'); if (restart) restart.onclick = () => { progress = resetReading(adventure); draw(); };
    const endingLibrary = section.querySelector('#endingLibrary'); if (endingLibrary) endingLibrary.onclick = onBackLibrary;
  }
  draw();
}
