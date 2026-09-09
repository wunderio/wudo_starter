# Back to Top Component (`back-to-top`)

A floating action button that appears when the user scrolls down. It includes an optional radial progress indicator showing how much of the page has been read.

## Features
- **Smart Visibility:** Only appears after reaching a configurable scroll threshold.
- **Reading Progress:** Visual feedback via a circular SVG progress bar.
- **Smooth Animation:** Uses native smooth scrolling for returning to the top.
- **Accessible:** Includes ARIA labels and button semantics.


## Properties (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `threshold` | `integer` | `400` | Pixels scrolled before button becomes visible. |
| `show_progress` | `boolean` | `true` | Whether to show the circular progress stroke. |


## Customization

You can style the component using these CSS variables:
- `--bg`: Button background color.
- `--progress-color`: Color of the progress indicator.

## Usage

Place it anywhere in your `page.html.twig`, ideally near the footer:

```twig
{{ include('wudo:back-to-top', {
  threshold: 500,
  show_progress: true
}) }}
```
