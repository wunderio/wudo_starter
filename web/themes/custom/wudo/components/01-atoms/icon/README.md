# Icon

A foundational SVG icon component.

## Description
This component renders SVG icons using the `<use>` element, referencing symbols from a centralized assets directory. It features strict symbol validation via YAML enums to ensure consistency across the design system.

- **Status:** `stable`
- **Group:** Atoms

## Props (Properties)

| Property | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `symbol` | `enum` | **Yes** | - | Icon identifier (e.g., `chevron-down`, `menu`). |
| `size` | `enum` | No | `regular` | Predefined sizes: `small`, `regular`, `large`. |
| `alt` | `string` | No | - | Screen-reader text (leaves `aria-hidden="true"` if empty). |
| `modifier_class`| `string` | No | - | Extra CSS classes (e.g., for utility colors). |
| `assets_dir` | `string` | No | `@wudo/../assets` | Path to the SVG sprite folder. |

## Usage

```twig
{# Default Icon #}
{{ include('wudo:icon', {
  symbol: 'chevron-down'
}, with_context = false) }}

{# Large Accessible Icon #}
{{ include('wudo:icon', {
  symbol: 'download',
  size: 'large',
  alt: 'Download PDF',
  modifier_class: 'custom-class'
}, with_context = false) }}
```
## Tools
The `icon.helper.ts` utility serves as a central registry that maps SVG icons to unique identifiers, allowing them to be dynamically injected into components.
Look at `components/01-atoms/button/button.stories.tsx`
