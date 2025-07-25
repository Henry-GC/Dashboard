# AnonymousPC Dashboard - AI Coding Guide

## Architecture Overview

This is a **Next.j### Integration Points

### External Dependencies
- **shadcn/ui**: Component library with Radix UI primitives
- **Formik + Yup**: Form handling and validation
- **Lucide React**: Icon system
- **Axios**: HTTP client with credentials enabled

### Component Dependencies
- All dashboard pages load their own data via direct API calls
- Components are fully independent and self-contained
- No shared state between components (except UI interactions)rd application** for AnonymousPC, an e-commerce PC components business. The app follows a **shadcn/ui + Tailwind CSS** design system with a **sidebar-based dashboard layout**.

### Key Structure
- **Dashboard Layout**: All dashboard pages are wrapped in `src/app/dashboard/layout.tsx` with sidebar + context providers
- **Module Organization**: Four main modules: `productos`, `ordenes`, `ensambles`, `registros` (each with dedicated types)
- **Context Pattern**: Global `ProductContext` manages product state across components
- **API Integration**: Centralized axios config in `src/lib/axios-config.ts` with `baseURL` and `withCredentials: true`

## Development Patterns

### Component Structure
- **UI Components**: Located in `src/components/ui/` (shadcn/ui components)
- **Business Components**: Module-specific components (e.g., `ProductTable.tsx`, `OrdersTable.tsx`)
- **Modals**: Separate modal components for CRUD operations (`ProductModal.tsx`, `EditProductModal.tsx`)
- **Chat Assistant**: Right-side drawer with virtual assistant (`ChatDrawer.tsx`) accessible via floating button

### Data Flow
```
API ← axios-config ← Local Component State ← Dashboard Layout ← Page Components
```

### State Management
- **Local State**: Each component manages its own data with useState and useEffect
- **API Calls**: Direct axios calls when components mount or need data refresh
- **No Global Context**: Removed Context API to avoid unnecessary data loading and re-renders
- **Toast Notifications**: Using `sonner` for user feedback

## Critical Developer Commands

```bash
# Development server
npm run dev           # Starts on localhost:3000

# Linting and building
npm run lint         # ESLint with Next.js config
npm run build        # Production build
npm start           # Production server
```

## Project-Specific Conventions

### File Naming
- **Types**: Always define in `types.ts` files within each module
- **Table Components**: Named `[Module]Table.tsx` (e.g., `ProductTable.tsx`, `EnsamblesTable.tsx`)
- **Modals**: Use descriptive names (`EditProductModal.tsx`, `ProductModal.tsx`, `BuildModal.tsx`)
- **Form Handling**: All forms use Formik + Yup validation with consistent error styling

### Data Types Pattern
```typescript
// Products have category mapping via CATEGORY_MAP constant
export type Product = {
  id: string;
  name: string;
  price: number | string;
  stock: number;
  category_id: number;  // Maps to CATEGORY_MAP
  relevant: boolean;
}

// Builds (ensambles) have components with product references
export type Build = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  img_url?: string;
  relevant: boolean;
  components: BuildComponent[];
}
```

### API Patterns
- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` (defaults to `localhost:5000`)
- **Endpoints**: Follow `/adm/[module]/[action]` pattern (`/adm/products`, `/adm/builds`)
- **CRUD Operations**: Standard REST patterns (`create`, `update/${id}`, `delete/${id}`)
- **Error Handling**: Try-catch with user-friendly alerts and console logging
- **Components Relationships**: Builds contain product references via `components` array

### UI Patterns
- **Theme Support**: Dark/light mode via `next-themes` (ThemeProvider in root layout)
- **Component Variants**: Uses `class-variance-authority` for button/component variants
- **Styling**: `cn()` utility for conditional Tailwind classes (combines `clsx` + `tailwind-merge`)

### Navigation
- **Sidebar**: Defined in `app-sidebar.tsx` with active state detection via `usePathname()`
- **Routing**: App Router with nested layouts (`dashboard/layout.tsx` wraps all dashboard routes)

## Integration Points

### External Dependencies
- **shadcn/ui**: Component library with Radix UI primitives
- **Formik + Yup**: Form handling and validation
- **Lucide React**: Icon system
- **Axios**: HTTP client with credentials enabled

### Context Dependencies
- All dashboard pages must be wrapped in `ProductProvider` and `BuildProvider` (handled by dashboard layout)
- `useProductContext()` provides products array and refresh functionality
- `useBuildContext()` provides builds array and refresh functionality

## Key Files for Understanding
- `src/app/dashboard/layout.tsx` - Dashboard wrapper with sidebar and chat integration
- `src/components/app-sidebar.tsx` - Navigation structure and active states
- `src/components/ChatDrawer.tsx` - Virtual assistant chat drawer
- `src/lib/axios-config.ts` - API configuration
- `components.json` - shadcn/ui configuration
