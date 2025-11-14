import type { ContentItem, StoreSnapshotPayload } from './types';

type Listener = (items: ContentItem[]) => void;

const STORAGE_KEY = 'contentPayload';
const SCHEMA_VERSION = 1;

let items: ContentItem[] = [];
const listeners: Listener[] = [];
let persistTimer: number | undefined;
let loaded = false;

function notify() {
  listeners.forEach(l => l([...items]));
}

function schedulePersist() {
  if (typeof window === 'undefined') return; // SSR safeguard
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(persist, 250);
}

export function load() {
  if (loaded) return;
  loaded = true;
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Partial<StoreSnapshotPayload> = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        // Migration hook (future)
        items = parsed.items as ContentItem[];
      }
    }
  } catch (e) {
    console.warn('contentStore load failed', e);
  }
  notify();
}

function persist() {
  if (typeof window === 'undefined') return; // SSR safeguard
  try {
    const payload: StoreSnapshotPayload = { version: SCHEMA_VERSION, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('contentStore persist failed', e);
  }
}

export function add(item: ContentItem) {
  items = [item, ...items];
  notify();
  schedulePersist();
}

export function update(id: string, patch: Partial<ContentItem>) {
  let changed = false;
  items = items.map(it => {
    if (it.id === id) {
      changed = true;
      return { ...it, ...patch };
    }
    return it;
  });
  if (changed) {
    notify();
    schedulePersist();
  }
}

export function exists(url: string) {
  return items.some(i => i.url === url);
}

export function findByUrl(url: string) {
  return items.find(i => i.url === url);
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  // fire immediately
  listener([...items]);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function getAll() {
  return [...items];
}
