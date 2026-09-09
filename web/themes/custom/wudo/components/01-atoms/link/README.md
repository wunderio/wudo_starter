# Link
This is the link component.
## Usage
Basic link
```
{{ include('trimble_theme:link', {
  text: 'Test link',
  url: 'https://www.trimble.com',
}, with_context = false) }}
```

CTA link with icon and external link
```
{{ include('trimble_theme:link', {
  text: 'Test CTA link',
  url: 'https://google.com',
  icon: 'arrow-next',
  variant: 'cta',
  is_external: true,
}, with_context = false) }}
```
## Themeable Link Tokens

This component uses CSS custom properties (tokens) to control link styling. Define them on `:root` or any parent element to theme all descendant links at once.

### Available Tokens

| Token | Type | Purpose | Example Value |
|---|---|---|---|
| `--link-color` | Context | Base link color (default state) | `#1a6ef5` |
| `--link-hover-color` | Context | Link color on hover / focus | `#0f4ebf` |
| `--link-cta-color` | Context | CTA (call-to-action) variant color | `#e63946` |
| `--link-cta-hover-color` | Context | CTA variant hover / focus color | `#b52d37` |

### Context Variables

All tokens listed above are **context variables**. They are designed to be set by a parent and inherited by all children through the CSS cascade. This means:

- **Set them on a parent** (`:root`, a page section, a wrapper) — never on the component itself.
- **Child components read them automatically** — no need to re-declare or pass them down manually.
- **Do not override them inside the component's own stylesheet** — doing so breaks the theming contract and prevents parents from controlling appearance.

```
┌─ :root / parent ─────────────────────┐
│  --link-color: #1a6ef5;              │  ← Define here
│                                      │
│  ┌─ child component ──────────────┐  │
│  │  color: var(--link-color);     │  │  ← Consume here
│  │  /* ✗ Do NOT redefine here */  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Usage

#### 1. Define the tokens on a parent

```css
/* Global theme */
:root {
  --link-color: #1a6ef5;
  --link-hover-color: #0f4ebf;
  --link-cta-color: #e63946;
  --link-cta-hover-color: #b52d37;
}

/* Scoped override for a section */
.dark-section {
  --link-color: #93c5fd;
  --link-hover-color: #bfdbfe;
  --link-cta-color: #fca5a5;
  --link-cta-hover-color: #fecaca;
}
```
