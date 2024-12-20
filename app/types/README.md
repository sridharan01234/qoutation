# Types Directory

This directory contains shared TypeScript type definitions used throughout the application.

## Organization

- `models/` - Type definitions for data models
- `api/` - API request and response types
- `utils/` - Utility and helper types

## Best Practices

1. Keep types focused and single-purpose
2. Use descriptive names
3. Document complex types with JSDoc comments
4. Use TypeScript strict mode

## Usage

Import types using the following pattern:
```typescript
import type { ModelType } from "@/types/models";
import type { ApiResponse } from "@/types/api";
```