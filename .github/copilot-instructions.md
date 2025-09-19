# Quotation Management System

The Quotation Management System is a Next.js 15.1.0 web application with TypeScript that provides comprehensive quotation and product management functionality. It includes user authentication (NextAuth with Google OAuth and credentials), role-based access control, and a MySQL database with Prisma ORM.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Environment Setup
1. **Node.js and npm**: Ensure Node.js v20.19.5+ and npm v10.8.2+ are available
2. **Install dependencies**: `npm install --ignore-scripts` -- takes 60-90 seconds, NEVER CANCEL. Set timeout to 120+ seconds.
   - NOTE: Use `--ignore-scripts` to avoid Prisma engine download failures due to network restrictions
3. **Manual Prisma setup** (required after npm install):
   ```bash
   npx prisma generate
   ```
   - This may fail in restricted environments. Document the failure and continue.

### Environment Variables Required
Create a `.env` file with these required variables:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/quotation_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email/SMTP (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="your-email@gmail.com"

# JWT
JWT_SECRET="your-jwt-secret"
```

### Build and Development Commands
- **Lint**: `npm run lint` -- takes 3-5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
  - Returns warnings about `<img>` vs `<Image>` usage but succeeds
- **Build**: `npm run build` -- FAILS without database connection. Set timeout to 300+ seconds.
  - Requires `prisma generate && next build`
  - Will fail if DATABASE_URL is not accessible
- **Development server**: `npm run dev` -- starts in 1-2 seconds with Turbopack
  - Server starts on http://localhost:3000
  - Returns 500 errors without proper database setup
  - Shows warning about invalid `cookies` config in next.config.ts (safe to ignore)

### Database Setup (Required for Full Functionality)
1. **MySQL database** required (see DATABASE_URL in schema.prisma)
2. **Run migrations**: `npx prisma migrate dev`
3. **Seed database**: `npx prisma db seed`
   - Uses faker.js to generate realistic test data
   - Creates admin user: admin@sridharan.com / admin123
   - Creates 10 test users, categories, products, and quotations

## Validation

### Manual Testing Scenarios
When making changes, ALWAYS test these complete user workflows:

1. **Authentication Flow**:
   - Navigate to `/login`
   - Test credentials login with admin@sridharan.com / admin123
   - Test Google OAuth if configured
   - Verify role-based redirects (admin → /admin, user → /dashboard)

2. **Product Management**:
   - Navigate to `/products`
   - Test product search and filtering by category/status
   - Create/edit/delete products via admin interface
   - Verify product images and stock levels display correctly

3. **Quotation Workflow**:
   - Navigate to `/quotations`
   - Create new quotation with multiple items
   - Test status changes (DRAFT → PENDING → APPROVED)
   - Generate and download PDF quotation
   - Verify email notifications (if SMTP configured)

4. **Role-Based Access**:
   - Test admin access to `/admin` routes
   - Test manager access restrictions
   - Verify regular user limitations

### Build Validation Requirements
- ALWAYS run `npm run lint` before committing -- takes 3-5 seconds
- The application CANNOT be fully built without database access
- Development server starts but needs database for functional testing
- PDF generation requires backend API calls to work properly

## Key Application Structure

### Frontend Pages and Routes
```
/                    # Landing page (app/page.jsx)
/login              # Authentication (app/login/page.tsx)
/dashboard          # User dashboard (redirects to /)
/products           # Product catalog
/quotations         # Quotation management
/admin              # Admin panel (ADMIN role required)
/profile            # User profile management
```

### API Endpoints
```
/api/auth/*         # NextAuth authentication
/api/products       # Product CRUD operations
/api/quotations     # Quotation management
/api/users          # User management
/api/categories     # Product categories
/api/dashboard      # Dashboard analytics
```

### Database Models (Prisma Schema)
- **User**: Authentication, roles (ADMIN/MANAGER/USER), profile data
- **Product**: Name, description, category, price, stock, SKU
- **Category**: Product categorization
- **Quotation**: Quote header with status workflow
- **QuotationItem**: Line items linking products to quotations
- **Activity**: Audit trail for quotation changes

## Development Guidelines

### Known Issues and Limitations
1. **Prisma Engine Downloads**: May fail in restricted network environments
   - Workaround: Use `npm install --ignore-scripts` then manually run `npx prisma generate`
   - Some features will be limited without database connectivity

2. **Build Dependencies**: Full build requires database connection
   - Development server starts without database but returns 500 errors
   - API routes fail without Prisma client initialization

3. **Image Optimization**: ESLint warnings about `<img>` vs `<Image />` usage
   - These are warnings, not errors, and don't prevent builds

### Performance Considerations
- **Turbopack**: Development server uses Next.js Turbopack for faster builds
- **Database Queries**: Prisma ORM with MySQL includes query logging
- **Session Management**: JWT-based sessions with 30-day expiration

### Security Features
- **Role-based middleware**: Protects admin and manager routes
- **Password hashing**: bcrypt for credential storage
- **CSRF protection**: NextAuth handles token validation
- **Environment isolation**: Separate configs for development/production

## Common Commands Reference

### Development Workflow
```bash
# Start development (most common)
npm run dev                    # 1-2 seconds

# Linting (always run before commits)
npm run lint                   # 3-5 seconds

# Database operations (when available)
npx prisma migrate dev         # Apply schema changes
npx prisma generate           # Regenerate client
npx prisma studio             # GUI database browser

# Production build (requires database)
npm run build                 # 60+ seconds if successful
npm start                     # Start production server
```

### File Structure Quick Reference
```
app/
├── api/                      # API routes
├── components/               # React components
├── dashboard/               # Dashboard pages
├── login/                   # Authentication pages
├── quotations/              # Quotation management
├── products/                # Product catalog
└── globals.css             # Global styles

lib/
├── auth.ts                  # NextAuth configuration
├── prisma.ts                # Database client
└── utils.ts                 # Utility functions

prisma/
├── schema.prisma            # Database schema
├── migrations/              # Database migrations
└── seed.ts                  # Test data seeding
```

## Troubleshooting

### Common Error Patterns
1. **"PrismaClient is unable to connect"**: Check DATABASE_URL and database status
2. **"Failed to download Prisma engines"**: Network restriction, use --ignore-scripts
3. **"NextAuth configuration error"**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL
4. **500 Internal Server Error**: Usually database connectivity or missing environment variables

### Performance Timeouts
- **NEVER CANCEL**: npm install (60-90s), build operations (300s+), or database operations
- **Development startup**: Allow 5-10 seconds for Turbopack initialization
- **Database seeding**: Allow 30-60 seconds for complete data generation
- **PDF generation**: Allow 10-15 seconds for complex quotations

ALWAYS test end-to-end user scenarios after making changes to ensure the quotation workflow remains functional.