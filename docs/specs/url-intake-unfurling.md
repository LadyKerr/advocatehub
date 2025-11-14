# Feature Spec: URL Intake, Auto-Categorization & Unfurling

## Summary
Implement the core LOW FRICTION content capture flow: User pastes a URL, (optionally) selects/overrides a content type, and submits. The system auto-detects platform + probable content type, performs a lightweight unfurl (title, description, thumbnail), stores the record, and shows it in the content list immediately with optimistic UI.

Core mantra: paste → confirm (0–1 clicks) → saved.

## Goals
- Single input box + (optional) inline type override.
- Auto-detect platform + initial content type guess.
- Unfurl metadata (title, description, thumbnail) with graceful fallback.
- Store content item with minimal latency (optimistic add in UI).
- Allow manual tag entry inline (optional, non-blocking).

## Non-Goals (Now)
- Deep platform API integrations (use Open Graph / HTML scrape only initially).
- Authentication & multi-user separation (assume single-user prototype).
- Bulk import (separate feature).
- Advanced deduplication heuristics (simple URL equality only for v1).

## Primary User Stories
1. As an advocate I can paste a URL and press Enter to save it so I don’t break flow.
2. As an advocate I see a quick preview so I know it captured correctly.
3. As an advocate I can override the detected type if the guess is wrong.
4. As an advocate I can (optionally) add tags without extra navigation.
5. As an advocate I’m prevented from adding the exact same URL twice.

## Assumptions
- Single in-browser persisted store (LocalStorage or lightweight IndexedDB) for MVP.
- Network fetch permissible from client (CORS may block some thumbnails — fallback to placeholder).
- Astro + React islands: form + list as React components.

## Data Model Additions
(Extends existing mock `Content` type)
```
type Content = {
  id: string;
  url: string;
  type: 'blog' | 'video' | 'social' | 'workshop' | 'demo' | 'other';
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  platform: string;        // derived from hostname rules
  dateAdded: string;       // ISO string for serialization
  tags?: string[];
  unfurlStatus: 'pending' | 'ok' | 'error';
  errorReason?: string;
  sourceMeta?: { og?: Record<string,string>; }; // raw capture (optional)
}
```

## High-Level Flow
1. User pastes URL into input; press Enter.
2. Immediate client validation (URL format, duplicate check).
3. Platform + type guess (regex/hostname mapping).
4. Optimistic Content object inserted with `unfurlStatus = 'pending'`.
5. Async unfurl routine fetches HTML (proxy if needed) and extracts OG tags.
6. On success, item updated (title, description, thumbnail, status=ok). On failure, status=error (retain optimistic row).
7. User may edit type/tags inline at any time (auto-save to store).

## Components (Planned)
- React: `UrlIntakeForm` (input + type pill + tag adder)
- React: `ContentList` (renders list/grid of content items)
- React: `ContentCard` (shows title/thumbnail/status badges + inline edit controls)
- Lib: `platformDetector(url) -> { platform, suggestedType }`
- Lib: `unfurl(url) -> Promise<Partial<Content>>`
- Store: simple module wrapping LocalStorage with in-memory cache + listeners

## Edge Cases
- Invalid URL string -> inline error, no insertion.
- Duplicate URL -> short toast “Already added” (focus existing card or highlight).
- Unfurl blocked by CORS -> fallback (show domain as title, generic icon).
- Slow fetch (>5s) -> show spinner badge; allow manual cancel (optional later, not in MVP).
- Thumbnail huge / unsupported format -> ignore & proceed.

## Metrics (Internal / Console for Now)
- Time from submit to unfurl completion (ms).
- Unfurl success rate (#ok / total attempts).
- Frequency of type overrides (indicates detection quality).

## Risks & Mitigations
- CORS blocking HTML fetch: Mitigate via optional lightweight serverless proxy (future). For MVP accept partial data.
- Over-aggressive platform rules misclassify: Provide easy override pill.
- Performance with large list: Simple now; add virtualization later.

## Implementation Steps

### Step 1: Basic Storage Layer
Objective: Persist and retrieve content items with reactive updates.
Actions:
1. Create `src/libs/store/contentStore.ts`.
2. Implement in-memory array + `load()` from LocalStorage on init.
3. Expose methods: `add(item)`, `update(id, patch)`, `exists(url)`, `subscribe(listener)`.
4. Serialize after each mutation (debounced 250ms).
Pseudocode:
```
let items = [];
function load() { items = JSON.parse(localStorage.getItem('content')||'[]'); }
function persist() { localStorage.setItem('content', JSON.stringify(items)); }
function add(item){ items.unshift(item); notify(); persist(); }
function update(id, patch){ /* find merge notify persist */ }
function exists(url){ return items.some(i=>i.url===url); }
function subscribe(fn){ listeners.push(fn); return ()=>{/*remove*/}; }
```
User Intervention: None.

### Step 2: Platform & Type Detection Utility
Objective: Derive `platform` + suggested `type` using hostname/path heuristics.
Actions:
1. Create `platformDetector.ts` with mapping table.
2. Patterns (examples):
   - youtube.com / youtu.be => platform: 'youtube', type: 'video'
   - twitch.tv => 'twitch', type: 'video'
   - medium.com / dev.to / hashnode.dev => 'blog'
   - github.com => if repo path contains `/tree/` or `/blob/` maybe 'demo'
   - twitter.com / x.com / linkedin.com / tiktok.com => 'social'
3. Fallback: platform=hostname, type='other'.
Pseudocode:
```
function platformDetector(url){
  const u = new URL(url);
  const h = u.hostname.replace('www.','');
  // series of if / regex tests
  return { platform, suggestedType };
}
```
User Intervention: Provide additional mappings later (optional).

### Step 3: Unfurl Utility (Client)
Objective: Extract metadata (title, description, image) best-effort.
Actions:
1. Create `unfurl.ts` using `fetch(url)` (risk: CORS).
2. If fetch fails, return `{ unfurlStatus:'error', errorReason:'fetch' }`.
3. Parse text, create DOM via `DOMParser`, read `<meta property="og:title">`, fallback to `<title>`.
4. Return partial object.
Pseudocode:
```
async function unfurl(url){
  try {
    const res = await fetch(url, { mode:'cors'}); // may fail
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html,'text/html');
    const get = sel => doc.querySelector(sel)?.getAttribute('content');
    const ogTitle = get('meta[property="og:title"]');
    return {
      title: ogTitle || doc.querySelector('title')?.textContent?.trim(),
      description: get('meta[property="og:description"]') || undefined,
      thumbnailUrl: get('meta[property="og:image"]') || undefined,
      unfurlStatus: 'ok',
      sourceMeta: { /* optional raw subset */ }
    };
  } catch(e){
    return { unfurlStatus:'error', errorReason:e.name || 'unknown' };
  }
}
```
User Intervention: None (optionally supply CORS proxy later).

### Step 4: URL Intake Form Component
Objective: Provide single-field low-friction entry + optional overrides.
Actions:
1. Component with: URL <input>, Type quick-select dropdown (default suggestion), optional tag adder chip input.
2. On submit (Enter key or button):
   - Validate URL (try/catch new URL).
   - Duplicate check via store.exists.
   - Create temporary content object with `unfurlStatus:'pending'`.
   - Insert (optimistic).
   - Kick off `unfurl(url)`; when done update store.
3. Allow type override before or after submit (updates record).
Pseudocode:
```
function handleSubmit(){
  if(!isValid(url) || store.exists(url)) return;
  const { platform, suggestedType } = platformDetector(url);
  const id = nanoid();
  store.add({ id, url, platform, type: manualType||suggestedType, dateAdded: new Date().toISOString(), unfurlStatus:'pending' });
  unfurl(url).then(data => store.update(id, data));
}
```
User Intervention: Provide design tweaks (styling) if desired.

### Step 5: Content List & Card
Objective: Display items with live update & inline edits.
Actions:
1. `ContentList` subscribes to store; re-renders on change.
2. `ContentCard` shows thumbnail (or placeholder), title (or domain), platform badge, type pill (editable dropdown), status icon (spinner / error / ok), tags (editable inline text entry -> split by commas / Enter).
3. Inline edits call `store.update`.
Pseudocode:
```
useEffect(()=> store.subscribe(setItems),[]);

function ContentCard({item}){
  return <div>
    <img src={item.thumbnailUrl||placeholder(item.platform)} />
    <EditableText value={item.title || item.platform} />
    <TypeSelect value={item.type} onChange={t=>store.update(item.id,{type:t})} />
    {item.unfurlStatus==='pending' && <Spinner/>}
    {item.unfurlStatus==='error' && <ErrorIcon title={item.errorReason}/>} 
  </div>
}
```
User Intervention: Provide branding assets (optional).

### Step 6: Duplicate Handling & Highlight
Objective: Prevent accidental duplicates.
Actions:
1. On intake duplicate, flash existing card (scroll into view).
2. Provide non-blocking toast.
Pseudocode:
```
if(store.exists(url)){ highlight(url); showToast('Already added'); return; }
```
User Intervention: None (may refine messaging).

### Step 7: Persistence & Migration Guard
Objective: Ensure forward compatibility as schema evolves.
Actions:
1. Store a `schemaVersion` alongside array in LocalStorage.
2. On load, if version mismatch, run lightweight transform (e.g., add missing fields with defaults).
Pseudocode:
```
const CURRENT=1;
function load(){
  const raw = JSON.parse(localStorage.getItem('contentPayload')||'{}');
  if(raw.version !== CURRENT){ migrate(raw); }
  items = raw.items||[];
}
```
User Intervention: Increment version when changing structure.

### Step 8: Minimal Styling (Tailwind)
Objective: Provide clean, accessible UI.
Actions:
1. Utility-first: focus on spacing, readable typography, focus outline.
2. Status badges: pending (animate-pulse), error (red), ok (neutral).
3. Dark mode compatibility (inherit existing tokens).
User Intervention: Approve palette / spacing scale (optional).

### Step 9: Lightweight Telemetry (Console)
Objective: Gather dev insights (not production analytics yet).
Actions:
1. Wrap `unfurl` to measure duration.
2. Log overrides (type changed from suggestion).
Pseudocode:
```
const t0 = performance.now();
const result = await unfurl(url);
console.log('unfurl_ms', performance.now()-t0, result.unfurlStatus);
if(result.typeChanged) console.log('type_override', url);
```
User Intervention: None.

## Rollout / Phases
Phase 1 (Steps 1-5): Core functional path.
Phase 2 (6-7): Robustness & persistence improvements.
Phase 3 (8-9): Polish & instrumentation.

## Testing Strategy
- Unit: platformDetector inputs → expected platform/type.
- Unit: store add/update/exist behaviors.
- Integration: simulate paste → optimistic insert → unfurl resolves.
- Manual: Try blocked CORS URL -> ensure fallback state.

## Open Questions (Flagged for Later)
- Multi-user architecture (auth) timeline?
- Server proxy necessity threshold? (Measure CORS failure rate first.)
- Tag suggestion / auto-complete scope.

## Acceptance Criteria (MVP)
- Pasting a valid URL + Enter adds a card immediately with pending state.
- 70%+ of mainstream links (YouTube, Medium, Dev.to, GitHub, Twitter/X, LinkedIn) get a title populated.
- Duplicate URLs are not added twice.
- User can override type pre- or post-add.
- Data persists across page reloads.

---
Generated via internal spec prompt. Ready for implementation.
