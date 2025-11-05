# Code Editor Playground

A Next.js-based code playground application that provides an in-browser coding environment with AI assistance. Write, edit, and run code directly in your browser using WebContainers technology, with AI-powered code suggestions and chat assistance.

## Features

- 🚀 **In-Browser Code Execution** - Run code directly in the browser using WebContainers
- 📝 **Monaco Editor** - Full-featured code editor with syntax highlighting
- 🤖 **AI Assistance** - Get code suggestions and chat with an AI coding assistant
- 📁 **Multiple Templates** - Start with React, Vue, Next.js, Angular, Hono, or Express templates
- 💾 **Auto-Save** - Automatic file saving to database
- 🔐 **Authentication** - GitHub and Google OAuth integration
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5
- **Editor:** Monaco Editor
- **Runtime:** WebContainers API
- **AI:** Ollama (local)
- **UI:** Radix UI + Tailwind CSS
- **State Management:** Zustand

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **Ollama** (for AI features) - [Download here](https://ollama.ai/)

After installing Ollama, pull the required model:

```bash
ollama pull codellama:7b
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aneeshie/web-ide.git
cd code-editor
```

### 2. Install dependencies

```bash
npm/bun/pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database (Prisma Accelerate)
DATABASE_URL="your-postgresql-connection-string"

# NextAuth Configuration
AUTH_SECRET="your-auth-secret-key"
# Generate with: openssl rand -base64 32

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Setting up OAuth Providers

**GitHub OAuth:**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate a Client Secret

**Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 4. Set up the database

Generate Prisma client and push schema to database:

```bash
npx prisma generate
npx prisma db push
```

Optionally, open Prisma Studio to view your database:

```bash
npx prisma studio
```

### 5. Start Ollama (for AI features)

Make sure Ollama is running:

```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# If not running, start it
ollama serve
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
code-editor/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Public pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── playground/[id]/   # Code editor interface
├── components/            # Shared UI components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── ai/              # AI code suggestions
│   ├── ai-chat/         # AI chat assistant
│   ├── auth/            # Authentication logic
│   ├── dashboard/       # Dashboard components
│   ├── home/            # Landing page
│   ├── playground/      # Editor & file management
│   └── web-containers/  # WebContainer integration
├── lib/                  # Shared utilities
│   ├── generated/       # Prisma client output
│   ├── db.ts           # Database connection
│   └── template.ts     # Template mappings
├── prisma/              # Database schema
└── code-starters/       # Project templates
```

## How It Works

1. **Authentication**: Users sign in via GitHub or Google OAuth
2. **Create Playground**: Choose from pre-configured templates (React, Vue, etc.)
3. **Edit Code**: Use Monaco editor to modify files in a virtual file system
4. **Live Preview**: WebContainers run code in-browser and provide live preview
5. **AI Assistance**: Get code suggestions or ask questions to the AI chat
6. **Auto-Save**: Changes are automatically saved to PostgreSQL database

## Key Features Explained

### WebContainers

The app uses [@webcontainer/api](https://webcontainers.io/) to run Node.js directly in the browser. This enables full-stack development without a backend server. Note: Special COOP/COEP headers are configured in `next.config.ts` to enable SharedArrayBuffer.

### AI Integration

Two AI features powered by local Ollama instance:

- **Inline Suggestions**: Code completion within the editor
- **Chat Assistant**: Conversational AI for debugging and code explanations

### Template System

Pre-built project templates in `/code-starters/` directory are converted to JSON and stored in the database when creating a new playground.

## Troubleshooting

### WebContainer not loading

- Ensure your browser supports SharedArrayBuffer (Chrome/Edge 92+, Firefox 95+)
- Check that COOP/COEP headers are properly set in `next.config.ts`

### AI features not working

- Verify Ollama is running: `curl http://localhost:11434/api/version`
- Check if `codellama:7b` model is installed: `ollama list`

### Database connection issues

- Verify `DATABASE_URL` is correct in `.env`
- Run `npx prisma db push` to sync schema

### OAuth authentication errors

- Double-check callback URLs match in OAuth provider settings
- Ensure `AUTH_SECRET` is set in `.env`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
