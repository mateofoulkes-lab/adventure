import { renderLibrary } from './library.js';
import { renderBookIntro, renderReader } from './reader.js';
import { validateAdventure } from './validator.js';

const app = document.querySelector('#app');
let catalog = [];

async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

async function loadCatalog() {
  const data = await getJson('adventures/index.json');
  catalog = await Promise.all((data.adventures || []).filter(a => a.publicationStatus === 'published').map(async item => {
    try {
      const adventure = await getJson(item.path);
      return { ...item, totalEndings: adventure.totalEndings };
    } catch (error) {
      console.error(error);
      return item;
    }
  }));
  document.body.dataset.view = 'library';
  renderLibrary(app, catalog, openAdventureIntro);
}

async function openAdventureIntro(item) {
  try {
    const adventure = await getJson(item.path);
    const basePath = new URL(item.path.replace(/[^/]+$/, ''), location.href).toString();
    document.body.dataset.view = 'reading';
    renderBookIntro(app, item, adventure, basePath, loadCatalog, () => { document.body.dataset.view = 'reading'; renderReader(app, adventure, basePath, loadCatalog); });
  } catch (error) {
    console.error(error);
    app.innerHTML = `<section class="reader-page"><p class="error-box">No se pudo cargar la aventura. Volvé a la biblioteca e intentá revisar el archivo JSON.</p><button class="secondary-action">Volver a biblioteca</button></section>`;
    app.querySelector('button').onclick = loadCatalog;
  }
}

window.validateCurrentCatalog = async function validateCurrentCatalog() {
  const data = await getJson('adventures/index.json');
  const results = [];
  for (const item of data.adventures || []) {
    const adventure = await getJson(item.path);
    const basePath = new URL(item.path.replace(/[^/]+$/, ''), location.href).toString();
    results.push({ id: item.id, ...(await validateAdventure(adventure, basePath)) });
  }
  console.table(results.flatMap(r => r.issues.map(i => ({ adventure: r.id, ...i }))));
  return results;
};

loadCatalog().catch(error => {
  console.error(error);
  app.innerHTML = '<section class="reader-page"><p class="error-box">No se pudo cargar el catálogo de aventuras.</p></section>';
});
