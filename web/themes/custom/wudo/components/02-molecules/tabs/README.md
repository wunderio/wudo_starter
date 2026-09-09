# Tabs

A flexible, ARIA-compliant tabs component designed for Drupal SDC. It uses a "Container/Item" slot-based architecture to support unlimited content types.
Tested in Drupal Canvas.

## Overview
This system consists of two components:
1. **Tabs** (Container) – Handles navigation, ARIA roles, and keyboard interactions.
2. **Tab Item** (Slide/Pane) – Holds the content and provides the title for the navigation.

- **Status:** `experimental`
- **Group:** Molecules
- **Namespace:** `@wudo`
- **A11y:** WAI-ARIA 1.2 Tab Pattern (Arrows, Home, End key support)
- **Drupal Canvas:** `Yes`

## Components & Props

### 1. Tabs (The Wrapper)
| Prop / Slot | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tab_content` | `slot` | **Yes** | Place `tab-item` components here. |
| `attributes` | `object` | No | Drupal Attribute object for custom classes/IDs. |

### 2. Tab Item (The Content)
| Prop / Slot | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | The label shown in the tab navigation. |
| `content` | `slot` | **Yes** | The actual content (text, images, or other components). |


## Usage

### In Drupal Twig Templates
```twig
{% component 'wudo:tabs' %}
  {% block tab_content %}

    {% component 'wudo:tab-item' with { title: 'First Tab' } %}
      {% block content %}
        <p>This is the content of the first tab.</p>
      {% endblock %}
    {% endcomponent %}

    {% component 'wudo:tab-item' with { title: 'Second Tab' } %}
      {% block content %}
        <p>This is the content of the second tab.</p>
      {% endblock %}
    {% endcomponent %}

  {% endblock %}
{% endcomponent %}
```

Dynamic way using Drupal fields
```twig
{% component 'wudo:tabs' %}
  {% block tab_content %}
    {% for item in content.field_paragraphs %}
      {% component 'wudo:tab-item' with {
        title: item.entity.field_title.value
      } %}
        {% block content %}
          {{ item }}
        {% endblock %}
      {% endcomponent %}
    {% endfor %}
  {% endblock %}
{% endcomponent %}
```
