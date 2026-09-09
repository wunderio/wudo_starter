# Sticky Header Component (`sticky-header`)

A lightweight, high-performance wrapper component that adds "Smart Sticky" functionality to any header or navigation bar. It stays hidden when scrolling down to minimize distractions and automatically reveals itself when the user scrolls back up.

## Features
- **Zero Configuration Layout:** Works as a wrapper around any existing HTML structure or component.
- **Smart Reveal:** Intelligently toggles visibility based on scroll direction.
- **Performance Optimized:** Uses `requestAnimationFrame` and passive scroll listeners to ensure smooth performance even on low-end devices.
- **UX Focused:** Prevents "Header fatigue" by only showing navigation when the user shows intent to navigate (scrolling up).


## Properties (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `threshold` | `integer` | `150` | The scroll distance in pixels before the header becomes sticky. |
| `content` | `block` | `n/a` | The inner HTML/components of the header. |


## Component Structure

- `sticky-header.twig` – The wrapper element.
- `sticky-header.js` – Intersection-free scroll direction logic.
- `sticky-header.scss` – CSS transitions and fixed positioning states.
- `sticky-header.component.yml` – SDC metadata (defines `threshold` as integer).


## Usage

### Using `embed` (The Standard Way)
Wrap your site's main header to give it smart sticky powers:

```twig
{% embed 'your_theme:sticky-header' with {
  threshold: 200
} %}
  {% block content %}
    <header class="site-header">
      <div class="container">
        <a href="/" class="logo">MyBrand</a>
        <nav>...</nav>
      </div>
    </header>
  {% endblock %}
{% endembed %}
```
