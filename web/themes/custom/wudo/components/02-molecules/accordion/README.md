# Accordion

A modern, accessible content toggle component built on native HTML `<details>` with CSS animation and "exclusive accordion" support.

### Description
This component allows for collapsing and expanding content sections. By utilizing the `name` attribute, it can function as an "exclusive accordion" where only one section remains open at a time.

- **Status:** `stable`
- **Browser Support:** Chrome 129+ (full animation), Safari/Firefox (functional with instant or basic transitions).

### Props (Properties)
| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | The heading text visible when collapsed. |
| `content` | `string/render` | Yes | The body content revealed when expanded. |
| `name` | `string` | No | Group name for exclusive behavior (only one open at once). |
| `expanded` | `boolean` | No | Whether the component is open by default. |

### Usage

```twig
{# Standard Accordion #}
{% include 'wudo:accordion' with {
  title: 'Why use SDC?',
  content: 'It is structured and modern.',
  expanded: true
} only %}

{# Exclusive Accordion Group #}
{% include 'wudo:accordion' with {
  title: 'FAQ Question 1',
  content: 'FAQ Answer 1',
  name: 'faq-group'
} only %}
