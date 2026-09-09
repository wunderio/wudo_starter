# 📁 Link Manager (SDC Component)

A modern Drupal **Single Directory Component** that leverages **Native Web Components** to automatically manage external links. It identifies external domains, enforces security attributes, and injects an SVG icon without disrupting the page's visual layout.

## Features
* **Automatic:** Scans all `<a>` tags within the component's scope.
* **Secure:** Automatically adds `target="_blank"` and `rel="noopener noreferrer"`.
* **Encapsulated:** Uses **Shadow DOM** so icon styles won't conflict with your global CSS.
* **Reactive:** Uses a `MutationObserver` to handle links loaded dynamically via AJAX (e.g., Views "Load More").
* **Layout Friendly:** Uses `display: contents` to ensure the wrapper doesn't break Flexbox or Grid layouts.
* **Smart Filtering:** Automatically ignores links containing images (`<img>`) or those marked with a `data-ignore` attribute.

---

## Implementation

### Using `embed` (The Standard Way)
Wrap any block of content where you want to manage external links:

```twig
{% embed 'wudo:link-manager' %}
  {% block content %}
    <p>
      Check out <a href="https://example.com">this external site</a> for more info.
    </p>
    <p>
      Internal link: <a href="/about-us">About Us</a>
    </p>
  {% endblock %}
{% endembed %}
```
### Using `include` (For Single Links)
For single links, you can use `include`:

```twig
{{ include('wudo:link-manager', {}, with_context = false) }}
  <a href="https://example.com">External Site</a>
{{ endinclude }}
```

### Manual Bypass
To prevent a specific external link from being processed, add the `data-ignore` attribute:
```html
<a href="[https://external.com](https://external.com)" data-ignore>External link without icon</a>
```

