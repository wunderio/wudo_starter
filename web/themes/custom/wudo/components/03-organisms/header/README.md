# Header Component (`wudo:header`)

The primary site header organism. It manages the layout for branding, navigation, and utilities, with built-in support for "smart" sticky behavior via the `sticky-header` component.

## Features
- **Slot-based Architecture:** Modular areas for Branding, Navigation, and Utilities.
- **Optional Sticky Logic:** Toggle smart-sticky behavior (hide on scroll down, show on scroll up) with a single boolean.
- **Conditional Layouts:** Utility and Navigation sections only render if content is provided.
- **SDC Ready:** Fully compliant with Single Directory Component standards.

### Mobile menu solution using `wudo:drawer`
`_1_header.twig` - Mobile menu solution using `wudo:header` with `wudo:drawer` and `wudo:button` components.
Rename it to `header.twig`.


## Properties (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `is_sticky` | `boolean` | `false` | If true, wraps the main header in a `<sticky-header>` custom element. |
| `sticky_threshold` | `integer` | `150` | Scroll distance in pixels before the sticky behavior activates. |


## Slots

| Slot | Description |
| :--- | :--- |
| `branding` | Typically contains the Site Logo and Site Name. |
| `navigation` | Reserved for the primary menu and mobile toggle. |
| `utilities` | Secondary items like search, language switcher, or top-bar links. |


## Usage

### Standard Implementation (Embed)
Since this component uses slots, the `embed` tag is the preferred way to pass content from `page.html.twig`.

```twig
{% embed 'wudo:header' with {
  is_sticky: true,
  sticky_threshold: 100
} %}
  {% block utilities %}
    {{ page.header_top }}
  {% endblock %}

  {% block branding %}
    <a href="/" class="site-logo">
      <img src="/logo.svg" alt="Home" />
    </a>
  {% endblock %}

  {% block navigation %}
    {{ page.primary_menu }}
  {% endblock %}
{% endembed %}
```
