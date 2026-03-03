# DESIGN.md — Kiwi UI Design System

> From the kiwi fruit to the desktop. Every pixel maps to the brand.
>
> This file defines how the KiwiStack brand design system (kiwistack.io/design-system)
> translates into the kiwi-app and kiwi-web interfaces.

---

## Two Modes, One System

The KiwiStack brand site uses a **light theme** (cream background, green text).
The application uses a **dark theme** (near-black background, light text).

Both themes share the same color tokens, typography families, and spacing scale.
The dark theme is primary — it is what users see every day. The light theme
exists only for the marketing site and print contexts.

---

## Color Tokens

### Fruit Anatomy (Brand Colors)

These map directly from the design system at kiwistack.io/design-system.

```css
/* Core — Infrastructure layer */
--kiwi-core:        #F5F5EE;
--kiwi-green:       #7CB342;   /* Primary green, flesh */
--kiwi-bright:      #9CCC65;   /* Lighter flesh, highlights */
--kiwi-light:       #C5E1A5;   /* Pale green, tag backgrounds */
--kiwi-skin:        #795548;   /* Skin layer, brown accent */
--kiwi-skin-light:  #A1887F;   /* Light skin, hover states */
--kiwi-dark:        #33691E;   /* Headings, brand text */
--seed-black:       #1A1A1A;   /* Body text (light), dark backgrounds (dark) */
--bg-cream:         #FAFFF5;   /* Light theme page background */
--accent-lime:      #CDDC39;   /* Progress bars, accents */
--vine-green:       #558B2F;   /* Vine section */
--vine-brown:       #5D4037;   /* Vine section dark */
```

### Seed Service Colors (Pop Colors)

Each KiwiStack service has a dedicated pop color. These are **non-negotiable** —
every reference to a service must use its assigned color.

```css
--pop-coral:   #FF7043;   /* Kiwi Mail — email, calendar, contacts */
--pop-teal:    #26A69A;   /* Kiwi Chat — messaging */
--pop-blue:    #42A5F5;   /* Kiwi Meet — video, audio */
--pop-purple:  #AB47BC;   /* Kiwi Work — tasks, projects, kanban */
--pop-pink:    #EC407A;   /* Kiwi Docs — documents, knowledge base */
--pop-amber:   #FFA726;   /* Kiwi Store / Core accents */
```

### Dark Theme Palette (Application)

Derived from the brand colors, adapted for the dark UI shown in the mockups.

```css
/* Backgrounds — layered depth */
--app-bg:               #1A1A1A;   /* Main window background (seed-black) */
--app-bg-raised:        #242424;   /* Cards, panels, sidebar items */
--app-bg-surface:       #2A2A2A;   /* Input fields, elevated surfaces */
--app-bg-hover:         #333333;   /* Hover state on surfaces */
--app-bg-active:        #3A3A3A;   /* Active/selected state */

/* Sidebar */
--sidebar-bg:           #1A1A1A;   /* Same as app-bg */
--sidebar-icon-bg:      transparent;
--sidebar-icon-active:  var(--pop-coral);  /* Active service icon gets its pop color */
--sidebar-indicator:    var(--kiwi-green); /* Online status dot at bottom */

/* Text */
--text-primary:         #E8E8E8;   /* Main body text */
--text-secondary:       #999999;   /* Subtitles, timestamps, previews */
--text-muted:           #666666;   /* Disabled, placeholder text */
--text-on-color:        #FFFFFF;   /* Text on colored backgrounds */

/* Borders & dividers */
--border-subtle:        #333333;   /* Card borders, dividers */
--border-input:         #FF7043;   /* Input field borders use service pop color */
--border-focus:         var(--kiwi-green);  /* Focus ring */

/* AI Assistant panel */
--assistant-bg:         #1E1E1E;   /* Slightly different from app-bg */
--assistant-user-msg:   #3A5F28;   /* User message bubble — dark olive green */
--assistant-ai-msg:     #2A2A2A;   /* AI message bubble — raised surface */
--assistant-action-bg:  #242424;   /* Action cards (Auto-reply, Calendar) */
--assistant-action-border: #333333;

/* Interactive */
--button-primary-bg:    transparent;
--button-primary-border: var(--kiwi-green);
--button-primary-text:  var(--text-primary);
--button-secondary-bg:  transparent;
--button-secondary-border: #555555;

/* Unread indicators */
--unread-dot:           var(--pop-coral);  /* Orange dot next to unread items */
```

### Light Theme Palette (Future / Marketing)

```css
--app-bg:           #FAFFF5;   /* bg-cream */
--app-bg-raised:    #FFFFFF;
--app-bg-surface:   #F5F5EE;   /* kiwi-core */
--text-primary:     #1A1A1A;   /* seed-black */
--text-secondary:   #666666;
--border-subtle:    #E0E0E0;
```

---

## Typography

Three font families, same as the brand site. No substitutions.

```css
/* Families */
--font-heading:  'Quicksand', sans-serif;
--font-body:     'Nunito', sans-serif;
--font-mono:     'JetBrains Mono', monospace;

/* Load via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Type Scale

| Token | Family | Weight | Size | Line Height | Usage |
|-------|--------|--------|------|-------------|-------|
| `--type-brand` | Quicksand | 700 | 4.2rem | 1.1 | Brand wordmark "KiwiStack®" |
| `--type-h1` | Quicksand | 700 | 2.2rem | 1.2 | Page titles ("Automatic Replies") |
| `--type-h2` | Quicksand | 700 | 1.15rem | 1.3 | Section headers, card titles |
| `--type-h3` | Quicksand | 600 | 1rem | 1.3 | Sub-headers |
| `--type-body` | Nunito | 400 | 1.05rem | 1.6 | Body text, email content |
| `--type-body-sm` | Nunito | 400 | 0.9rem | 1.5 | Secondary text, previews |
| `--type-caption` | Nunito | 400 | 0.8rem | 1.4 | Timestamps, metadata |
| `--type-label` | Nunito | 600 | 0.85rem | 1.3 | Form labels ("Start", "End", "Message") |
| `--type-badge` | JetBrains Mono | 600 | 0.75rem | 1 | Badges ("KIWI MAIL"), tech labels |
| `--type-tab` | Nunito | 600 | 0.9rem | 1.3 | Tab bar items ("Inbox", "Drafts", "Sent") |
| `--type-nav` | Nunito | 500 | 0.9rem | 1.3 | Sidebar navigation items |
| `--type-input` | Nunito | 400 | 0.95rem | 1.4 | Input field text |
| `--type-code` | JetBrains Mono | 400 | 0.85rem | 1.5 | Code blocks, config values |

### Typography Rules

- **Headings** always use Quicksand. No exceptions.
- **Body text** always uses Nunito. No exceptions.
- **Technical labels and badges** always use JetBrains Mono uppercase with letter-spacing: 0.05em.
- **Never use font-weight below 400** — thin weights are unreadable on dark backgrounds.
- **Email body content** uses Nunito at `--type-body` scale, even if the original email used a different font.

---

## Spacing Scale

Consistent with the brand site's 4px-based grid.

```css
--space-1:   4px;    /* Tight gaps: between badge text and border */
--space-2:   8px;    /* Icon margins, inline gaps */
--space-3:   12px;   /* Badge gaps, small padding */
--space-4:   16px;   /* Grid gaps, card inner padding, list item padding */
--space-5:   20px;   /* Card padding, input field padding */
--space-6:   24px;   /* Section inner margins */
--space-8:   32px;   /* Between major sections */
--space-10:  40px;   /* Section horizontal padding */
--space-12:  48px;   /* Large vertical gaps */
```

---

## Layout Structure

The app follows a **three-column layout** with a fixed icon sidebar.

```
┌──────┬────────────────────────┬────────────────────┬──────────────────┐
│ Icon │     Service Panel      │    Content Panel    │   AI Assistant   │
│ Bar  │     (contextual)       │    (main content)   │   (collapsible)  │
│      │                        │                     │                  │
│ 64px │      ~260px            │      flexible       │     ~300px       │
└──────┴────────────────────────┴────────────────────┴──────────────────┘
```

### Icon Bar (leftmost)

- **Width**: 64px fixed
- **Background**: `--app-bg` (#1A1A1A)
- **Top**: Kiwi logo (small variant, kiwi-logo-small.svg) — with green glow ring on hover
- **Icons**: One per service, stacked vertically, 40px touch target
- **Active state**: The icon background gets a subtle rounded rectangle in the service's pop color at ~15% opacity, with the icon itself in full pop color
- **Inactive state**: Icons in `--text-secondary` (#999999)
- **Bottom**: Green status dot (`--kiwi-green`, 10px) indicating connection status
- **Order from top**: Logo, Mail, Chat, Meet, Docs, Work, Store, Search

### Service Panel (second column)

- **Width**: ~260px, resizable
- **Background**: `--app-bg` (#1A1A1A) — no visual separation from icon bar
- **Content varies by service**:
  - Mail: folder/message list with sender name (Quicksand 600), subject (Nunito 500), preview (Nunito 400, `--text-secondary`)
  - Chat: channel list
  - Work: project list
  - Configuration sub-views: settings sidebar (Auto-reply, Signatures, Filters, Folders, Security)
- **Active item**: subtly highlighted with `--app-bg-hover`
- **Unread indicator**: orange dot (`--pop-coral`, 8px) left of the sender name

### Content Panel (main area)

- **Background**: `--app-bg` (#1A1A1A)
- **Top**: Tab bar for the active service (e.g., "Inbox | Drafts | Sent | Deleted | Junk | Archive | Configuration")
  - Active tab: text in pop color of the service + underline
  - Inactive tabs: `--text-secondary`
- **Content**: service-specific view
- **Separated from service panel** by a subtle vertical divider (`--border-subtle`)

### AI Assistant Panel (rightmost)

- **Width**: ~300px, collapsible
- **Background**: `--assistant-bg`
- **Header**: "AI Assistant" in `--kiwi-green` (Quicksand 700)
- **Chat flow**: bottom-anchored, newest messages at bottom
- **User messages**: dark olive green bubble (`--assistant-user-msg`), text in `--text-on-color`, rounded corners (12px)
- **AI messages**: dark surface bubble (`--assistant-ai-msg`), text in `--text-primary`, rounded corners (12px)
- **Action cards**: bordered cards with service icon + action name in the service's pop color (e.g., mail icon + "Auto-reply Activation" in `--pop-coral`)
- **Input**: text input at the very bottom with a blinking green cursor (`--kiwi-green`)

---

## Component Specifications

### Service Badge

As seen in the "KIWI MAIL" badge above the content area.

```css
.service-badge {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--pop-coral);                /* Service pop color */
  background: transparent;
  border: 1.5px solid var(--pop-coral);   /* Service pop color */
  border-radius: 20px;
  padding: 4px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.service-badge .icon {
  width: 16px;
  height: 16px;
  color: inherit;
}
```

### Form Inputs

As seen in the auto-reply configuration (Start/End dates, Message textarea).

```css
.input-field {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-primary);
  background: transparent;
  border: 1.5px solid var(--border-subtle);
  border-radius: 8px;
  padding: 12px 16px;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: var(--pop-coral);         /* Active service pop color */
  outline: none;
}
.input-field::placeholder {
  color: var(--text-muted);
}
```

**Key pattern**: Input borders use the **active service's pop color** on focus, not a generic green. In the Kiwi Mail context, that's `--pop-coral`. In Kiwi Chat, it would be `--pop-teal`.

### Radio Buttons & Checkboxes

```css
.radio-active, .checkbox-active {
  accent-color: var(--pop-coral);         /* Service pop color */
}
```

Highlighted options (like "Send automatic replies") get a subtle border in the service pop color around the entire row.

### Action Buttons

Two variants visible in the mockups:

```css
/* Primary — dashed border animation (Apply button) */
.btn-primary {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  background: transparent;
  border: 2px dashed var(--kiwi-green);
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
}
/* The Apply button in the mockup has a multi-color dashed border
   (green, amber, pink, purple) — this is decorative emphasis for
   AI-proposed actions. Implement as a gradient border or
   animated border segments. */

/* Secondary — solid subtle border (Edit button) */
.btn-secondary {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1.5px solid var(--border-subtle);
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
}
```

### AI Action Cards

The action cards in the AI Assistant panel (e.g., "Auto-reply Activation", "Calendar Event Creation").

```css
.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--assistant-action-bg);
  border: 1px solid var(--assistant-action-border);
  border-radius: 10px;
  cursor: pointer;
}
.action-card .icon {
  color: var(--pop-coral);     /* Service pop color */
  width: 20px;
  height: 20px;
}
.action-card .label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--pop-coral);     /* Service pop color */
}
```

### Mail List Item

```css
.mail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
}
.mail-item:hover {
  background: var(--app-bg-hover);
}
.mail-item.selected {
  background: var(--app-bg-active);
}
.mail-item .sender {
  font-family: var(--font-heading);    /* Quicksand */
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
}
.mail-item .subject {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--text-primary);
}
.mail-item .preview {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mail-item .unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pop-coral);
}
```

### Tab Bar

```css
.tab-bar {
  display: flex;
  gap: 24px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.tab {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 12px 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.tab.active {
  color: var(--pop-coral);                /* Service pop color */
  border-bottom-color: var(--pop-coral);
}
.tab:hover:not(.active) {
  color: var(--text-primary);
}
```

---

## Icon System

### Service Icons (Sidebar)

Each service has a distinctive icon. Use Lucide icons as the base set, with custom SVGs where needed.

| Service | Icon | Pop Color | Lucide Name |
|---------|------|-----------|-------------|
| Mail | Envelope | `--pop-coral` #FF7043 | `mail` |
| Chat | Message bubble | `--pop-teal` #26A69A | `message-square` |
| Meet | Video camera | `--pop-blue` #42A5F5 | `video` |
| Docs | File/document | `--pop-pink` #EC407A | `file-text` |
| Work | Grid/kanban | `--pop-purple` #AB47BC | `layout-grid` |
| Store | Folder | `--pop-amber` #FFA726 | `folder` |
| Search | Magnifying glass | `--kiwi-green` #7CB342 | `search` |

### Icon Sizing

```css
--icon-sm:   16px;   /* Inside badges, inline with text */
--icon-md:   20px;   /* Inside action cards, list items */
--icon-lg:   24px;   /* Sidebar service icons */
--icon-xl:   32px;   /* Kiwi logo in sidebar top */
```

---

## Interaction Patterns

### Service Color Cascading

When the user navigates to a service, its pop color becomes the **accent color** for the entire content area. This means:

- Tab bar active state uses the service's pop color
- Input focus borders use the service's pop color
- Service badge uses the service's pop color
- Sidebar active icon uses the service's pop color
- AI action cards for that service use the service's pop color

This is implemented via a CSS variable override on the content panel:

```css
/* Set dynamically based on active service */
.content-panel[data-service="mail"]     { --service-color: var(--pop-coral); }
.content-panel[data-service="chat"]     { --service-color: var(--pop-teal); }
.content-panel[data-service="meet"]     { --service-color: var(--pop-blue); }
.content-panel[data-service="work"]     { --service-color: var(--pop-purple); }
.content-panel[data-service="docs"]     { --service-color: var(--pop-pink); }
.content-panel[data-service="store"]    { --service-color: var(--pop-amber); }
.content-panel[data-service="search"]   { --service-color: var(--kiwi-green); }

/* Then all components use --service-color instead of hardcoded colors */
.tab.active { color: var(--service-color); }
.input-field:focus { border-color: var(--service-color); }
.service-badge { color: var(--service-color); border-color: var(--service-color); }
```

### AI-Proposed Changes

When the AI Assistant proposes changes (like the auto-reply configuration), the affected form fields are highlighted with borders in the service's pop color. The "Apply" button gets an animated multi-color dashed border to draw attention. The "Edit" button remains neutral.

This creates a clear visual distinction: **orange-bordered fields = AI-proposed values, neutral fields = untouched**.

### Transitions

```css
--transition-fast:   0.15s ease;   /* Hover states, focus rings */
--transition-normal: 0.25s ease;   /* Panel transitions, selections */
--transition-slow:   0.4s ease;    /* Sidebar collapse, panel resize */
```

---

## Responsive Behavior

### Desktop (kiwi-app, primary)

- Minimum window: 1024 x 640
- All three columns visible by default
- AI Assistant panel collapsible via toggle
- Service panel resizable (200px–400px)

### Compact Desktop

- Below 1200px width: AI Assistant panel auto-collapses to an icon button
- Below 1024px: Service panel collapses to icon-only mode

### Web (kiwi-web, future)

- Same breakpoints apply
- Below 768px: single-column mobile layout with bottom tab navigation
- Mobile layout is out of scope for V1

---

## Accessibility

- **Contrast**: All text meets WCAG AA on dark backgrounds. `--text-primary` (#E8E8E8) on `--app-bg` (#1A1A1A) = 13.5:1 ratio.
- **Focus rings**: Visible 2px solid `--border-focus` on all interactive elements when using keyboard navigation.
- **Reduced motion**: Respect `prefers-reduced-motion` — disable all transitions.
- **Font scaling**: Use `rem` units for all type sizes. The base size is set on `<html>` and can be adjusted.
- **Color independence**: Never convey meaning through color alone. Unread dots are accompanied by bold sender names. Active tabs have both color and underline.

---

## File Reference

```
packages/core/styles/
├── tokens.css        ← All CSS variables defined above
├── reset.css         ← Minimal CSS reset
├── typography.css    ← Font imports + type scale classes
├── components.css    ← Shared component styles
└── themes/
    ├── dark.css      ← Dark theme variable overrides (default)
    └── light.css     ← Light theme variable overrides (future)
```

---

## Anti-Patterns

- **Never use pure white (#FFFFFF) as a background** in dark theme. Use `--app-bg-raised` or lighter.
- **Never use pure black (#000000) as a text color** in light theme. Use `--seed-black` (#1A1A1A).
- **Never hardcode a service color** — always use `var(--service-color)` so it cascades correctly.
- **Never mix font families** within a single text element.
- **Never use box-shadow for elevation** in dark theme — use border color differentiation instead.
- **Never use opacity to create disabled states** — use `--text-muted` color explicitly.
- **Never invent new colors** — every color in the app must trace back to a token in this file.
