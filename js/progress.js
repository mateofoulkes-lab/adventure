const PREFIX = 'adventure.progress.';

export function defaultProgress(startPage) {
  return { initiated: false, currentPage: startPage, history: [], discoveredEndings: [], lastReadAt: null, completed: false };
}

export function loadProgress(adventureId, startPage) {
  try {
    const raw = localStorage.getItem(PREFIX + adventureId);
    return raw ? { ...defaultProgress(startPage), ...JSON.parse(raw) } : defaultProgress(startPage);
  } catch (error) {
    console.warn('No se pudo leer el progreso.', error);
    return defaultProgress(startPage);
  }
}

export function saveProgress(adventureId, progress) {
  const next = { ...progress, lastReadAt: new Date().toISOString() };
  localStorage.setItem(PREFIX + adventureId, JSON.stringify(next));
  return next;
}

export function resetReading(adventure) {
  const current = loadProgress(adventure.id, adventure.startPage);
  return saveProgress(adventure.id, { ...current, initiated: true, currentPage: adventure.startPage, history: [] });
}

export function clearProgress(adventureId) {
  localStorage.removeItem(PREFIX + adventureId);
}

export function recordEnding(adventure, endingId) {
  const progress = loadProgress(adventure.id, adventure.startPage);
  const wasKnown = progress.discoveredEndings.includes(endingId);
  const endings = wasKnown ? progress.discoveredEndings : [...progress.discoveredEndings, endingId];
  const completed = endings.length >= adventure.totalEndings;
  saveProgress(adventure.id, { ...progress, initiated: true, discoveredEndings: endings, completed });
  return { isNew: !wasKnown, completed, found: endings.length, total: adventure.totalEndings };
}
