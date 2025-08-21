# AdvocateHub - GitHub Copilot Instructions

## Project Overview
AdvocateHub is a content tracking tool for developer advocates built with Astro + React + TypeScript. It allows users to capture URLs, unfurl metadata, and organize content (blogs, videos, workshops) with tagging and categorization.

## Architecture Patterns

### Content Management System
- **State Management**: Custom reactive store in `src/libs/content/contentStore.ts` using pub/sub pattern with localStorage persistence
- **Data Flow**: URL → Platform Detection → API Unfurl → Content Store → UI Components
- **Core Types**: All content types defined in `src/libs/content/types.ts` - use `ContentItem` interface for all content operations

### Libs-Based Organization
```
src/libs/
├── content/          # Content management domain
│   ├── contentStore.ts     # Reactive state store
│   ├── platformDetector.ts # URL → platform mapping
│   ├── unfurl.ts          # Client-side unfurl service
│   └── components/        # Content UI components
└── ui/               # Reusable UI components
    ├── blocks/       # Page-level sections
    └── components/   # Atomic components
```

### Platform Detection Strategy
The `platformDetector.ts` uses hostname pattern matching to auto-suggest content types:
- YouTube/Twitch → `video`
- Medium/Dev.to → `blog` 
- GitHub → `demo` or `other`
- Twitter/LinkedIn → `social`

## Development Workflows

### Key Commands
- `npm run dev` - Starts dev server at localhost:4322 (not 4321)
- `npm run build` - Production build with minification
- `npm run preview` - Preview production build

### Content Feature Development
1. **Adding new platforms**: Update `platformDetector.ts` with hostname patterns
2. **Content types**: Extend `ContentType` union in `types.ts`
3. **Store operations**: Use `add()`, `update()`, `remove()` from contentStore
4. **View modes**: Components support `viewMode` prop for grid/list layouts

### API Integration
- **Unfurl endpoint**: `/src/pages/api/unfurl.ts` handles URL metadata extraction
- **CORS handling**: Server-side unfurling prevents client CORS issues
- **Error states**: Use `unfurlStatus: 'pending' | 'ok' | 'error'` pattern

## Styling System

### Design Tokens (CSS Variables)
```css
--color-bg: #ffffff
--color-bg-alt: #F2F5F9  
--color-text: #1F2A33
--color-accent: #7C5CFC
```

### Tailwind Extensions
- **Brand colors**: `brand` (violet), `brand-soft`, `brand-fg`
- **Surface colors**: `surface`, `surface-alt`, `surface-subtle`
- **Pastel palette**: `pastel-mint`, `pastel-sky`, `pastel-lavender`
- **Typography**: Custom `h1`, `h2`, `p` sizes with mobile variants

### Component Patterns
- **Cards**: Use `card-base` class for consistent elevation
- **Status indicators**: `status-dot` with color mapping via `statusColors`
- **Grid layouts**: Responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## State Management Conventions

### ContentStore Usage
```typescript
import { subscribe, load, add, update } from '@libs/content/contentStore';

// Always load on component mount
React.useEffect(() => {
  load();
  const unsub = subscribe(setItems);
  return () => unsub();
}, []);
```

### Content Operations
- **Adding content**: Use `add()` with platform detection
- **Updating**: Use `update(id, partialItem)` for modifications
- **Real-time updates**: Store automatically persists and notifies subscribers

## Integration Points

### Astro-React Boundary
- **Client directives**: Use `client:load` for interactive components
- **SSR safety**: Always check `typeof window !== 'undefined'` in stores
- **Component exports**: Export from `index.ts` files for clean imports

### API Route Patterns
- **Astro API routes**: Use `APIRoute` type in `/src/pages/api/`
- **Error responses**: Return JSON with `unfurlStatus: 'error'` pattern
- **Performance logging**: Include timing logs for debugging

## Component Architecture

### View Mode Support
Components should support dual layouts:
```typescript
interface Props {
  viewMode?: 'grid' | 'list';
}
// Grid: aspect-video thumbnails, vertical layout
// List: horizontal layout with small thumbnails
```

### Unfurl Status Handling
Always handle three states: `pending` (with spinner), `ok`, `error` (with reason)

## Critical Files to Understand
- `src/libs/content/contentStore.ts` - Central state management
- `src/libs/content/types.ts` - Core type definitions  
- `src/pages/api/unfurl.ts` - Metadata extraction service
- `tailwind.config.js` - Design system configuration
- `src/layouts/global.css` - CSS variables and base styles
