# Kiwi UI — Project Architecture

> Desktop-first, web-ready. One codebase, two targets.

## Overview

Kiwi UI is the frontend layer of KiwiStack — a unified workplace platform. It ships as two artifacts built from a single codebase:

- **kiwi-app** — Desktop application (Windows, macOS, Ubuntu) built with Tauri 2.0
- **kiwi-web** — Web application served via browser, built with SvelteKit (developed later)

Both share 100% of their UI components and business logic. The only difference is how they communicate with the KiwiStack backend services.

## Core Principle: The Adapter Pattern

The frontend never talks directly to KiwiStack services. All communication goes through a **service abstraction layer** that has two implementations:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Shared (packages/core)                      │
│                                                                 │
│  Components ─── Stores ─── Services (interfaces)                │
│                                │                                │
│                    ┌───────────┴───────────┐                    │
│                    │                       │                     │
│              adapter-tauri           adapter-web                 │
│              invoke() → Rust         fetch() → HTTP             │
│                    │                       │                     │
└────────────────────┼───────────────────────┼────────────────────┘
                     │                       │
              Tauri Backend Rust       Direct HTTP
              (reqwest → Kiwi Gate)    (→ Kiwi Gate)
```

### How it works

**In kiwi-app (Tauri desktop):**

```
Svelte component
  → mail.search("quarterly report")
    → invoke("mail_search", { query: "quarterly report" })
      → [Tauri backend Rust] reqwest::post("https://kiwi.gate/api/v1/mail/search")
        → Kiwi Gate → Kiwi Mail (Stalwart)
```

`invoke()` is a local function call between the WebView and the Rust backend running inside the same application. No network involved at this step — credentials stay in Rust, never exposed in JS.

**In kiwi-web (browser):**

```
Svelte component
  → mail.search("quarterly report")
    → fetch("https://kiwi.example.com/api/v1/mail/search", { ... })
      → Kiwi Gate → Kiwi Mail (Stalwart)
```

`fetch()` is a standard HTTP request from the browser directly to Kiwi Gate over the network.

**The Svelte component is identical in both cases.** It imports from `core/services` and never knows which adapter is active.

## Repository Structure

```
kiwi-ui/
│
├── packages/
│   │
│   ├── core/                        # Shared code — the heart of the project
│   │   ├── components/              # All Svelte UI components
│   │   │   ├── shell/               # App shell: sidebar, titlebar, layout
│   │   │   ├── mail/                # Mail views: inbox, reader, composer
│   │   │   ├── calendar/            # Calendar views
│   │   │   ├── contacts/            # Contact views
│   │   │   ├── chat/                # Chat views (Phase 2)
│   │   │   ├── meet/                # Video call views (Phase 2)
│   │   │   ├── work/                # Kanban, tasks (Phase 3)
│   │   │   ├── docs/                # Document editor (Phase 3)
│   │   │   ├── store/               # File browser (Phase 4)
│   │   │   ├── search/              # Global search
│   │   │   └── assistant/           # AI Assistant panel (MCP client)
│   │   │
│   │   ├── services/                # Service interfaces (abstract)
│   │   │   ├── types.ts             # Shared types: Email, Event, Contact, etc.
│   │   │   ├── mail.ts              # MailService interface
│   │   │   ├── calendar.ts          # CalendarService interface
│   │   │   ├── contacts.ts          # ContactsService interface
│   │   │   ├── chat.ts              # ChatService interface (Phase 2)
│   │   │   ├── work.ts              # WorkService interface (Phase 3)
│   │   │   ├── docs.ts              # DocsService interface (Phase 3)
│   │   │   ├── search.ts            # SearchService interface
│   │   │   └── assistant.ts         # MCP/SSE client for AI Assistant
│   │   │
│   │   ├── stores/                  # Reactive state management (Svelte stores)
│   │   │   ├── auth.ts              # JWT token, user session
│   │   │   ├── mail.ts              # Inbox state, selected email, etc.
│   │   │   ├── navigation.ts        # Active service, active view
│   │   │   └── assistant.ts         # Chat history, pending actions
│   │   │
│   │   ├── styles/                  # Design system tokens (CSS variables)
│   │   │   ├── tokens.css           # Colors, spacing, typography
│   │   │   └── components.css       # Shared component styles
│   │   │
│   │   └── utils/                   # Shared utilities
│   │       ├── date.ts
│   │       └── format.ts
│   │
│   ├── adapter-tauri/               # Tauri-specific service implementations
│   │   ├── index.ts                 # Exports all services bound to invoke()
│   │   ├── mail.ts                  # invoke("mail_search", ...) etc.
│   │   ├── calendar.ts
│   │   ├── contacts.ts
│   │   └── auth.ts                  # Token stored securely in Rust keychain
│   │
│   └── adapter-web/                 # Web-specific service implementations
│       ├── index.ts                 # Exports all services bound to fetch()
│       ├── mail.ts                  # fetch("/api/v1/mail/search", ...) etc.
│       ├── calendar.ts
│       ├── contacts.ts
│       └── auth.ts                  # Token stored in httpOnly cookie
│
├── apps/
│   │
│   ├── kiwi-app/                    # Tauri desktop application
│   │   ├── src/                     # Svelte entry point (imports core + adapter-tauri)
│   │   │   ├── main.ts
│   │   │   └── App.svelte           # Shell wrapper with Tauri titlebar
│   │   ├── src-tauri/               # Rust backend
│   │   │   ├── src/
│   │   │   │   ├── main.rs          # Tauri setup + command registration
│   │   │   │   ├── commands/        # Tauri commands (one per service)
│   │   │   │   │   ├── mail.rs      # #[tauri::command] fn mail_search(...)
│   │   │   │   │   ├── calendar.rs
│   │   │   │   │   └── auth.rs
│   │   │   │   └── client.rs        # Shared reqwest client → Kiwi Gate
│   │   │   ├── Cargo.toml
│   │   │   ├── tauri.conf.json      # Tauri config (window, permissions)
│   │   │   └── capabilities/        # Tauri permission declarations
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── kiwi-web/                    # SvelteKit web application (Phase 5+)
│       ├── src/
│       │   ├── routes/              # SvelteKit routes
│       │   └── hooks.server.ts      # Auth middleware
│       ├── package.json
│       └── svelte.config.js
│
├── pnpm-workspace.yaml              # Monorepo workspace config
├── package.json                     # Root scripts (dev, build, lint)
├── turbo.json                       # Turborepo pipeline (optional)
└── CLAUDE.md                        # AI development rules
```

## Service Interface Example

Every service follows the same pattern — an interface in `core/`, with concrete implementations in each adapter.

### Interface (packages/core/services/mail.ts)

```typescript
import type { Email, Draft, SearchOpts } from './types'

export interface MailService {
  search(query: string, opts?: SearchOpts): Promise<Email[]>
  read(emailId: string): Promise<Email>
  send(draft: Draft): Promise<void>
  reply(emailId: string, body: string, replyAll?: boolean): Promise<void>
  archive(emailIds: string[]): Promise<void>
}
```

### Tauri adapter (packages/adapter-tauri/mail.ts)

```typescript
import { invoke } from '@tauri-apps/api/core'
import type { MailService } from '@kiwi/core/services/mail'

export const mail: MailService = {
  search: (query, opts) => invoke('mail_search', { query, ...opts }),
  read: (emailId) => invoke('mail_read', { emailId }),
  send: (draft) => invoke('mail_send', { draft }),
  reply: (emailId, body, replyAll) => invoke('mail_reply', { emailId, body, replyAll }),
  archive: (emailIds) => invoke('mail_archive', { emailIds }),
}
```

### Tauri Rust command (apps/kiwi-app/src-tauri/src/commands/mail.rs)

```rust
use crate::client::KiwiClient;

#[tauri::command]
pub async fn mail_search(
    client: tauri::State<'_, KiwiClient>,
    query: String,
    limit: Option<u32>,
) -> Result<serde_json::Value, String> {
    client
        .post("/api/v1/mail/search")
        .json(&serde_json::json!({ "query": query, "limit": limit }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())
}
```

### Web adapter (packages/adapter-web/mail.ts)

```typescript
import type { MailService } from '@kiwi/core/services/mail'

const BASE = '/api/v1'

export const mail: MailService = {
  search: (query, opts) =>
    fetch(`${BASE}/mail/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, ...opts }),
      credentials: 'include',
    }).then(r => r.json()).then(r => r.data),

  read: (emailId) =>
    fetch(`${BASE}/mail/${emailId}`, { credentials: 'include' })
      .then(r => r.json()).then(r => r.data),

  // ... same pattern for send, reply, archive
}
```

### Svelte component (packages/core/components/mail/InboxSearch.svelte)

```svelte
<script lang="ts">
  import { getMailService } from '$lib/services'

  const mail = getMailService()
  let query = ''
  let results: Email[] = []

  async function onSearch() {
    results = await mail.search(query, { limit: 20 })
  }
</script>

<!-- This component works identically in kiwi-app and kiwi-web -->
<input bind:value={query} on:keydown={(e) => e.key === 'Enter' && onSearch()} />
{#each results as email}
  <MailRow {email} />
{/each}
```

## Build Targets

| Target | Command | Output |
|--------|---------|--------|
| Desktop dev | `pnpm --filter kiwi-app tauri dev` | Live-reload Tauri window |
| Desktop build | `pnpm --filter kiwi-app tauri build` | .exe / .deb / .dmg |
| Web dev | `pnpm --filter kiwi-web dev` | localhost:5173 |
| Web build | `pnpm --filter kiwi-web build` | Static SvelteKit app |

## Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| UI framework | **Svelte 5** | No virtual DOM, tiny bundle, compiled reactivity, excellent DX |
| Desktop shell | **Tauri 2.0** | Rust backend, native WebView, ~5 MB app, cross-platform |
| Desktop backend | **Rust** (reqwest, serde, tauri) | Type-safe, secure credential handling |
| Web framework | **SvelteKit** | Same Svelte, with SSR/routing for web deployment |
| Monorepo | **pnpm workspaces** | Fast, disk-efficient, native workspace support |
| Styling | **CSS variables + utility classes** | Minimal, no Tailwind compiler dependency in Tauri |
| State | **Svelte stores** (runes in Svelte 5) | Built-in reactivity, no external state library needed |

## AI Assistant Integration

The AI Assistant panel is a standard Svelte component that acts as an **MCP client over SSE**. It connects to Kiwi MCP via the same adapter pattern:

- In **kiwi-app**: the Tauri backend opens an SSE connection to Kiwi MCP and forwards events to the frontend via Tauri events
- In **kiwi-web**: the browser opens an SSE connection directly to Kiwi Gate which proxies to Kiwi MCP

The assistant panel displays a chat interface. User messages are sent as MCP `tools/call` requests. The agent's tool invocations (e.g., `mail.search`, `calendar.create_event`) are rendered as action cards that the user can approve or edit before execution — exactly as shown in the KiwiStack homepage mockup.

## Phases

| Phase | Components in kiwi-ui | Depends on |
|-------|----------------------|------------|
| 1 | Shell, Mail, Calendar, Contacts, AI Assistant | Kiwi ID, Kiwi Mail, Kiwi MCP |
| 2 | Chat, Meet, Search | Kiwi Chat, Kiwi Meet, Kiwi Search |
| 3 | Work (kanban/tasks), Docs (collaborative editor) | Kiwi Work, Kiwi Docs, Kiwi Sync |
| 4 | Store (file browser) | Kiwi Store |
| 5 | kiwi-web (SvelteKit app) | All of the above |

## Design Decisions

### Why Tauri over Electron
Tauri uses the OS WebView instead of bundling Chromium. App size is ~5 MB vs ~150 MB. RAM usage is ~50 MB vs ~300 MB. Since KiwiStack may run multiple services on the same machine, resource efficiency matters.

### Why Svelte over React
Svelte compiles to minimal JS with no runtime. For a desktop app where every KB of JS runs inside a WebView, this matters. Svelte's reactivity model (runes in v5) eliminates the need for external state management. The learning curve is gentler than React's hooks + context + reducers.

### Why not full Rust frontend (Leptos, Dioxus)
Building a rich mail client, document editor, and kanban board requires mature UI primitives — text rendering, drag & drop, rich text editing, complex layouts. The web platform has 30 years of maturity here. Rust GUI toolkits are promising but not ready for this level of UI complexity. The adapter pattern preserves the option to swap to a Rust frontend later without changing the service layer.

### Why desktop-first
KiwiStack targets organizations that value data sovereignty — the kind that runs servers on-premise. A desktop application that connects to their own Kiwi Gate feels natural. The web version comes later as a convenience layer, not the primary interface.

### Why proxy-only Tauri backend (V1)
The Tauri Rust backend starts as a simple HTTP proxy to Kiwi Gate. This minimizes the difference between kiwi-app and kiwi-web — both are essentially HTTP clients to the same API. Offline mode (local libsql cache, Loro CRDT sync) is a V2 feature that can be added to the Tauri backend without changing the frontend.
