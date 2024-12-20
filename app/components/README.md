# Components Directory

This directory contains all React components used throughout the application.

## Structure

- `layouts/` - Layout components used to structure pages
- `ui/` - Reusable UI components
- `forms/` - Form-related components
- `shared/` - Shared components used across multiple features

## Best Practices

1. Use TypeScript for all component definitions
2. Include prop type definitions
3. Use "use client" directive for client components
4. Keep components focused and maintainable

## Usage

Import components using the following pattern:
```typescript
import { ComponentName } from "@/components/path/to/component";
```