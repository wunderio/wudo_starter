
# Article card

This is the article card component.

## Usage

This component can be used within Experience Builder and other page builders
that support SDC. It can also be added to other components and theme templates.

How to use in the Drupal template (i.e. node--article--teaser.html.twig):

```twig
{% set createdDate = node.getCreatedTime|format_date('short') %}

{% embed 'wudo:article-card' with {
  card_meta: createdDate,
  title: label,
  title_url: url,
  summary: content.body,
} %}

  {% block image %}
    {{ content.field_image }}
  {% endblock %}

{% endembed %}
```
