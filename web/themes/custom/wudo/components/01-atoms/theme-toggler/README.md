# Theme Toggler Component

A smart Web Component that manages Light/Dark mode for the entire site.

## Features
- **Persistence**: Remembers user choice via `localStorage`.
- **System Sync**: Detects user's OS preference (`prefers-color-scheme`).
- **Tab Syncing**: Changes theme across all open browser tabs simultaneously.
- **Islands Ready**: Can be placed anywhere in Drupal via SDC.

## Global Integration
The component sets a `data-theme="light|dark"` attribute on the `<html>` element.
Use CSS variables mapped to this attribute for global styling.
