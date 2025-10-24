# Skeleton Loading System

This project includes a comprehensive skeleton loading system with shimmer effects and granular loading state management.

## Components

### Skeleton Component

A reusable skeleton loader with shimmer animation effect.

**Props:**
- `className?: string` - Additional CSS classes
- `variant?: "text" | "circular" | "rectangular"` - Skeleton shape variant (default: "rectangular")
- `width?: string` - Custom width
- `height?: string` - Custom height

**Example:**
```tsx
import { Skeleton } from "@libs/ui/components/Skeleton";

<Skeleton className="w-12 h-12 mb-4" variant="rectangular" />
<Skeleton className="h-4 w-full" variant="text" />
```

## Loading Context

The LoadingProvider and useLoading hook enable centralized loading state management across your application.

### LoadingProvider

Wrap your application or specific sections with LoadingProvider to enable loading state management.

**Example:**
```tsx
import { LoadingProvider } from "@libs/ui/contexts/LoadingContext";

function App() {
    return (
        <LoadingProvider>
            <YourComponents />
        </LoadingProvider>
    );
}
```

### useLoading Hook

The `useLoading` hook provides access to loading states and control functions.

**Parameters:**
- `componentKey?: string` - Optional component identifier for granular control

**Returns:**
```typescript
{
    isLoading: boolean;                                    // Current loading state
    setLoading: (loading: boolean) => void;                // Set loading state
    setGlobalLoading: (loading: boolean) => void;          // Set global loading
    isGlobalLoading: boolean;                              // Global loading state
    setComponentLoading: (key: string, loading: boolean) => void;  // Set specific component loading
    isComponentLoading: (key: string) => boolean;          // Check specific component loading
}
```

## Usage Examples

### Basic Component Loading

```tsx
import { useLoading } from "@libs/ui/contexts/LoadingContext";

function MyComponent() {
    const { isLoading, setLoading } = useLoading("myComponent");
    
    useEffect(() => {
        setLoading(true);
        fetchData().finally(() => setLoading(false));
    }, []);
    
    if (isLoading) return <Skeleton />;
    return <div>Content</div>;
}
```

### Using with Built-in Components

The Features, Structure, and TechStack components support both prop-based and context-based loading:

```tsx
// Using prop (works without LoadingProvider)
<Features 
    isLoading={true}
    title="Features"
    features={[...]}
/>

// Using context (requires LoadingProvider)
<LoadingProvider>
    <Features 
        loadingKey="features"
        title="Features"
        features={[...]}
    />
</LoadingProvider>
```

### Global Loading Control

```tsx
function App() {
    const { setGlobalLoading } = useLoading();
    
    const handleRefresh = async () => {
        setGlobalLoading(true);
        await refreshAllData();
        setGlobalLoading(false);
    };
    
    return (
        <LoadingProvider>
            <button onClick={handleRefresh}>Refresh All</button>
            <Features loadingKey="features" {...props} />
            <Structure loadingKey="structure" {...props} />
            <TechStack loadingKey="techstack" {...props} />
        </LoadingProvider>
    );
}
```

### Independent Component Loading

```tsx
function Dashboard() {
    const { setComponentLoading } = useLoading();
    
    const loadFeatures = async () => {
        setComponentLoading('features', true);
        await fetchFeatures();
        setComponentLoading('features', false);
    };
    
    const loadStructure = async () => {
        setComponentLoading('structure', true);
        await fetchStructure();
        setComponentLoading('structure', false);
    };
    
    return (
        <LoadingProvider>
            <Features loadingKey="features" {...props} />
            <Structure loadingKey="structure" {...props} />
        </LoadingProvider>
    );
}
```

## Component Props

### Features Component
- `title: string` - Section title
- `description: string` - Section description
- `features: Feature[]` - Array of features
- `isLoading?: boolean` - Manual loading control (optional)
- `loadingKey?: string` - Context loading key (default: "features")

### Structure Component
- `items: FileItem[]` - File structure items
- `title?: string` - Section title
- `description?: string` - Section description
- `isLoading?: boolean` - Manual loading control (optional)
- `loadingKey?: string` - Context loading key (default: "structure")

### TechStack Component
- `technologies: TechItem[]` - Array of technologies
- `title?: string` - Section title
- `description?: string` - Section description
- `isLoading?: boolean` - Manual loading control (optional)
- `loadingKey?: string` - Context loading key (default: "techstack")

## Accessibility

All skeleton loaders include proper accessibility attributes:
- `aria-busy="true"` - Indicates loading state
- `aria-live="polite"` - Announces loading changes to screen readers
- `aria-label="Loading content"` - Describes the loading element

## Animations

The shimmer effect is powered by Tailwind CSS animations:
- `animate-shimmer` - 2s infinite gradient animation
- Smooth opacity transitions when content loads
- 300ms transition duration for smooth state changes

## Demo

To see the loading system in action, use the LoadingDemo component:

```tsx
import { LoadingDemo } from "@libs/ui/components/LoadingDemo";

<LoadingDemo />
```

This demo includes interactive controls to toggle loading states for each component independently.
