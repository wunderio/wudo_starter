# Reveal Component (`wudo-reveal`)

A universal SDC wrapper that provides a "reveal on scroll" animation for its content using the native Web Components API and Intersection Observer.

## Features
- **Performance Optimized:** Uses native *Intersection Observer API* instead of heavy scroll event listeners.
- **Universal Wrapper:** Can wrap any other component, image, or text block.
- **Highly Customizable:** Control animation types, delays, durations, and visibility thresholds directly via Twig props.
- **Resource Efficient:** Disconnects the observer immediately after the animation triggers to save browser resources.


> [!TIP]
> xdfcgdgh
>


## Properties (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `effect` | `string` | `fade-up` | Animation type: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`. |
| `delay` | `string` | `0s` | CSS time value for animation delay (e.g., `200ms`, `0.5s`). |
| `duration` | `string` | `0.8s` | CSS time value for animation duration (e.g., `1s`). |
| `threshold` | `float` | `0.15` | Visibility ratio (0.0 to 1.0) required to trigger the animation. |


## Usage

### Using `embed` (Recommended for complex content)
The most flexible way to use this component is by injecting content into the `content` block:

```twig
{% embed 'your_theme:reveal' with {
  effect: 'fade-up',
  delay: '250ms',
  threshold: 0.2
} %}
  {% block content %}
    <div class="promo-card">
      <h3>Hello World</h3>
      <p>This content will slide up gracefully when scrolled into view.</p>
    </div>
  {% endblock %}
{% endembed %}
```
