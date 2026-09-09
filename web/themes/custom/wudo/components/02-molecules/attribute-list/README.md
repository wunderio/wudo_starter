# Attribute list (SDC)
A flexible and accessible attribute list component for displaying key-value pairs in a structured format. Ideal for product specifications, user profiles, or any scenario requiring organized data presentation.
## Features
* **Structured Layout:** Presents attributes in a clean, easy-to-read format.
* **Accessibility (a11y):** Built with semantic HTML to ensure compatibility with screen readers and assistive technologies.
* **Responsive Design:** Adapts seamlessly to various screen sizes and devices.
* **Customizable Styling:** Easily styled via CSS variables to match your site's design.
* **Flexible Data Input:** Accepts dynamic data for easy integration with Drupal or other CMS platforms.
* **Multiple Display Options:** Supports different layouts such as grid or list views.

## Usage
To use the Attribute List component in your Drupal theme, include the following Twig template where you want the attribute list to appear:

```twig
{# paragraph--technical-data-list.html.twig #}

{% set spec_items = [] %}

{% for item in paragraph.field_spec_rows %}
  {% set row = item.entity %}

  {% set spec_items = spec_items|merge([{
    'label': row.field_key.entity.label,
    'value': row.field_value.value,
    'highlight': row.field_highlight.value ? true : false
  }]) %}
{% endfor %}

{{ include('wudo:attribute-list', {
  'title': 'Specification',
  'items': spec_items,
  'display_mode': 'table'
}, with_context = false) }}
```
