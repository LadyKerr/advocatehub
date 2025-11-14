# Search Feature Documentation

## Overview

The search feature allows users to quickly find content across their AdvocateHub collection by searching through multiple fields simultaneously. It provides intelligent matching and highlighting to help users locate specific content items efficiently.

## Features

### 🔍 **Multi-Field Search**
Search works across the following content fields:
- **Title** - Primary content title from unfurled metadata
- **Description** - Content description/summary 
- **Tags** - User-added tags for categorization
- **Platform** - Content platform (YouTube, Dev.to, Medium, etc.)
- **Content Type** - Blog, video, social, workshop, demo, etc.

### 💡 **Smart Search Logic**
- **Partial Matching**: Search terms don't need to be complete words
- **Word Boundary Matching**: Search terms match the beginning of words
- **Multi-term Search**: All search terms must match somewhere in the content
- **Case Insensitive**: Searches work regardless of capitalization
- **Accent Insensitive**: Handles accented characters properly

### ✨ **Visual Highlighting**
- Search terms are highlighted in yellow across all displayed content
- Highlighting works in titles, descriptions, platforms, and tags
- Uses accessible color contrast for readability

### 🎯 **Search Integration**
- **Combined with Filtering**: Search works alongside content type filters
- **Real-time Results**: Search results update as you type
- **Clear Search**: Easy one-click search clearing
- **Empty State Handling**: Helpful messages when no results are found

## Implementation

### Components

#### `SearchBar.tsx`
```tsx
interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}
```
- Clean, accessible search input with search/clear icons
- Responsive design with focus states
- Integrates with existing design system

#### `searchUtils.ts`
Core search functionality:
- `searchContentItems(items, query)` - Main search function
- `highlightSearchTerms(text, query)` - Text highlighting
- `getSearchSuggestions(items)` - Future feature for autocomplete

### Usage Examples

#### Basic Text Search
```
"react"           → Finds content with "react" in any field
"javascript tips" → Finds content containing both "javascript" AND "tips"
"dev.to"          → Finds all content from the dev.to platform
```

#### Content Type Search
```
"video"      → Finds all video content
"blog post"  → Finds blog-type content mentioning "post"
"workshop"   → Finds workshop content
```

#### Tag Search
```
"tutorial"     → Finds content tagged with "tutorial"
"webdev css"   → Finds content with both "webdev" and "css" tags/content
```

#### Platform Search
```
"youtube"   → Finds all YouTube content
"medium"    → Finds all Medium articles
"github"    → Finds all GitHub-related content
```

## Technical Details

### Search Algorithm
1. **Normalization**: Converts text to lowercase, removes accents, normalizes whitespace
2. **Term Splitting**: Splits search query into individual terms
3. **Field Assembly**: Combines all searchable fields into one text block per item
4. **Matching**: Each search term must match somewhere in the assembled text
5. **Filtering**: Returns only items where ALL terms match

### Performance Considerations
- Search is performed on the client-side for instant results
- Uses `useMemo` to prevent unnecessary re-computations
- Efficient string matching with early termination
- Scales well with typical content collections (hundreds of items)

### Accessibility
- Proper ARIA labels on search input
- Keyboard navigation support
- High contrast highlighting
- Screen reader friendly empty states

## Integration Points

### ContentList Component
- Search bar positioned above content filters
- Combined search + filter logic in `useMemo`
- Passes search query to ContentCard for highlighting

### ContentCard Component
- `HighlightedText` helper component for search term highlighting
- Highlights terms in titles, descriptions, platforms, and tags
- Uses `dangerouslySetInnerHTML` safely for highlighting markup

### ContentStore
- No changes needed - search works with existing data structure
- Future enhancement: Could add search indexing for larger datasets

## CSS Styling

### Search Bar Styles
```css
/* Clean, modern search input */
.search-input {
  @apply block w-full pl-10 pr-10 py-3 border border-surface-subtle rounded-lg bg-white;
  @apply focus:ring-2 focus:ring-brand focus:border-transparent;
}
```

### Highlight Styles
```css
/* Search term highlighting */
mark {
  background-color: #fef08a; /* Yellow-200 */
  color: #78716c;            /* Stone-500 */
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 500;
}
```

## Future Enhancements

### Planned Features
- **Search Suggestions**: Autocomplete based on existing content
- **Search History**: Remember recent searches
- **Advanced Filters**: Date ranges, specific field targeting
- **Saved Searches**: Bookmark frequently used search queries
- **Search Analytics**: Track most searched terms

### Potential Improvements
- **Fuzzy Matching**: Handle typos and approximate matches
- **Search Indexing**: For larger datasets (1000+ items)
- **Keyboard Shortcuts**: Quick search activation (Ctrl+K)
- **Regular Expressions**: Advanced pattern matching

## Usage Instructions

1. **Basic Search**: Type any text in the search bar to find matching content
2. **Combined Search**: Use search alongside content type filters for precise results
3. **Clear Search**: Click the X icon or clear the input to show all content
4. **Multi-word Search**: Space-separated terms all must match (AND logic)

## Troubleshooting

### No Results Found
- Check spelling of search terms
- Try broader search terms
- Clear any active content type filters
- Verify content exists in your collection

### Search Not Working
- Refresh the page to reload content
- Check browser console for JavaScript errors
- Ensure content has been properly loaded

## Performance Notes

- Search is optimized for collections up to 1000 items
- Highlighting uses efficient DOM manipulation
- No server requests needed - all client-side
- Results update in real-time as you type