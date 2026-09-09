# Wudo Carousel

A lightweight, high-performance, and accessible content slider built as a **Native Web Component**. This organism leverages CSS Scroll Snap for native-feeling momentum and smooth hardware-accelerated transitions.

### Props (Properties)

| Property | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `loop` | `boolean` | No | `true` | If enabled, the carousel will wrap around to the first slide after reaching the last one. |
| `items_per_view` | `integer` | No | `1` | Number of items visible simultaneously on desktop viewports (>= 50rem). Supports values 1, 2, 3, or 4. |

### Slots

| Slot | Required | Description |
| :--- | :--- | :--- |
| `items` | **Yes** | The content area for slides. Each child element should ideally be wrapped in a `<div class="carousel__slide">`. |

## Usage

```twig
{% embed 'wudo:carousel' with {
  loop: true,
  items_per_view: 3
} %}
  {% block items %}
    {% for product in products %}
      <div class="carousel__slide">
        {{ drupal_entity('commerce_product', product.id, 'teaser') }}
      </div>
    {% endfor %}
  {% endblock %}
{% endembed %}
```
