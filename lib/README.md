# Library Directory

This directory contains core utilities and services used throughout the application.

## Structure

- `api/` - API-related utilities and types
- `auth/` - Authentication utilities
- `utils/` - General utility functions
- `db.ts` - Database configuration
- `prisma.ts` - Prisma client configuration

## Usage

Import utilities using the following pattern:
```typescript
import { utilityName } from "@/lib/utils";
import { apiFunction } from "@/lib/api";
```

## Best Practices

1. Keep utility functions pure and focused
2. Add proper JSDoc documentation for all exports
3. Use TypeScript for type safety
4. Write unit tests for critical functions