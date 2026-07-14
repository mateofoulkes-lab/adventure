import { loadProgress } from './progress.js';

export function imageWithPlaceholder({ src, alt, kind, pageId = '' }) {
  const wrap = document.createElement('div');
  wrap.className = `image-frame ${kind}`;
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  const ph = document.createElement('div');
  ph.className = 'image-placeholder';
  ph.setAttribute('role', 'img');
  ph.setAttribute('aria-label', alt || (kind === 'cover' ? 'Portada pendiente' : 'Ilustración pendiente'));
  ph.innerHTML = `<strong>${kind === 'cover' ? 'PORTADA PENDIENTE' : 'ILUSTRACIÓN PENDIENTE'}</strong>${pageId ? `<span>PÁGINA ${pageId.toUpperCase()}</span>` : ''}`;
  img.addEventListener('load', () => ph.hidden = true);
  img.addEventListener('error', () => { console.warn(`Imagen no disponible: ${src}`); img.hidden = true; ph.hidden = false; });
  wrap.append(img, ph);
  return wrap;
}

function progressLabel(progress) {
  if (progress.completed) return 'COMPLETADA';
  return progress.initiated ? 'EN CURSO' : 'NO INICIADA';
}

export function renderLibrary(app, catalog, onOpen) {
  app.innerHTML = '<section class="library" aria-label="Biblioteca de aventuras"><div class="book-grid"></div></section>';
  const grid = app.querySelector('.book-grid');
  catalog.sort((a,b) => (a.order || 0) - (b.order || 0)).forEach(item => {
    const progress = loadProgress(item.id, '');
    const found = progress.discoveredEndings.length;
    const total = item.totalEndings || '?';
    const article = document.createElement('article');
    article.className = 'book-tile';
    article.style.setProperty('--accent', item.accentColor || '#b7892b');

    const open = document.createElement('button');
    open.className = 'book-cover-button';
    open.setAttribute('aria-label', `Abrir presentación de ${item.title}`);
    open.append(imageWithPlaceholder({ src: item.cover, alt: `Portada de ${item.title}`, kind: 'cover' }));
    open.addEventListener('click', () => onOpen(item));

    const meta = document.createElement('div');
    meta.className = 'book-meta';
    meta.innerHTML = `<h2>${item.title}</h2><p>${progressLabel(progress)} · ${found} / ${total} FINALES</p>${progress.completed ? '<span class="stamp">COMPLETADA</span>' : ''}`;

    article.append(open, meta);
    grid.append(article);
  });
}
