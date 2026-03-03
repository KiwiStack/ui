# CLAUDE.md — Kiwi UI Development Rules

> Rules for AI-assisted development of the kiwi-ui monorepo.
> These rules are non-negotiable. When in doubt, re-read this file.

## Project Identity

This is **Kiwi UI** — the frontend of KiwiStack, a unified digital workplace platform.
It ships as two targets from one codebase:
- **kiwi-app**: Tauri 2.0 desktop application (Windows, macOS, Ubuntu)
- **kiwi-web**: SvelteKit web application (future)

## The Golden Rule

**All UI components and business logic live in `packages/core/`.** Never put UI code in `apps/kiwi-app/` or `apps/kiwi-web/`. The apps are thin shells that wire adapters to the shared core.

## Architecture Rules

### 1. Adapter Pattern Is Mandatory

Frontend code **never** calls `invoke()` or `fetch()` directly. All communication with backend services goes through service interfaces defined in `packages/core/services/`.

```
✅ import { getMailService } from '$lib/services'
   const results = await getMailService().search("hello")

❌ import { invoke } from '@tauri-apps/api/core'
   const results = await invoke('mail_search', { query: "hello" })

❌ const results = await fetch('/api/v1/mail/search', ...)
```

### 2. Adapters Are Thin

Each adapter file should be **under 50 lines**. An adapter does one thing: translate a service interface call into either an `invoke()` (Tauri) or `fetch()` (web) call. No business logic, no data transformation, no error handling beyond basic mapping.

### 3. No Tauri Imports in Core

The `packages/core/` directory must have **zero imports** from `@tauri-apps/*`. If a component needs platform-specific behavior, it goes through a service interface.

### 4. No Direct HTTP in Core

The `packages/core/` directory must have **zero `fetch()` calls** to KiwiStack APIs. All network access is abstracted behind service interfaces.

## Component Rules

### 5. Svelte 5 Only

Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for all reactivity. No Svelte 4 stores (`writable`, `readable`) in new code.

### 6. CSS Variables for Theming

Use CSS custom properties defined in `packages/core/styles/tokens.css` for all colors, spacing, and typography. No hardcoded color values in components. The dark theme shown in the mockups is the default — support light theme via CSS variable overrides.

### 7. No Heavy UI Frameworks

Do not add Tailwind CSS, Material UI, Chakra, or similar. Style with CSS variables and scoped Svelte `<style>` blocks. Keep the bundle small — this runs in a Tauri WebView.

### 8. Component Isolation

Each component gets its own file. Components in `packages/core/components/mail/` should not import from `packages/core/components/chat/`. Cross-service interaction goes through stores or service interfaces.

## Rust Rules (Tauri Backend)

### 9. Commands Are Proxies

Tauri commands in `apps/kiwi-app/src-tauri/src/commands/` are HTTP proxies to Kiwi Gate. They receive parameters from the frontend, forward them via `reqwest` to the Kiwi API, and return the response. No business logic in commands.

### 10. Credentials Stay in Rust

JWT tokens, API keys, and server URLs are stored and managed in the Rust backend. The frontend receives only the data it needs to render. Never pass raw tokens to the WebView.

### 11. Error Handling

Tauri commands return `Result<T, String>`. Map all `reqwest` errors to user-friendly messages. The frontend displays errors — it never silences them.

## API Contract

### 12. Follow Kiwi API Conventions

All requests to KiwiStack services follow the conventions defined in the architecture documentation:
- Base path: `/api/v1/{resource}`
- Auth: `Bearer <JWT>` in Authorization header
- Success: `{ "data": {...}, "meta": { "request_id": "...", "timestamp": "..." } }`
- Error: `{ "error": { "code": "NOT_FOUND", "message": "..." }, "meta": {...} }`

### 13. MCP Tool Naming

When calling Kiwi MCP tools, use the namespace convention: `{service}.{action}` (e.g., `mail.search`, `calendar.create_event`, `contacts.merge`). These match the tool names registered in Kiwi MCP.

## File Organization

### 14. Monorepo Discipline

```
packages/core/          → Shared UI + logic (imported by both apps)
packages/adapter-tauri/  → invoke() implementations only
packages/adapter-web/    → fetch() implementations only
apps/kiwi-app/          → Tauri shell + Rust backend only
apps/kiwi-web/          → SvelteKit routes + server hooks only
```

If you are about to create a file and are unsure where it goes: **it almost certainly belongs in `packages/core/`**.

### 15. Service Interface Files

Every service interface in `packages/core/services/` must:
- Export a TypeScript `interface` (e.g., `MailService`)
- Define all methods with full parameter and return types
- Import types from `./types.ts` — no inline type definitions
- Have a matching adapter file in both `adapter-tauri/` and `adapter-web/`

## What NOT to Do

- **Do not add localStorage or sessionStorage** — not supported in Tauri WebView
- **Do not add a database to the frontend** — persistence is server-side (Kiwi services) or Rust-side (future offline cache)
- **Do not SSR components** — kiwi-app is a SPA in a WebView, kiwi-web may use SSR later but core components must work without it
- **Do not add Node.js dependencies for crypto, fs, or network** — these don't exist in a WebView
- **Do not bypass the adapter pattern** "just for a quick test" — it creates tech debt that is painful to unwind

## Development Workflow

```bash
# Start desktop dev (Tauri + Svelte hot reload)
pnpm --filter kiwi-app tauri dev

# Build desktop app
pnpm --filter kiwi-app tauri build

# Start web dev (when kiwi-web exists)
pnpm --filter kiwi-web dev

# Type check everything
pnpm -r typecheck

# Lint
pnpm -r lint
```

## KiwiStack Context

Kiwi UI connects to these backend services through Kiwi Gate:

| Service | Namespace | Protocol | Phase |
|---------|-----------|----------|-------|
| Kiwi Mail | `mail.*`, `calendar.*`, `contacts.*` | JMAP (via wrapper) | 1 |
| Kiwi MCP | `tools.*` | MCP/SSE | 1 |
| Kiwi ID | auth | OAuth2/OIDC | 1 |
| Kiwi Chat | `chat.*` | Matrix CS API | 2 |
| Kiwi Meet | video/audio | LiveKit (WebRTC) | 2 |
| Kiwi Search | `search.*` | HTTP/JSON | 2 |
| Kiwi Work | `tasks.*`, `projects.*` | HTTP/JSON | 3 |
| Kiwi Docs | `docs.*` | HTTP/JSON + Loro CRDT | 3 |
| Kiwi Store | `files.*` | S3-compatible | 4 |
