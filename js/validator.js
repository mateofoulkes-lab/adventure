function add(list, type, message) { list.push({ type, message }); }

export async function validateAdventure(adventure, basePath = '') {
  const issues = [];
  if (!adventure?.id) add(issues, 'error', 'Falta id de aventura.');
  if (!adventure?.pages || typeof adventure.pages !== 'object') add(issues, 'error', 'pages debe ser un objeto.');
  const pages = adventure.pages || {};
  const ids = Object.keys(pages);
  if (!pages[adventure.startPage]) add(issues, 'error', `La página inicial no existe: ${adventure.startPage}`);
  const seenEndings = new Set();
  const graph = new Map();
  for (const id of ids) {
    const page = pages[id];
    if (!page || page.id !== id) add(issues, 'error', `Página con estructura inválida o id inconsistente: ${id}`);
    const choices = Array.isArray(page.choices) ? page.choices : [];
    if (!page.isEnding && choices.length === 0) add(issues, 'error', `Página sin salida y no final: ${id}`);
    if (page.isEnding && !page.endingId) add(issues, 'error', `Final sin endingId: ${id}`);
    if (page.endingId) {
      if (seenEndings.has(page.endingId)) add(issues, 'error', `endingId duplicado: ${page.endingId}`);
      seenEndings.add(page.endingId);
    }
    graph.set(id, choices.map((choice, index) => {
      if (!choice.text) add(issues, 'error', `Decisión sin texto en ${id} #${index + 1}`);
      if (!choice.target) add(issues, 'error', `Decisión sin target en ${id} #${index + 1}`);
      if (choice.target && !pages[choice.target]) add(issues, 'error', `Destino inexistente desde ${id}: ${choice.target}`);
      return choice.target;
    }).filter(Boolean));
  }
  const reachable = new Set();
  const visit = (id) => { if (!id || reachable.has(id) || !pages[id]) return; reachable.add(id); (graph.get(id) || []).forEach(visit); };
  visit(adventure.startPage);
  ids.filter(id => !reachable.has(id)).forEach(id => add(issues, 'error', `Página inaccesible desde el inicio: ${id}`));
  ids.filter(id => pages[id].isEnding && !reachable.has(id)).forEach(id => add(issues, 'error', `Final inaccesible: ${id}`));
  if (seenEndings.size !== adventure.totalEndings) add(issues, 'error', `totalEndings incorrecto: declara ${adventure.totalEndings}, hay ${seenEndings.size}.`);
  const imagePaths = [];
  if (adventure.cover) imagePaths.push({ label: 'Portada', path: adventure.cover });
  ids.forEach(id => { if (pages[id].image) imagePaths.push({ label: `Imagen ${id}`, path: pages[id].image }); });
  await Promise.all(imagePaths.map(async item => {
    try {
      const response = await fetch(new URL(item.path, basePath).toString(), { method: 'HEAD' });
      if (!response.ok) add(issues, 'warning', `${item.label} no carga: ${item.path}`);
    } catch { add(issues, 'warning', `${item.label} no carga: ${item.path}`); }
  }));
  return { ok: !issues.some(i => i.type === 'error'), issues };
}

if (typeof window !== 'undefined') window.validateAdventureJson = validateAdventure;
