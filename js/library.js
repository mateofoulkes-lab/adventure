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

export function renderLibrary(app, catalog, onOpen) {
  app.innerHTML = '<section class="library" aria-labelledby="library-title"><h2 id="library-title">Biblioteca de aventuras</h2><div class="book-grid"></div></section>';
  const grid = app.querySelector('.book-grid');
  catalog.sort((a,b) => (a.order || 0) - (b.order || 0)).forEach(item => {
    const progress = loadProgress(item.id, '');
    const found = progress.discoveredEndings.length;
    const status = progress.completed ? 'Completada' : progress.initiated ? 'En curso' : 'No iniciada';
    const article = document.createElement('article');
    article.className = 'book-card';
    article.style.setProperty('--accent', item.accentColor || '#b7892b');
    article.innerHTML = `<div class="book-top">AVENTURA RAMIFICADA</div><h3>${item.title}</h3><div class="book-rule"></div><p class="book-author">${item.author}</p>`;
    article.append(imageWithPlaceholder({ src: item.cover, alt: `Portada de ${item.title}`, kind: 'cover' }));
    const total = item.totalEndings || '?';
    const info = document.createElement('div');
    info.className = 'book-info';
    info.innerHTML = `<p>${item.summary}</p><p><strong>Género:</strong> ${item.genre}</p><p><strong>Estado:</strong> ${status}</p><p><strong>${found} / ${total}</strong> finales</p>${progress.completed ? '<span class="stamp">TODOS LOS FINALES</span>' : ''}`;
    const button = document.createElement('button');
    button.className = 'primary-action';
    button.textContent = progress.initiated ? 'Continuar lectura' : 'Comenzar aventura';
    button.addEventListener('click', () => onOpen(item));
    info.append(button);
    article.append(info);
    grid.append(article);
  });
}
