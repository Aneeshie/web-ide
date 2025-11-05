# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js-based code playground application that provides an in-browser coding environment with AI assistance. It uses WebContainers to run code directly in the browser, supports multiple project templates (React, Vue, Next.js, Angular, etc.), and includes an AI coding assistant powered by Ollama.

## Development Commands

### Running the Project
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Management
```bash
npx prisma generate  # Generate Prisma client to lib/generated/prisma
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio for database management
npx prisma migrate dev --name <migration-name>  # Create and apply new migration
```

### Environment Setup
The application requires these environment variables:
- `DATABASE_URL` - PostgreSQL connection string (uses Prisma Accelerate)
- `AUTH_SECRET` - NextAuth secret for session encryption
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

The AI chat feature requires Ollama running locally on port 11434 with the `codellama:7b` model.

## Architecture

### Feature-Based Structure
The codebase uses a feature-based architecture where each major feature has its own directory under `/features`:

- **`features/auth/`** - Authentication logic (NextAuth with GitHub/Google OAuth)
- **`features/playground/`** - Core editor functionality, file management, and playground state
- **`features/web-containers/`** - WebContainer integration for running code in-browser
- **`features/ai/`** - AI code suggestions and inline assistance
- **`features/ai-chat/`** - AI chat interface and code block rendering
- **`features/dashboard/`** - User dashboard and playground management
- **`features/home/`** - Landing page components

Each feature typically contains:
- `components/` - Feature-specific React components
- `hooks/` - Custom hooks for state management
- `actions/` - Server actions for data mutations
- `lib/` - Utility functions (if needed)

### Key Patterns

#### 1. Prisma Client Location
The Prisma client is generated to `lib/generated/prisma/client` (non-standard location). Always import from:
```typescript
import { PrismaClient } from "./lib/generated/prisma/client"
```

The database connection is configured with Prisma Accelerate in `lib/db.ts` with connection pooling and global instance caching.

#### 2. WebContainer Integration
The app uses `@webcontainer/api` to run project code entirely in the browser. Key flow:
- Templates are stored as JSON in the database (`TemplateFile` model)
- `use-web-container` hook initializes a WebContainer instance on playground load
- Files are synced to WebContainer's virtual filesystem using `writeFileSync`
- Changes in Monaco editor trigger saves that update both database and WebContainer

#### 3. File System State Management
File operations use Zustand store in `use-file-explorer.tsx`:
- `templateData` - The complete file tree structure (TemplateFolder type)
- `openFiles` - Array of currently open editor tabs
- `activeFileId` - Currently focused file in editor
- File CRUD operations update both the Zustand store and persist to database via `saveTemplateData`

#### 4. Authentication Flow
NextAuth with custom callbacks in `auth.ts`:
- On sign-in, checks if user exists; creates User + Account if new
- JWT strategy for sessions (not database sessions)
- User roles (USER, ADMIN, PRO_USER) stored in token and exposed in session
- Auth routes use route groups: `app/(auth)/auth/sign-in`

#### 5. AI Integration
Two AI features:
- **Inline suggestions** (`features/ai/`) - Code completion/suggestions within editor
- **Chat assistant** (`features/ai-chat/`) - Side panel with conversational AI using local Ollama instance at `localhost:11434`

The chat API (`app/api/chat/route.ts`) uses the `codellama:7b` model with streaming disabled and a 15-second timeout.

### Route Structure
- `app/(root)/` - Public landing pages
- `app/(auth)/auth/` - Authentication pages (sign-in)
- `app/dashboard/` - User dashboard with playground list
- `app/playground/[id]/` - Main code editor interface
- `app/api/` - API routes for chat, code suggestions, template loading

### Template System
Templates are predefined project starters stored in `/code-starters/`:
- Each template is a complete project structure
- Mapped in `lib/template.ts` (e.g., REACTJS → `/code-starters/react-ts`)
- Templates enum in Prisma schema matches these options
- When creating a playground, template is converted to JSON and stored in `TemplateFile.content`

### Cross-Origin Headers
The app requires special COOP/COEP headers (configured in `next.config.ts`) to enable SharedArrayBuffer for WebContainers:
```typescript
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## Important Conventions

1. **Path alias**: Use `@/*` for imports from project root (configured in `tsconfig.json`)
2. **UI components**: All shadcn/ui components live in `components/ui/`
3. **Server actions**: Use "use server" directive for mutations, placed in `actions/` within features
4. **Type safety**: TypeScript strict mode enabled; avoid `@ts-expect-error` when possible
5. **Toast notifications**: Use `sonner` library via `toast()` for user feedback
6. **File operations**: Always sync changes to both WebContainer and database when modifying playground files

## Testing
No test framework is currently configured. When adding tests, check if project uses Jest, Vitest, or other testing tools.
