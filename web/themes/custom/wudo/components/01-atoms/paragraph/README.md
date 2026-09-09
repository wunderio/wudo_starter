# Paragraph

A foundational typography component designed for body text, supporting various sizes and HTML rendering options via the Canvas module.

### Description
The Paragraph component handles standard text content. It includes a toggle for HTML support and provides four distinct size variants to maintain typographic hierarchy.

- **Status:** `stable`
- **Group:** Atoms
- **Browser Support:** All modern browsers

### Props (Properties)
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | - | The text or HTML content (Ref: Canvas Text). |
| `size` | `enum` | `regular` | Variants: `extra-large`, `large`, `regular`, `small`. |
| `allow_html` | `boolean` | `false` | Whether to render content as raw HTML. |
| `modifier_class`| `string` | - | Additional CSS classes for custom styling. |

### Usage

```twig
{# Standard text #}
{{ include('wudo:paragraph', {
  content: 'This is a standard paragraph.',
  size: 'regular'
}, with_context = false) }}

{# HTML content with modifier #}
{{ include('wudo:paragraph', {
  content: 'This text has <strong>bold</strong> parts.',
  allow_html: true,
  size: 'large',
  modifier_class: 'custom-class'
}, with_context = false) }}
